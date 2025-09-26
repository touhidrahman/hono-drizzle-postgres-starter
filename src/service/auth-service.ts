import { password } from 'bun'
import { eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import { verify } from 'hono/jwt'
import { usersTable } from '../config/db/schema'
import { logger } from '../config/logging'
import redis from '../config/redis'
import {
    type LoginUserRequest,
    type RegisterUserRequest,
    type ResetPasswordRequest,
    type TokenResponse,
    toUserResponse,
    UserRepository,
    type UserResponse,
} from '../model/user-model'
import { generateAccessToken, generateRefreshToken } from '../util/jwt-util'

export class AuthService {
    static async register(request: RegisterUserRequest): Promise<UserResponse> {
        const existingUser = await UserRepository.count(
            eq(usersTable.email, request.email),
        )

        if (existingUser > 0) {
            throw new HTTPException(400, {
                message: 'Email already taken',
            })
        }

        request.password = await password.hash(request.password, {
            algorithm: 'bcrypt',
            cost: 10,
        })

        const user = await UserRepository.create(request)

        logger.info('User registered successfully')

        return toUserResponse(user)
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const [user] = await UserRepository.findByColumn('email', request.email)

        if (!user || !user.password) {
            throw new HTTPException(401, {
                message: 'Email or Password incorrect',
            })
        }

        if (!user.emailVerified) {
            throw new HTTPException(401, {
                message: 'Email not verified',
            })
        }

        const isPasswordMatch = await password.verify(
            request.password,
            user.password,
            'bcrypt',
        )

        if (!isPasswordMatch) {
            throw new HTTPException(401, {
                message: 'Email or password is incorrect',
            })
        }

        const [access, refresh] = await Promise.all([
            generateAccessToken(user),
            generateRefreshToken(user),
        ])

        const response = toUserResponse(user)
        response.accessToken = access
        response.refreshToken = refresh

        const loginAt = new Date()
        await UserRepository.update(user.id, 'id', { loginAt })

        logger.info('User logged in successfully')

        return response
    }

    static async logout(
        token: string,
        refreshToken: string,
        userId: string,
    ): Promise<void> {
        await redis.set(`blacklist:${token}`, 'true')
        await redis.del(`user:${token}`)

        const jwtPayload = await verify(token, process.env.JWT_REFRESH_SECRET!)
        if (jwtPayload.id !== userId) {
            throw new HTTPException(401, {
                message: 'Unauthorized',
            })
        }

        await redis.set(`blacklist:${refreshToken}`, 'true')

        logger.info('User logged out successfully')

        return
    }

    static async resetPassword(
        request: ResetPasswordRequest,
    ): Promise<UserResponse> {
        const storedOTP = await redis.get(`otp:${request.email}`)
        if (storedOTP !== String(request.otp)) {
            throw new HTTPException(401, {
                message: 'Invalid OTP',
            })
        }

        await redis.del(`otp:${request.email}`)

        const pw = await password.hash(request.password, {
            algorithm: 'bcrypt',
            cost: 10,
        })

        const user = await UserRepository.update(request.email, 'email', {
            password: pw,
        })

        logger.info('Password reset successfully')

        return toUserResponse(user)
    }

    static async googleLogin(request: any): Promise<UserResponse> {
        return await UserRepository.transaction(async (repo) => {
            let [user] = await repo.findByColumn('email', request.email)

            if (!user) {
                const userData = {
                    email: request.email,
                    name: request.name,
                    role: 'USER',
                    loginAt: new Date(),
                    emailVerified: new Date(),
                }
                user = await repo.create(userData)
            } else {
                const loginAt = new Date()
                await repo.update(user.id, 'id', { loginAt })
            }

            const [access, refresh] = await Promise.all([
                generateAccessToken(user),
                generateRefreshToken(user),
            ])

            const response = toUserResponse(user)
            response.accessToken = access
            response.refreshToken = refresh

            logger.info('User logged in successfully')

            return response
        })
    }

    static async refreshToken(request: {
        refreshToken: string
    }): Promise<TokenResponse> {
        const isBlacklisted = await redis.exists(
            `blacklist:${request.refreshToken}`,
        )
        if (isBlacklisted) {
            throw new HTTPException(401, {
                message: 'Token has been invalidated',
            })
        }

        const jwtPayload = await verify(
            request.refreshToken,
            process.env.JWT_REFRESH_SECRET!,
        )
        const [user] = await UserRepository.findByColumn('id', jwtPayload.id)
        if (jwtPayload.id !== user.id) {
            throw new HTTPException(401, {
                message: 'Unauthorized',
            })
        }

        const [access, refresh] = await Promise.all([
            generateAccessToken(user),
            generateRefreshToken(user),
        ])

        return { accessToken: access, refreshToken: refresh } as TokenResponse
    }
}

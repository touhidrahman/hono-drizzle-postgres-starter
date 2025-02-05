import {
    LoginUserRequest,
    RegisterUserRequest,
    ResetPasswordRequest,
    toUserResponse,
    UserRepository,
    UserResponse
} from "../model/user-model";
import {eq} from "drizzle-orm";
import {User, usersTable} from "../config/db/schema";
import {HTTPException} from "hono/http-exception";
import {password} from "bun";
import {logger} from "../config/logging";
import {generateAccessToken, generateRefreshToken} from "../util/jwt-util";
import redis from "../config/redis";

export class AuthService {
    static async register(request: RegisterUserRequest): Promise<UserResponse> {
        const existingUser = await UserRepository.count(eq(usersTable.email, request.email));

        if (existingUser > 0) {
            throw new HTTPException(400, {
                message: 'Email already taken'
            });
        }

        request.password = await password.hash(request.password, {
            algorithm: "bcrypt",
            cost: 10
        });

        const user = await UserRepository.create(request);

        logger.info("User registered successfully");

        return toUserResponse(user);
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const [user] = await UserRepository.findByColumn('email', request.email);

        if (!user || !user.password) {
            throw new HTTPException(401, {
                message: 'Email or Password incorrect'
            });
        }

        const isPasswordMatch = await password.verify(request.password, user.password, "bcrypt");

        if (!isPasswordMatch) {
            throw new HTTPException(401, {
                message: 'Email or password is incorrect'
            });
        }

        const [access, refresh] = await Promise.all([
            generateAccessToken(user),
            generateRefreshToken(user)
        ]);

        const response = toUserResponse(user);
        response.accessToken = access;
        response.refreshToken = refresh;

        const loginAt = new Date();
        await UserRepository.update(user.id, "id", {loginAt});

        logger.info("User logged in successfully");

        return response;
    }

    static async logout(token: string): Promise<void> {
        await redis.set(`blacklist:${token}`, 'true');
        await redis.del(`user:${token}`);

        logger.info("User logged out successfully");

        return;
    }

    static async resetPassword(request: ResetPasswordRequest): Promise<UserResponse> {
        const storedOTP = await redis.get(`otp:${request.email}`);
        if (storedOTP !== String(request.otp)) {
            throw new HTTPException(401, {
                message: 'Invalid OTP'
            });
        }

        await redis.del(`otp:${request.email}`);

        const pw = await password.hash(request.password, {
            algorithm: "bcrypt",
            cost: 10
        });

        const user = await UserRepository.update(request.email, 'email', {
            password: pw,
        });

        logger.info("Password reset successfully");

        return toUserResponse(user);
    }

    static async googleLogin(request: any): Promise<UserResponse> {
        return await UserRepository.transaction(async (repo) => {
            let [user] = await repo.findByColumn('email', request.email);

            if (!user) {
                const userData = {
                    email: request.email,
                    name: request.name,
                    role: 'USER',
                    loginAt: new Date(),
                    emailVerified: new Date()
                };
                user = await repo.create(userData);
            } else {
                const loginAt = new Date();
                await repo.update(user.id, 'id', {loginAt});
            }

            const [access, refresh] = await Promise.all([
                generateAccessToken(user),
                generateRefreshToken(user)
            ]);

            const response = toUserResponse(user);
            response.accessToken = access;
            response.refreshToken = refresh;

            logger.info("User logged in successfully");

            return response;
        });
    }
}
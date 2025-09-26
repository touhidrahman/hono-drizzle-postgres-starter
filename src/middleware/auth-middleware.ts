import type { Context, MiddlewareHandler, Next } from 'hono'
import type { JWTPayload } from 'hono/dist/types/utils/jwt/types'
import { HTTPException } from 'hono/http-exception'
import { verify } from 'hono/jwt'
import redis from '../config/redis'
import { UserRepository } from '../model/user-model'

export const authMiddleware = (
    secret: string,
    role?: string,
): MiddlewareHandler => {
    return async (c: Context, next: Next) => {
        const authHeader = c.req.header('Authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            throw new HTTPException(401, { message: 'Unauthorized' })
        }

        const token = authHeader.split(' ')[1]
        const isBlacklisted = await redis.exists(`blacklist:${token}`)

        if (isBlacklisted) {
            throw new HTTPException(401, {
                message: 'Token has been invalidated',
            })
        }

        const jwtPayload: JWTPayload = await verify(token, secret)
        const userRedis = await redis.get(`user:${jwtPayload.id}`)

        let user

        if (userRedis) {
            user = JSON.parse(userRedis)
        } else {
            user = await UserRepository.findById(jwtPayload.id as string)
            await redis.set(
                `user:${jwtPayload.id}`,
                JSON.stringify(user),
                'EX',
                3 * 60 * 60,
            )
        }

        if (!user) {
            throw new HTTPException(404, { message: 'User not found' })
        }

        if (role && role !== user.role) {
            throw new HTTPException(403, { message: 'Forbidden' })
        }

        c.set('user', user)
        c.set('token', token as any)

        await next()
    }
}

import {Context, MiddlewareHandler, Next} from "hono";
import {HTTPException} from "hono/http-exception";
import redis from "../config/redis";
import {verify} from "hono/jwt";
import {UserRepository} from "../model/user-model";
import {JWTPayload} from "hono/dist/types/utils/jwt/types";

export const authMiddleware = (
    secret: string,
): MiddlewareHandler => {
    return async (c: Context, next: Next) => {
        const authHeader = c.req.header('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            throw new HTTPException(401, {message: 'Unauthorized'});
        }

        const token = authHeader.split(' ')[1];
        const isBlacklisted = await redis.exists(`blacklist:${token}`);

        if (isBlacklisted) {
            throw new HTTPException(401, {message: 'Token has been invalidated'});
        }

        const jwtPayload: JWTPayload = await verify(token, secret);
        const userRedis = await redis.get(`user:${jwtPayload.id}`);

        if (userRedis) {
            c.set('user', JSON.parse(userRedis));
            c.set('token', token as any);

        } else {
            const user = await UserRepository.findById(jwtPayload.id as string);
            c.set('user', user);
            c.set('token', token as any);
            await redis.set(`user:${token}`, JSON.stringify(user), 'EX', 3 * 60 * 60);
        }

        await next();
    }
}
import {sign, verify} from 'hono/jwt';
import {User} from "../config/db/schema";

export async function generateAccessToken(user: User): Promise<string> {
    return await sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN!)
        },
        process.env.JWT_ACCESS_SECRET!
    );
}

export async function generateRefreshToken(user: User): Promise<string> {
    return await sign(
        {
            sub: user.id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN!)
        },
        process.env.JWT_REFRESH_SECRET!
    );
}

export async function verifyAccessToken(token: string): Promise<User> {
    return await verify(token, process.env.JWT_ACCESS_SECRET!) as User;
}

export async function verifyRefreshToken(token: string): Promise<User> {
    return await verify(token, process.env.JWT_REFRESH_SECRET!) as User;
}

export async function decodeAccessToken(token: string): Promise<User> {
    return await verify(token, process.env.JWT_ACCESS_SECRET!) as User;
}
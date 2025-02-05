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
            id: user.id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN!)
        },
        process.env.JWT_REFRESH_SECRET!
    );
}
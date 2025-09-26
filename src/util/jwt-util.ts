import { sign } from 'hono/jwt'
import type { User } from '../config/db/schema'

export async function generateAccessToken(user: User): Promise<string> {
    return await sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            iat: Math.floor(Date.now() / 1000),
            exp:
                Math.floor(Date.now() / 1000) +
                60 *
                    60 *
                    Number.parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN!, 10),
        },
        process.env.JWT_ACCESS_SECRET!,
    )
}

export async function generateRefreshToken(user: User): Promise<string> {
    return await sign(
        {
            id: user.id,
            iat: Math.floor(Date.now() / 1000),
            exp:
                Math.floor(Date.now() / 1000) +
                60 *
                    60 *
                    24 *
                    Number.parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN!, 10),
        },
        process.env.JWT_REFRESH_SECRET!,
    )
}

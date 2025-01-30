import redis from "../config/redis";
import {generateOTP} from "../util/otp-util";
import {HTTPException} from "hono/http-exception";
import {db} from "../config/db";
import {usersTable} from "../config/db/schema";
import {eq, sql} from "drizzle-orm";
import {SendOTPRequest, VerifyOTPRequest} from "../model/user-model";

export class OtpService {
    static async generateAndStoreOTP(email: SendOTPRequest): Promise<string> {
        const otp = generateOTP();

        await redis.set(`otp:${email}`, otp, 'EX', 300);
        return otp;
    }

    static async verifyOTP(request: VerifyOTPRequest, purpose?: string): Promise<void> {
        const storedOTP = await redis.get(`otp:${request.email}`);
        if (storedOTP !== String(request.otp)) {
            throw new HTTPException(401, {
                message: 'Invalid OTP'
            });
        }

        await redis.del(`otp:${request.email}`);

        if (purpose === 'register') {
            const user = await db.select({
                emailVerified: usersTable.emailVerified
            })
                .from(usersTable)
                .where(eq(usersTable.email, request.email))
                .limit(1);

            if (user.length > 0 && user[0].emailVerified) {
                throw new HTTPException(400, {
                    message: 'Email already verified'
                });
            }

            await db.update(usersTable)
                .set({ emailVerified: new Date() })
                .where(eq(usersTable.email, request.email))
                .execute();
        }

        return;
    }
}
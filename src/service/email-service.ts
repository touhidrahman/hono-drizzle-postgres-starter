import {OtpService} from "./otp-service";
import {logger} from "../config/logging";
import {emailQueue} from "../config/queue";
import {db} from "../config/db";
import {usersTable} from "../config/db/schema";
import {eq} from "drizzle-orm";
import {HTTPException} from "hono/http-exception";

export class EmailService {
    static async sendOTP(email: string): Promise<void> {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

        if (!user) throw new HTTPException(404, {
            message: 'User not found'
        });

        const otp = await OtpService.generateAndStoreOTP(email);

        await emailQueue.add({email, otp});

        logger.info('OTP job added to queue for ' + email);
    }
}
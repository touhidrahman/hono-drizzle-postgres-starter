import redis from "../config/redis";
import {generateOTP} from "../util/otp-util";

export class OtpService {
    static async generateAndStoreOTP(email: string): Promise<string> {
        const otp = generateOTP();

        await redis.set(`otp:${email}`, otp, 'EX', 600);
        return otp;
    }

    static async verifyOTP(email: string, otp: string): Promise<boolean> {
        const storedOTP = await redis.get(`otp:${email}`);
        return storedOTP === otp;
    }

    static async deleteOTP(email: string): Promise<void> {
        await redis.del(`otp:${email}`);
    }
}
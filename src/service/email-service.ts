import {OtpService} from "./otp-service";
import {logger} from "../config/logging";
import {emailQueue} from "../config/queue";

export class EmailService {
    static async sendOTP(email: string): Promise<void> {
        try {
            const otp = await OtpService.generateAndStoreOTP(email);

            await emailQueue.add({email, otp});

            logger.info('OTP job added to queue for ' + email);
        } catch (error) {
            logger.error('Failed to add OTP job to queue ' + error);
            throw new Error('Failed to add OTP job to queue');
        }
    }
}
import {
    loginRoute,
    logoutRoute,
    registerRoute,
    resetPasswordRoute,
    sendOTPRoute,
    verifyOTPRoute
} from "../route/auth-route";
import {
    LoginUserRequest,
    RegisterUserRequest,
    ResetPasswordRequest,
    SendOTPRequest,
    VerifyOTPRequest
} from "../model/user-model";
import {AuthService} from "../service/auth-service";
import {ResponseUtil} from "../util/response-util";
import {EmailService} from "../service/email-service";
import {honoApp} from "../config/hono";
import {OtpService} from "../service/otp-service";
import {jwt} from "hono/jwt";
import {authMiddleware} from "../middleware/auth-middleware";
import {User} from "../config/db/schema";

export const authController = honoApp();

authController.openapi(registerRoute, async (c) => {
    const request = await c.req.json() as RegisterUserRequest;

    const response = await AuthService.register(request);

    return c.json(ResponseUtil.success(response, 'User registered successfully'));
});

authController.openapi(sendOTPRoute, async (c) => {
    const request = await c.req.json() as SendOTPRequest;

    await EmailService.sendOTP(request.email);

    return c.json(ResponseUtil.success(null, 'OTP sent successfully'));
});

authController.openapi(verifyOTPRoute, async (c) => {
    const request = await c.req.json() as VerifyOTPRequest;

    await OtpService.verifyOTP(request, 'register');

    return c.json(ResponseUtil.success(null, 'OTP verified successfully'));
});

authController.openapi(loginRoute, async (c) => {
    const request = await c.req.json() as LoginUserRequest;

    const response = await AuthService.login(request);

    return c.json(ResponseUtil.success(response, 'Login successfully'));
});

authController.use('/logout', authMiddleware(process.env.JWT_ACCESS_SECRET!));

authController.openapi(logoutRoute, async (c) => {
    const token = c.get('token') as string;

    await AuthService.logout(token);

    return c.json(ResponseUtil.success(null, 'Logout successfully'));
});

authController.openapi(resetPasswordRoute, async (c) => {
    const request = await c.req.json() as ResetPasswordRequest;

    const user = await AuthService.resetPassword(request);

    return c.json(ResponseUtil.success(null, 'Reset password successfully'));
});
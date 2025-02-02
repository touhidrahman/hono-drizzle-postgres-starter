import {loginRoute, registerRoute, sendOTPRoute, verifyOTPRoute} from "../route/auth-route";
import {LoginUserRequest, RegisterUserRequest, SendOTPRequest, VerifyOTPRequest} from "../model/user-model";
import {AuthService} from "../service/auth-service";
import {ResponseUtil} from "../util/response-util";
import {EmailService} from "../service/email-service";
import {honoApp} from "../config/hono";
import {OtpService} from "../service/otp-service";

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
import {createRoute, OpenAPIHono} from "@hono/zod-openapi";
import {ApplicationVariables} from "../model/app-model";
import {registerRoute, sendOTPRoute} from "../route/auth-route";
import {RegisterUserRequest} from "../model/user-model";
import {AuthService} from "../service/auth-service";
import {ResponseUtil} from "../util/response-util";
import {EmailService} from "../service/email-service";
import {honoApp} from "../config/hono";

export const authController = honoApp();

authController.openapi(registerRoute, async (c) => {
    const request = await c.req.json() as RegisterUserRequest;

    const response = await AuthService.register(request);

    return c.json(ResponseUtil.success(response, 'User registered successfully'));
});

authController.openapi(sendOTPRoute, async (c) => {
    const request = await c.req.json() as { email: string };

    await EmailService.sendOTP(request.email);

    return c.json(ResponseUtil.success({}, 'OTP sent successfully'));
});
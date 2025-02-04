import {createRouteUtil} from "../util/route-util";
import {any, z} from "zod";
import {AuthValidation} from "../validation/auth-validation";
import {UserResponse} from "../model/user-model";

export const registerRoute = createRouteUtil(
    "post",
    "/register",
    z.object({
        status: z.string(),
        message: z.string(),
        data: z.object({
            email: z.string(),
            name: z.string(),
        }),
    }),
    AuthValidation.REGISTER,
);

export const sendOTPRoute = createRouteUtil(
    "post",
    "/send-otp",
    z.object({
        status: z.string(),
        message: z.string(),
        data: z.null(),
    }),
    AuthValidation.SEND_OTP,
);

export const verifyOTPRoute = createRouteUtil(
    "post",
    "/verify-otp",
    z.object({
        status: z.string(),
        message: z.string(),
        data: z.null(),
    }),
    AuthValidation.VERIFY_OTP,
);

export const loginRoute = createRouteUtil(
        "post",
        "/login",
        z.object({
            status: z.string(),
            message: z.string(),
            data: z.object({
                email: z.string().email(),
                name: z.string(),
                role: z.string(),
                accessToken: z.string(),
                refreshToken: z.string()
            }),
        }),
        AuthValidation.LOGIN,
    )
;

export const logoutRoute = createRouteUtil(
    "post",
    "/logout",
    z.object({
        status: z.string(),
        message: z.string(),
        data: z.null(),
    }),
    undefined,
    [{BearerAuth: []}],
);

export const resetPasswordRoute = createRouteUtil(
    "post",
    "/reset-password",
    z.object({
        status: z.string(),
        message: z.string(),
        data: z.null(),
    }),
    AuthValidation.RESET_PASSWORD,
);
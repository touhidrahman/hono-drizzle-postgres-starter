import {createRouteUtil} from "../util/route-util";
import {any, z} from "zod";
import {AuthValidation} from "../validation/auth-validation";
import {UserResponse} from "../model/user-model";

export const registerRoute = createRouteUtil(
    "post",
    "/register",
    AuthValidation.REGISTER,
    z.object({
        status: z.string(),
        message: z.string(),
        data: z.object({
            email: z.string(),
            name: z.string(),
        }),
    })
);

export const sendOTPRoute = createRouteUtil(
    "post",
    "/send-otp",
    AuthValidation.SEND_OTP,
    z.object({
        status: z.string(),
        message: z.string(),
        data: z.null(),
    })
);

export const verifyOTPRoute = createRouteUtil(
    "post",
    "/verify-otp",
    AuthValidation.VERIFY_OTP,
    z.object({
        status: z.string(),
        message: z.string(),
        data: z.null(),
    })
);

export const loginRoute = createRouteUtil(
    "post",
    "/login",
    AuthValidation.LOGIN,
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
    })
);
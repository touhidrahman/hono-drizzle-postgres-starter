import {createRouteUtil} from "../util/route-util";
import {any, z} from "zod";
import {AuthValidation} from "../validation/auth-validation";

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
        data: any(),
    })
);
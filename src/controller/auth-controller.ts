import { googleAuth } from '@hono/oauth-providers/google'
import { honoApp } from '../config/hono'
import { authMiddleware } from '../middleware/auth-middleware'
import type {
    LoginUserRequest,
    RegisterUserRequest,
    ResetPasswordRequest,
    SendOTPRequest,
    VerifyOTPRequest,
} from '../model/user-model'
import {
    googleLoginRoute,
    loginRoute,
    logoutRoute,
    refreshTokenRoute,
    registerRoute,
    resetPasswordRoute,
    sendOTPRoute,
    verifyOTPRoute,
} from '../route/auth-route'
import { AuthService } from '../service/auth-service'
import { EmailService } from '../service/email-service'
import { OtpService } from '../service/otp-service'
import { ResponseUtil } from '../util/response-util'

export const authController = honoApp()

authController.openapi(registerRoute, async (c) => {
    const request = (await c.req.json()) as RegisterUserRequest

    const response = await AuthService.register(request)

    return c.json(
        ResponseUtil.success(response, 'User registered successfully'),
    )
})

authController.openapi(sendOTPRoute, async (c) => {
    const request = (await c.req.json()) as SendOTPRequest

    await EmailService.sendOTP(request.email)

    return c.json(ResponseUtil.success(null, 'OTP sent successfully'))
})

authController.openapi(verifyOTPRoute, async (c) => {
    const request = (await c.req.json()) as VerifyOTPRequest

    await OtpService.verifyOTP(request, 'register')

    return c.json(ResponseUtil.success(null, 'OTP verified successfully'))
})

authController.openapi(loginRoute, async (c) => {
    const request = (await c.req.json()) as LoginUserRequest

    const response = await AuthService.login(request)

    return c.json(ResponseUtil.success(response, 'Login successfully'))
})

authController.use('/logout', authMiddleware(process.env.JWT_ACCESS_SECRET!))

authController.openapi(logoutRoute, async (c) => {
    const token = c.get('token') as string
    const userId = c.get('user')?.id as string
    const refreshToken = await c.req.json()

    await AuthService.logout(token, refreshToken, userId)

    return c.json(ResponseUtil.success(null, 'Logout successfully'))
})

authController.openapi(resetPasswordRoute, async (c) => {
    const request = (await c.req.json()) as ResetPasswordRequest

    const user = await AuthService.resetPassword(request)

    return c.json(ResponseUtil.success(null, 'Reset password successfully'))
})

authController.use(
    '/google',
    googleAuth({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        scope: ['openid', 'email', 'profile'],
    }),
)

authController.openapi(googleLoginRoute, async (c) => {
    const user = c.get('user-google')

    const response = await AuthService.googleLogin(user)

    return c.json(ResponseUtil.success(response, 'Login successfully'))
})

authController.openapi(refreshTokenRoute, async (c) => {
    const request = (await c.req.json()) as { refreshToken: string }

    const response = await AuthService.refreshToken(request)

    return c.json(ResponseUtil.success(response, 'Refresh token successfully'))
})

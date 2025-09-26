import type { User } from '../config/db/schema'
import { honoApp } from '../config/hono'
import { authMiddleware } from '../middleware/auth-middleware'
import {
    type ChangePasswordRequest,
    toUserResponse,
    type UpdateUserRequest,
} from '../model/user-model'
import {
    changePasswordRoute,
    getUserRoute,
    updateUserRoute,
} from '../route/user-route'
import { UserService } from '../service/user-service'
import { ResponseUtil } from '../util/response-util'

export const userController = honoApp()

userController.use('/user/*', authMiddleware(process.env.JWT_ACCESS_SECRET!))

userController.openapi(getUserRoute, async (c) => {
    const request = c.get('user') as User

    const response = toUserResponse(request)

    return c.json(
        ResponseUtil.success(response, 'User details retrieved successfully'),
    )
})

userController.openapi(updateUserRoute, async (c) => {
    const request = (await c.req.json()) as UpdateUserRequest
    const user = c.get('user') as User

    const response = await UserService.update(request, user)

    return c.json(ResponseUtil.success(response, 'User updated successfully'))
})

userController.openapi(changePasswordRoute, async (c) => {
    const request = (await c.req.json()) as ChangePasswordRequest
    const user = c.get('user') as User

    await UserService.changePassword(request, user)

    return c.json(ResponseUtil.success(null, 'Password updated successfully'))
})

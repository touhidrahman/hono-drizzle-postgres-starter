import {honoApp} from "../config/hono";
import {getUserRoute} from "../route/user-route";
import {ResponseUtil} from "../util/response-util";
import {User} from "../config/db/schema";
import {toUserResponse} from "../model/user-model";
import {authMiddleware} from "../middleware/auth-middleware";

export const userController = honoApp();

userController.use('/user/*', authMiddleware(process.env.JWT_ACCESS_SECRET!));

userController.openapi(getUserRoute, async (c) => {
    const request = c.get('user') as User;

    const response = toUserResponse(request);

    return c.json(ResponseUtil.success(response, 'User details retrieved successfully'));
});
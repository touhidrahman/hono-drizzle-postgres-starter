import {createRoute, OpenAPIHono} from "@hono/zod-openapi";
import {ApplicationVariables} from "../model/app-model";
import {registerRoute} from "../route/auth-route";
import {RegisterUserRequest} from "../model/user-model";
import {AuthService} from "../service/auth-service";
import {ResponseUtil} from "../util/response-util";

export const authController = new OpenAPIHono<{ Variables: ApplicationVariables }>()

authController.openapi(registerRoute, async (c) => {
    const request = await c.req.json() as RegisterUserRequest;

    const response = await AuthService.registerUser(request);

    return c.json(ResponseUtil.success(response, 'User registered successfully'));
});
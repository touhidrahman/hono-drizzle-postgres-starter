import {honoApp} from "../config/hono";
import {authController} from "../controller/auth-controller";

export const api = honoApp();

api.openAPIRegistry.registerComponent(
    'securitySchemes',
    'BearerAuth',
    {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Masukkan access token tanpa prefix Bearer'
    }
)

api.route("/auth", authController);
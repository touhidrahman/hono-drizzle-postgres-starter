import {honoApp} from "../config/hono";
import {authController} from "../controller/auth-controller";

export const api = honoApp();

api.route("/auth", authController);
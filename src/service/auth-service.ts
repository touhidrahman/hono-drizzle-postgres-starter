import {LoginUserRequest, RegisterUserRequest, toUserResponse, UserRepository, UserResponse} from "../model/user-model";
import {eq} from "drizzle-orm";
import {User, usersTable} from "../config/db/schema";
import {HTTPException} from "hono/http-exception";
import {password} from "bun";
import {logger} from "../config/logging";
import {generateAccessToken, generateRefreshToken} from "../util/jwt-util";

export class AuthService {
    static async register(request: RegisterUserRequest): Promise<UserResponse> {
        const existingUser = await UserRepository.count(eq(usersTable.email, request.email));

        if (existingUser > 0) {
            throw new HTTPException(400, {
                message: 'Email already taken'
            });
        }

        request.password = await password.hash(request.password, {
            algorithm: "bcrypt",
            cost: 10
        });

        const user = await UserRepository.create(request);

        logger.info("User registered successfully");

        return toUserResponse(user);
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const [user] = await UserRepository.findByColumn('email', request.email);

        if (!user || !user.password) {
            throw new HTTPException(401, {
                message: 'Email or Password incorrect'
            });
        }

        const isPasswordMatch = await password.verify(request.password, user.password, "bcrypt");

        if (!isPasswordMatch) {
            throw new HTTPException(401, {
                message: 'Email or password is incorrect'
            });
        }

        const [access, refresh] = await Promise.all([
            generateAccessToken(user),
            generateRefreshToken(user)
        ]);

        const response = toUserResponse(user);
        response.accessToken = access;
        response.refreshToken = refresh;

        return response;
    }
}
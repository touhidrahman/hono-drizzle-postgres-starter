import {RegisterUserRequest, toUserResponse, UserRepository, UserResponse} from "../model/user-model";
import {eq} from "drizzle-orm";
import {User, usersTable} from "../config/db/schema";
import {HTTPException} from "hono/http-exception";
import {password} from "bun";
import {logger} from "../config/logging";

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
}
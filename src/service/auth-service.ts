import {RegisterUserRequest, toUserResponse, UserResponse} from "../model/user-model";
import {AuthValidation} from "../validation/auth-validation";
import {db} from "../config/db";
import {eq} from "drizzle-orm";
import {usersTable} from "../config/db/schema";
import {HTTPException} from "hono/http-exception";
import {password} from "bun";
import {logger} from "../config/logging";
import {EmailService} from "./email-service";

export class AuthService {
    static async registerUser(request: RegisterUserRequest): Promise<UserResponse> {
        request = AuthValidation.REGISTER.parse(request);

        const existingUser = await db.$count(usersTable, eq(usersTable.email, request.email));

        if (existingUser > 0) {
            throw new HTTPException(400, {
                message: 'Email already taken'
            });
        }

        request.password = await password.hash(request.password, {
            algorithm: "bcrypt",
            cost: 10
        });

        const [user] = await db.insert(usersTable).values(request).returning();

        logger.info("User registered successfully");

        await EmailService.sendOTP(request.email);

        return toUserResponse(user);
    }
}
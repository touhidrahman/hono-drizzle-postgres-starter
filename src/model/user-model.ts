import {User, usersTable} from "../config/db/schema";
import {Repository} from "../types/repository";
import {db} from "../config/db";

export const UserRepository = new Repository<User>(db, usersTable);

export type RegisterUserRequest = {
    name: string;
    email: string;
    password: string;
}

export type LoginUserRequest = {
    email: string;
    password: string;
}

export type UpdateUserRequest = {
    name?: string;
    password?: string;
}

export type SendOTPRequest = {
    email: string;
}

export type VerifyOTPRequest = {
    email: string;
    otp: number;
}

export type UserResponse = {
    email: string;
    name: string;
    role: string;
    accessToken?: string;
    refreshToken?: string;
}

export function toUserResponse(user: User): UserResponse {
    return {
        email: user.email,
        name: user.name,
        role: user.role,
    }
}
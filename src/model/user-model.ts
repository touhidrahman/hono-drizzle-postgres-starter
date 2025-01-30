import {User} from "../config/db/schema";

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
    token?: string;
}

export function toUserResponse(user: User): UserResponse {
    return {
        email: user.email,
        name: user.name
    }
}
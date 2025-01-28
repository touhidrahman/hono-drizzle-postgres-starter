import {HTTPException} from "hono/http-exception";
import {ZodError} from "zod";
import {ResponseUtil} from "./response-util";
import {BlankEnv, HTTPResponseError} from "hono/types";
import {Context} from "hono";
import {logger} from "../config/logging";

export default async function errorUtil(err: Error | HTTPResponseError, c: Context<BlankEnv, any, {}>) {
    if (err instanceof HTTPException) {
        c.status(err.status);
        logger.error(err.message);
        return c.json(ResponseUtil.error(err.message));

    } else if (err instanceof ZodError) {
        c.status(400);
        const errors = err.errors.map(error => ({
            field: error.path[0],
            message: error.message
        }));

        logger.error('Validation error: ' + errors);

        return c.json(ResponseUtil.error(errors, "Validation error"));

    } else {
        c.status(500);
        logger.error('Internal server error: ' + err);
        return c.json(ResponseUtil.error('Internal server error'));
    }
}
import {OpenAPIHono} from "@hono/zod-openapi";
import {User} from "./db/schema";
import {HTTPException} from "hono/http-exception";
import {logger} from "./logging";

export const honoApp = () =>
    new OpenAPIHono<{ Variables: { user: User | null } }>({
        defaultHook: (result) => {
            if (result.success) {
                return;
            }

            const errors = result.error.errors
                .map(error => `Invalid ${error.path[0]}`)
                .join(", ");

            logger.error('Validation error: ' + errors);

            throw new HTTPException(422, {
                message: errors
            });
        },
    });
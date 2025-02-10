import {createRouteUtil} from "../util/route-util";
import {z} from "zod";

export const getUserRoute = createRouteUtil({
    method: "get",
    path: "/user",
    tags: ["User"],
    responseSchema: z.object({
        status: z.string(),
        message: z.string(),
        data: z.object({
            email: z.string(),
            name: z.string(),
            role: z.string(),
        }),
    }),
    description: "Get user details",
    security: [{BearerAuth: []}],
});
import {OpenAPIHono} from "@hono/zod-openapi";
import {swaggerUI} from "@hono/swagger-ui";

const app = new OpenAPIHono()

app.doc("/doc", {
    openapi: "3.0.0",
    info: {
        version: "1.0.0",
        title: "My API",
    },
});

app.get('/', (c) => {
    return c.text('Hello Hono!')
})

app.get('/ui', swaggerUI({url: '/doc'}))

export default app

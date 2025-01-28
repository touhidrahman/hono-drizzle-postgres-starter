import {OpenAPIHono} from "@hono/zod-openapi";
import {swaggerUI} from "@hono/swagger-ui";
import errorUtil from "./util/error-util";
import {authController} from "./controller/auth-controller";
import {RouteCollector} from "./util/route-util";

const app = new OpenAPIHono()

app.route("/api/v1/auth", authController);

app.doc("/doc", {
    openapi: "3.0.0",
    info: {
        version: "1.0.0",
        title: "My API",
    },
});

app.onError(errorUtil);

app.get('/', (c) => {
    return c.text('Hello Hono!');
});

app.get('/ui', swaggerUI({url: '/doc'}))
app.get('/route-list', (c) => {
    RouteCollector.collect(app)
    const routes = RouteCollector.getRoutes()
    const routesTable = routes.join('\n')
    return c.text(`Method Path\n${routesTable}`)
})

export default app

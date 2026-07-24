import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import auth from "./routeAuth/auth";
import { authMiddleware } from "./middleware/auth";
import { cors } from "hono/cors";
import { protectedApi } from "./routes";

const app = new Hono();

protectedApi.use("*", authMiddleware);

app.use( "/*", serveStatic({ root: "./", }) );
app.use(
  "*",
  cors({
    origin: "http://localhost:2601",
    allowMethods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],
    allowHeaders: [
      "Content-Type",
      "Authorization",
    ],
    credentials: true,
  }),
);
app.route("/api/auth", auth);
app.route("/api", protectedApi);

export default {
	port: 2600,
	fetch: app.fetch
};
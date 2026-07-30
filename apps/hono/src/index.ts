import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import auth from "./routeAuth/auth";
import { authMiddleware } from "./middleware/auth";
import { cors } from "hono/cors";
import { protectedApi } from "./routes";
import { dirname, resolve } from "node:path";

const baseDir =
  process.env.APP_ENV === "development"
    ? resolve(process.cwd(), "../..") // monorepo root
    : dirname(process.execPath);      // compiled executable directory

const indexFile = Bun.file(resolve(baseDir, "index.html"));

const app = new Hono();

protectedApi.use("*", authMiddleware);

app.use(
  "*",
  cors({
    origin: "http://localhost:2601",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.route("/api/auth", auth);
app.route("/api", protectedApi);

// Static files
app.use("/*", serveStatic({ root: baseDir }));

// SPA fallback
app.notFound(async (c) => {
  if (c.req.path.startsWith("/api")) {
    return c.text("Not Found", 404);
  }

  return c.html(await indexFile.text());
});

export default {
	port: 2600,
	fetch: app.fetch
};
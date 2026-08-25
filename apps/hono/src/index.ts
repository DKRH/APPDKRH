import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import auth from "./routeAuth/auth";
import { authMiddleware } from "./middleware/auth";
import { cors } from "hono/cors";
import { createProtectedApi } from "./routes";
import { dirname, resolve } from "node:path";

const isDevelopment =
  process.env.APP_ENV === "development";

const baseDir = isDevelopment
    ? resolve(process.cwd(), "../..") // monorepo root
    : dirname(process.execPath);      // compiled executable directory

const app = new Hono();

const protectedApi = await createProtectedApi();
protectedApi.use("*", authMiddleware);

app.use(
  "*",
  cors({
    origin: "http://localhost:2600",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.route("/api/auth", auth);
app.route("/api", protectedApi);

if (!isDevelopment) {
  const indexFile = Bun.file(
    resolve(baseDir, "index.html"),
  );

  app.use("*", serveStatic({
    root: baseDir,
  }));

  app.notFound(async (c) => {
    if (c.req.path.startsWith("/api")) {
      return c.text("Not Found", 404);
    }

    return c.html(await indexFile.text());
  });
}

export default {
  port: Number(process.env.HONO_PORT ?? 2601),
  fetch: app.fetch,
};
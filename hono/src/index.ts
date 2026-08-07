import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { authMiddleware } from "./middleware/auth";
import { cors } from "hono/cors";
import { dirname, resolve } from "node:path";

import auth from "./routeAuth/auth";
import { protectedApi } from "./routes/api";
import { health } from "./routes/health";
import { existsSync } from "node:fs";

const baseDir =
  process.env.APP_ENV === "development"
    ? resolve(process.cwd(), "../..") // monorepo root
    : dirname(process.execPath);      // compiled executable directory

const indexPath = resolve(baseDir, "index.html");
const indexFile = Bun.file(indexPath);

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
app.route("/health", health);

// Static files
if (existsSync(indexPath)) {
  console.log("Frontend found:", indexPath);

  app.use("/*", serveStatic({ root: baseDir }));
} else {
  console.log("Frontend not found. Static serving disabled.");
}

// SPA fallback
app.notFound(async (c) => {
  if (c.req.path.startsWith("/api")) {
    return c.text("Not Found", 404);
  }

  return c.html(await indexFile.text());
});

export default {
	port: 6969,
	fetch: app.fetch
};
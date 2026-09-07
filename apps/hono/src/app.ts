import { $ } from "bun";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import auth from "./routeAuth/auth";
import { authMiddleware } from "./middleware/auth";
import { cors } from "hono/cors";
import { createProtectedApi } from "./routes";
import { dirname, resolve } from "node:path";
import healthRoutes from "./routes/health";
import { auditContext } from "./middleware/audit-context";

const isDevelopment = process.env.APP_ENV === "development";

const baseDir = isDevelopment
    ? resolve(process.cwd()) // monorepo root
    : resolve(dirname(process.execPath), "../html");     // compiled executable directory
console.log("1) baseDir :"+baseDir);
console.log("2) ENV :"+process.env.APP_ENV);
console.log("3) Svelte Url :"+process.env.SVELTE_API_URL);

const app = new Hono();

/*
|--------------------------------------------------------------------------
| Protected API
|--------------------------------------------------------------------------
*/
app.onError(
	(err, c) => {

		console.error(err);

		return c.json(
			{
				success: false,

				message:
					err instanceof Error
						? err.message
						: "Internal server error",
			},
			500
		);

	}
);
const protectedApi = new Hono();

// Register middleware FIRST
protectedApi.use("*", authMiddleware);

// 2. Audit context reads userId
protectedApi.use("*", auditContext);

// Then register all dynamic routes inside it
const routes = await createProtectedApi();

protectedApi.route("/", routes);

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/
app.use(
  "*",
  cors({
    origin: [
      process.env.SVELTE_API_URL!,
    ],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/
// Public Better Auth routes
app.route("/api/auth", auth);

// All routes inside here require login
app.route("/api", protectedApi);

app.route("/check", healthRoutes);


//|--------------------------------------------------------------------------
//| Static Frontend
//|--------------------------------------------------------------------------
/*
if (!isDevelopment) {
  const indexFile = Bun.file(
    resolve(baseDir, "index.html"),
  );

  
  //|--------------------------------------------------------------------------
  //| Block sensitive files
  //|--------------------------------------------------------------------------
  
  app.use("*", async (c, next) => {
    const path = c.req.path;

    if (
      path.startsWith("/.") ||
      path === "/server" ||
      path.startsWith("/server/")
    ) {
      return c.html(await indexFile.text(), 404);
    }

    await next();
  });

  
  //|--------------------------------------------------------------------------
  //| Static Frontend
  //|--------------------------------------------------------------------------
  
  app.use("*", serveStatic({
    root: baseDir,
  }));

  
  //|--------------------------------------------------------------------------
  //| SPA Fallback
  //|--------------------------------------------------------------------------
  
  app.notFound(async (c) => {
    if (
      c.req.path === "/api" ||
      c.req.path.startsWith("/api/")
    ) {
      return c.json(
        {
          success: false,
          message: "Not Found",
        },
        404,
      );
    }

    // Let Svelte handle frontend routing/errors
    return c.html(await indexFile.text());
  });
}*/

export type AppType = typeof protectedApi;

export default app;
import { Hono } from "hono";
import { routes } from "./generated/routes.generated";
import zKeyNexus from "./routes/z-keynexus";

export function createPublicApi() {
  const app = new Hono();
  app.get("/", (c) => c.text("this APX"));
  app.route("/z-apps", zKeyNexus);

  return app;
}

export function createProtectedApi() {
  const app = new Hono();

  for (const { path, route } of routes) {
    app.route(path, route);

    console.log(`✓ ${path}`);
  }

  return app;
}

import { Hono } from "hono";
import { routes } from "./generated/routes.generated";

export function createProtectedApi() {
  const app = new Hono();

  for (const { path, route } of routes) {
    app.route(path, route);

    console.log(`✓ ${path}`);
  }

  return app;
}
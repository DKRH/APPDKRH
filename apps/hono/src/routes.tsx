import { Hono } from "hono";
import { relative, dirname } from "node:path";
import { pathToFileURL } from "node:url";

export async function createProtectedApi() {
  const app = new Hono();

  const modulesDir = `${import.meta.dir}/modules`;

  const glob = new Bun.Glob("**/route.{ts,js}");

  for await (const file of glob.scan({
    cwd: modulesDir,
    absolute: true,
  })) {
    if (file.endsWith(".d.ts")) continue;

    const importUrl = pathToFileURL(file).href;

    const mod = await import(
      process.env.APP_ENV === "development"
        ? `${importUrl}?t=${Date.now()}`
        : importUrl
    );

    if (!mod.default) continue;

    const route = relative(
      modulesDir,
      dirname(file),
    ).replace(/\\/g, "/");

    app.route(`/${route}`, mod.default);

    console.log(`✓ /${route}`);
  }

  return app;
}
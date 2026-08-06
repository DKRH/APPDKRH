import { Hono } from "hono";
import { relative } from "node:path";
import { pathToFileURL } from "node:url";

export async function createProtectedApi() {
    const app = new Hono();

    const routesDir = `${import.meta.dir}/routes`;
    const glob = new Bun.Glob("**/*.{ts,js}");

    for await (const file of glob.scan({
        cwd: routesDir,
        absolute: true,
    })) {
        if (file.endsWith(".d.ts")) continue;

        const mod = await import(pathToFileURL(file).href);

        if (!mod.default) continue;

        let route = relative(routesDir, file)
            .replace(/\.(ts|js)$/, "")
            .replace(/\\/g, "/")
            .replace(/\/index$/, "");

        if (route === "index") route = "";

        app.route(`/${route}`, mod.default);

        console.log(`✓ /${route}`);
    }

    return app;
}
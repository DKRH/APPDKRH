import { $ } from "bun";
import { cpSync, mkdirSync } from "node:fs";

mkdirSync("dist_server", { recursive: true });

cpSync("apps/hono/dist/serverHono", "dist_server/serverHono", {
	recursive: true,
});
import { $ } from "bun";
import { cpSync, mkdirSync } from "node:fs";

mkdirSync("dist_server", { recursive: true });

cpSync("apps/goapi/dist/serverGO", "dist_server/serverGO", {
	recursive: true,
});
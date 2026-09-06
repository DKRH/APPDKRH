import { $ } from "bun";
import { cpSync, mkdirSync } from "node:fs";

mkdirSync("dist_server", { recursive: true });

cpSync("apps/svelte/build", "dist", {
	recursive: true,
});
import { $ } from "bun";
import { cpSync, mkdirSync } from "node:fs";

mkdirSync("dist/html", { recursive: true });

cpSync("apps/svelte/build", "dist/html", {
	recursive: true,
});
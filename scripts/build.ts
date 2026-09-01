import { cpSync } from "node:fs";

cpSync(
  "apps/svelte/build",
  "dist",
  {
    recursive: true,
  }
);

cpSync(
  "apps/hono/dist",
  "dist",
  {
    recursive: true,
  }
);
//cpSync("apps/hono/.env", "dist/.env");
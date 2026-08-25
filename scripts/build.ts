import { cpSync } from "node:fs";

cpSync(
  "apps/react/dist",
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
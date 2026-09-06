import { $ } from "bun";
import { cpSync, mkdirSync } from "node:fs";

mkdirSync("dist_server", { recursive: true });

cpSync(
  "apps/springkt/build/libs/serverSpringKT.jar",
  "dist_server/serverSpringKT.jar",
  {
    recursive: true,
  }
);
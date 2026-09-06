import { $ } from "bun";
import { cpSync, mkdirSync } from "node:fs";

mkdirSync("dist/spring", { recursive: true });

cpSync(
  "apps/springkt/build/libs/serverSpringKT.jar",
  "dist/spring/serverSpringKT.jar",
  {
    recursive: true,
  }
);
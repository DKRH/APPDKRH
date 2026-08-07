import dotenv from "dotenv";
import path from "node:path";

let loaded = false;

export function loadEnv() {
  if (loaded) return;

  const result = dotenv.config({
    path: path.resolve(import.meta.dir, "../../../../.env"),
  });

  loaded = true;
}
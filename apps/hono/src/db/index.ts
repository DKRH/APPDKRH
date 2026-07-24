import Database from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { dirname, join } from "node:path";
import { loadEnv } from "@/lib/env";

loadEnv();

console.log("1) execPath:", process.execPath);
console.log("2) cwd:", process.cwd());

// 1. Grab your environment URL variable
const apiUrl = process.env.BETTER_AUTH_URL;
console.log("3) apiUrl:", apiUrl);
console.log("4) import.meta.dir:", import.meta.dir);

// 2. Determine your DB path based on the URL or the runtime platform
const dbPath = apiUrl?.includes("localhost")
  ? join(import.meta.dir, "../../dkrh.db") // Dev path
  : join(dirname(process.execPath), "dkrh.db"); // Prod path (compiled executable)

console.log("5) dbPath:", dbPath);

export const db = drizzle(dbPath);
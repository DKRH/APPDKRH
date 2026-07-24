import Database from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { dirname, join } from "node:path";

console.log("execPath:", process.execPath);
console.log("cwd:", process.cwd());
console.log("import.meta.dir:", import.meta.dir);

const dbPath = process.execPath.endsWith(".exe")
    ? join(dirname(process.execPath), "dkrh.db")
    : join(import.meta.dir, "../../dkrh.db");

console.log("dbPath:", dbPath);


export const db = drizzle(dbPath);
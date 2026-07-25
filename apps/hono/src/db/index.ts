import Database from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { dirname, join, isAbsolute, resolve } from "node:path";
import { loadEnv } from "@/lib/env";

loadEnv();

console.log("1) execPath:", process.execPath);
console.log("2) cwd:", process.cwd());

// 1. Grab your environment URL variable
const appenv = process.env.APP_ENV;
const dbpath = process.env.DB_PATH;
const apiUrl = process.env.BETTER_AUTH_URL;
console.log("3) apiUrl:", apiUrl);
console.log("4) import.meta.dir:", import.meta.dir);

const baseDir = appenv === "development"
        ? resolve(process.cwd(), "../..")
        : dirname(process.execPath);

const dbPath = dbpath
    ? (isAbsolute(dbpath) ? dbpath : resolve(baseDir, dbpath))
    : resolve(baseDir, "dkrh.db");

console.log("xx:", process.cwd());
console.log("5) dbPath:", dbPath);
console.log("6) ENV:", appenv);

export const db = drizzle(dbPath);
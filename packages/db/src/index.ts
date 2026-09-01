import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";
import { loadEnv } from "./env";
export {
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";

export * from "./schema";
loadEnv();

export {
	and,
	eq,
	isNull,
	ilike,
	or,
	desc
} from "drizzle-orm";

export type {
	AnyColumn,
} from "drizzle-orm";

export type {
	PgTable,
	PgColumn,
} from "drizzle-orm/pg-core";

console.log("1) execPath:", process.execPath);
console.log("2) cwd:", process.cwd());

// 1. Grab your environment URL variable
const appenv = process.env.APP_ENV;
const databaseUrl = process.env.HONO_DATABASE_URL;
const apiUrl = process.env.BETTER_AUTH_URL;
console.log("3) apiUrl:", apiUrl);
console.log("4) import.meta.dir:", import.meta.dir);
console.log("5) ENV:", appenv);

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL environment variable is required",
  );
}

export const client = new SQL(databaseUrl);

export const db = drizzle({
  client,
});
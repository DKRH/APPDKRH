import type { Config } from "drizzle-kit";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({
	path: path.resolve(import.meta.dirname, "../../.env"),
});

export default {
	schema: "./src/schema.ts",

	out: "./drizzle",

	dialect: "postgresql",

	dbCredentials: {
    	url: process.env.HONO_DATABASE_URL!,
	},
} satisfies Config;
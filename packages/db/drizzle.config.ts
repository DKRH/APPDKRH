import type { Config } from "drizzle-kit";
import { config } from "dotenv";

config({
  path: "../../.env",
});

export default {
	schema: "./src/schema.ts",

	out: "./drizzle",

	dialect: "postgresql",

	dbCredentials: {
    	url: process.env.HONO_DATABASE_URL!,
	},
} satisfies Config;
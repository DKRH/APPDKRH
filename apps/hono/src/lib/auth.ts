import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "@dkrh/db"; // your drizzle instance
import * as schema from "@dkrh/db/schema";

import {
	hashPassword,
	verifyPassword,
} from "./password";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite", "pg"
    schema,
  }),
  trustedOrigins: [
    "http://localhost:2600",
  ],
  emailAndPassword: {
    enabled: true,

		password: {
			hash: hashPassword,
			verify: ({
				password,
				hash,
			}) =>
				verifyPassword(
					password,
					hash,
				),
		},

		revokeSessionsOnPasswordReset: true,
  },
  advanced: {
    database: {
      generateId: "uuid", // or your own custom function
    },
  },
  user: {
    modelName: "a_user",
  },
  session: {
    modelName: "a_session"
  },
  account: {
    modelName: "a_account"
  },
  verification: {
    modelName: "a_verification"
  },
});
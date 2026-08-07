import {
	sqliteTable,
	text,
	integer,
	real,
  	index,
		uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { boolean, decimal, timestamp, uuid, uuidkey, varchar } from "./drizzle-sqlite-helper";
import { randomUUID, } from "crypto";

export const a_user = sqliteTable("a_user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", {
    mode: "boolean",
  })
    .default(false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", {
    mode: "timestamp",
  }).notNull(),
  updatedAt: integer("updated_at", {
    mode: "timestamp",
  }).notNull(),
});
export const a_session = sqliteTable(
  "a_session",
  {
    id: text("id").primaryKey(),

    expiresAt: integer("expires_at", {
      mode: "timestamp",
    }).notNull(),

    token: text("token").notNull().unique(),

    createdAt: integer("created_at", {
      mode: "timestamp",
    }).notNull(),

    updatedAt: integer("updated_at", {
      mode: "timestamp",
    }).notNull(),

    ipAddress: text("ip_address"),

    userAgent: text("user_agent"),

    userId: text("user_id")
      .notNull()
      .references(() => a_user.id, {
        onDelete: "cascade",
      }),
  },
  (table) => [
    index("session_userId_idx").on(
      table.userId,
    ),
],
);
export const a_account = sqliteTable(
  "a_account",
  {
    id: text("id").primaryKey(),

    accountId: text("account_id").notNull(),

    providerId: text("provider_id").notNull(),

    userId: text("user_id")
      .notNull()
      .references(() => a_user.id, {
        onDelete: "cascade",
      }),

    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),

    accessTokenExpiresAt: integer(
      "access_token_expires_at",
      {
        mode: "timestamp",
      },
    ),

    refreshTokenExpiresAt: integer(
      "refresh_token_expires_at",
      {
        mode: "timestamp",
      },
    ),

    scope: text("scope"),

    password: text("password"),

    createdAt: integer("created_at", {
      mode: "timestamp",
    }).notNull(),

    updatedAt: integer("updated_at", {
      mode: "timestamp",
    }).notNull(),
  },
  (table) => [
    index("account_userId_idx").on(
      table.userId,
    ),
  ],
);
export const a_verification = sqliteTable(
  "a_verification",
  {
    id: text("id").primaryKey(),

    identifier: text("identifier").notNull(),

    value: text("value").notNull(),

    expiresAt: integer("expires_at", {
      mode: "timestamp",
    }).notNull(),

    createdAt: integer("created_at", {
      mode: "timestamp",
    }).notNull(),

    updatedAt: integer("updated_at", {
      mode: "timestamp",
    }).notNull(),
  },
  (table) => [
    index("verification_identifier_idx").on(table.identifier),
  ],
);

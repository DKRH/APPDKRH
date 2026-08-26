import type { b_passbank } from "@dkrh/db/schema";

export type BPassbank =
  typeof b_passbank.$inferSelect;

export type NewBPassbank =
  typeof b_passbank.$inferInsert;

export type UpdateBPassbank =
  Partial<NewBPassbank>;
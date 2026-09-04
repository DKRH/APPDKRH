import { createInsertValidator, createPatchValidator } from "@dkrh/db/validation";
import { b_passbank } from "@dkrh/db/schema";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

export const createPassbankSchema = createInsertValidator(b_passbank).extend({
  // Add any additional fields or validation rules here if needed
  title: z.string().min(3),
});
export const updatePassbankSchema = createPatchValidator(b_passbank);

export const createPassbankValidator = zValidator(
	"json",
	createPassbankSchema,
);

export const updatePassbankValidator = zValidator(
	"json",
	updatePassbankSchema,
);
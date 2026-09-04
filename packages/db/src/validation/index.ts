import { createInsertSchema } from "drizzle-zod";
import type { PgTable } from "drizzle-orm/pg-core";

export function createInsertValidator<
	TTable extends PgTable,
>(
	table: TTable,
) {
	const schema = createInsertSchema(table);

	return schema.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		deletedAt: true,
		createdBy: true,
		updatedBy: true,
		deletedBy: true,
	});
}

export function createPatchValidator<
	TTable extends PgTable,
>(table: TTable) {
	return createInsertValidator(table).partial();
}
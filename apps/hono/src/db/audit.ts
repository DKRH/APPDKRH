import { db,and,
	eq,
	isNull,
	ilike,
	or,
	type AnyColumn,
	type PgTable, } from "@dkrh/db";

type InferRow<TTable extends PgTable<any>> =
	TTable["$inferSelect"];

type InferInsert<TTable extends PgTable<any>> =
	TTable["$inferInsert"];

function stripAuditFields<
	T extends Record<string, unknown>,
>(data: T) {
	const {
		id,
		createdAt,
		updatedAt,
		deletedAt,
		createdBy,
		updatedBy,
		deletedBy,
		...clean
	} = data;

	return clean;
}

/* =========================
   INSERT
========================= */

export async function auditedInsert<
	TTable extends PgTable<any>,
>(
	table: TTable,
	data: InferInsert<TTable>,
	userId: string,
) {
	const result = await db
		.insert(table)
		.values({
			...stripAuditFields(data),
			createdAt: new Date(),
			updatedAt: new Date(),
			createdBy: userId,
			updatedBy: userId,
		})
		.returning();

	return result[0];
}

/* =========================
   UPDATE
========================= */

export async function auditedUpdate<
	TTable extends PgTable<any>,
>(
	table: TTable,
	idColumn: AnyColumn,
	id: string,
	data: Partial<InferInsert<TTable>>,
	userId: string,
) {
	const result = await db
		.update(table)
		.set({
			...stripAuditFields(data),
			updatedAt: new Date(),
			updatedBy: userId,
		})
		.where(eq(idColumn, id))
		.returning();

	return result[0];
}

/* =========================
   SOFT DELETE
========================= */

export async function auditedDelete<
	TTable extends PgTable<any>,
>(
	table: TTable,
	idColumn: AnyColumn,
	id: string,
	userId: string,
) {
	const result = await db
		.update(table)
		.set({
			deletedAt: new Date(),
			deletedBy: userId,
			updatedAt: new Date(),
			updatedBy: userId,
		})
		.where(eq(idColumn, id))
		.returning();

	return result[0];
}

/* =========================
   RESTORE
========================= */

export async function auditedRestore<
	TTable extends PgTable<any>,
>(
	table: TTable,
	idColumn: AnyColumn,
	id: string,
	userId: string,
) {
	const result = await db
		.update(table)
		.set({
			deletedAt: null,
			deletedBy: null,
			updatedAt: new Date(),
			updatedBy: userId,
		})
		.where(eq(idColumn, id))
		.returning();

	return result[0];
}

/* =========================
   DELETE FOREVER
========================= */

export async function auditedDeleteForever<
	TTable extends PgTable<any>,
>(
	table: TTable,
	idColumn: AnyColumn,
	id: string,
) {
	await db
		.delete(table)
		.where(eq(idColumn, id));

	return {
		success: true,
	};
}

/* =========================
   FIND BY ID
========================= */

export async function auditedFindById<
	TTable extends PgTable<any>,
>(
	table: TTable,
	idColumn: AnyColumn,
	id: string,
) {
	const rows = await db
		.select()
		.from(table)
		.where(eq(idColumn, id))
		.limit(1);

	return rows[0] ?? null;
}

/* =========================
   SEARCH RELATION
========================= */

type SearchableRelation = {
	column: AnyColumn;
	foreignColumn: AnyColumn;
	searchColumn: AnyColumn;
	table: PgTable<any>;
};

type AuditedListOptions<
	TTable extends PgTable<any>,
> = {
	table: TTable;

	search?: string;

	searchableColumns?: AnyColumn[];

	searchableRelations?: SearchableRelation[];

	offset?: number;

	limit?: number;
};

/* =========================
   LIST
========================= */

export async function auditedList<
	TTable extends PgTable<any>,
>({
	table,
	search = "",
	searchableColumns = [],
	searchableRelations = [],
	offset = 0,
	limit = 50,
}: AuditedListOptions<TTable>) {
	const searchConditions =
		searchableColumns.map((col) =>
			ilike(
				col,
				`%${search}%`,
			),
		);

	const relationSearchConditions =
		search
			? searchableRelations.map(
					(relation) =>
						ilike(
							relation.searchColumn,
							`%${search}%`,
						),
				)
			: [];

	const searchClause =
		searchConditions.length > 0
			? or(
					...searchConditions,
					...relationSearchConditions,
				)
			: undefined;

	const whereClause =
		searchClause
			? and(
					isNull(table.deletedAt),
					searchClause,
				)
			: isNull(table.deletedAt);

	let query: any = db
		.select()
		.from(table);

	for (
		const relation of searchableRelations
	) {
		query = query.leftJoin(
			relation.table,
			eq(
				relation.column,
				relation.foreignColumn,
			),
		);
	}

	const data = await query
		.where(whereClause)
		.offset(offset)
		.limit(limit);

	if (
		searchableRelations.length === 0
	) {
		return data;
	}

	const tableName =
		(table as any)[
			Symbol.for("drizzle:Name")
		];

	return data.map(
		(row: any) =>
			row[tableName] ?? row,
	);
}
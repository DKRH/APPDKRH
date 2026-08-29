import { db } from "@dkrh/db";
import { and, eq, isNull, like, or,
  type AnyColumn,
  type AnyTable, } from "drizzle-orm";
import type { Context } from "hono";

type InferRow<TTable extends AnyTable<any>> = TTable["$inferSelect"];

type InferInsert<TTable extends AnyTable<any>> = TTable["$inferInsert"];

function stripAuditFields<T extends Record<string, unknown>>(
  data: T,
) {
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

export async function auditedInsert<
  TTable extends AnyTable<any>,
>(
  c: Context,
  table: TTable,
  data: InferInsert<TTable>,
) {
  const userId = c.get("userId");
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

  return c.json(result[0]);
}
export async function auditedUpdate<
  TTable extends AnyTable<any>,
>(
  c: Context,
  table: TTable,
  idColumn: AnyColumn,
  id: string,
  data: Partial<InferInsert<TTable>>,
) {
  const userId = c.get("userId");
  const result = await db
    .update(table)
    .set({
      ...stripAuditFields(data),
      updatedAt: new Date(),
      updatedBy: userId,
    })
    .where(eq(idColumn, id))
    .returning();

  return c.json(result[0]);
}
export async function auditedDelete<
  TTable extends AnyTable<any>,
>(
  c: Context,
  table: TTable,
  idColumn: AnyColumn,
  id: string,
) {
  const userId = c.get("userId");
  const result = await db
    .update(table)
    .set({
      deletedAt: new Date(),
      deletedBy: userId,
    })
    .where(eq(idColumn, id))
    .returning();

  return c.json(result[0]);
}
export async function auditedRestore<
  TTable extends AnyTable<any>,
>(
  c: Context,
  table: TTable,
  idColumn: AnyColumn,
  id: string,
) {
  const result = await db
    .update(table)
    .set({
      deletedAt: null,
      deletedBy: null,
    })
    .where(eq(idColumn, id))
    .returning();

  return c.json(result[0]);
}
export async function auditedDeleteForever<
  TTable extends AnyTable<any>,
>(
  c: Context,
  table: TTable,
  idColumn: AnyColumn,
  id: string,
) {
  await db
    .delete(table)
    .where(eq(idColumn, id));

  return c.json({
    success: true,
  });
}
export async function auditedFindById<
  TTable extends AnyTable<any>,
>(
  c: Context,
  table: TTable,
  idColumn: AnyColumn,
  id: string,
) {
  const rows = await db
    .select()
    .from(table)
    .where(eq(idColumn, id))
    .limit(1);

  return c.json(rows[0]) ?? null;
}
type SearchableRelation = {
	column: AnyColumn;
	foreignColumn: AnyColumn;
	searchColumn: AnyColumn;
	table: AnyTable<any>;
};
type AuditedListOptions<TTable extends AnyTable<any>> = {
  c: Context;
  table: TTable;
  searchableColumns?: AnyColumn[];
	searchableRelations?: SearchableRelation[];
  offset?: number;
  limit?: number;
};
export async function auditedList<
  TTable extends AnyTable<any>,
>({
  c,
  table,
  searchableColumns = [],
	searchableRelations = [],
  offset = 0,
  limit = 50,
}: AuditedListOptions<TTable>) {
	const search = c.req.query("search") || "";
	const offsetc = Number(c.req.query("offset") || offset);
	const limitc = Number(c.req.query("limit") || limit);
  const searchConditions =
    searchableColumns.map(
      (col: any) =>
        like(col, `%${search}%`)
    );
  const relationSearchConditions =
	search
		? searchableRelations.map(
			(relation) =>
				like(
					relation.searchColumn,
					`%${search}%`
				)
		)
		: [];
  const whereClause =
  searchConditions.length > 0
    ? and(
        isNull(table.deletedAt),
        or(
          ...searchConditions,
          ...relationSearchConditions
        )
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
        relation.foreignColumn
      )
    );
  }

  const data = query
    .where(whereClause)
    .offset(offsetc)
    .limit(limitc);

    return c.json(await data);
}
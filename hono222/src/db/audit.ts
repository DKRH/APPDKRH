import { db } from "@/db";
import { and, eq, isNull, like, or } from "drizzle-orm";

function stripAuditFields(data: any) {
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

export async function auditedInsert(
    c: any,
    table: any,
    data: any,
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
export async function auditedUpdate(
    c: any,
  table: any,
  idColumn: any,
  id: string,
  data: any,
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
export async function auditedDelete(
    c: any,
  table: any,
  idColumn: any,
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
export async function auditedRestore(
    c: any,
  table: any,
  idColumn: any,
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
export async function auditedDeleteForever(
    c: any,
  table: any,
  idColumn: any,
  id: string,
) {
  await db
    .delete(table)
    .where(eq(idColumn, id));

  return c.json({
    success: true,
  });
}
export async function auditedFindById(
    c: any,
  table: any,
  idColumn: any,
  id: string,
) {
  const rows = await db
    .select()
    .from(table)
    .where(eq(idColumn, id))
    .limit(1);

  return c.json(rows[0]) ?? null;
}
export async function auditedList({
    c,
    table,
    searchableColumns = [],
    offset = 0,
    limit = 50,
}: any) {
	const search = c.req.query("search") || "";
	const offsetc = Number(c.req.query("offset") || offset);
	const limitc = Number(c.req.query("limit") || limit);
  const searchConditions =
    searchableColumns.map(
      (col: any) =>
        like(col, `%${search}%`)
    );
  const whereClause =
  searchConditions.length > 0
    ? and(
        isNull(table.deletedAt),
        or(...searchConditions)
      )
    : isNull(table.deletedAt);

  const data = db
    .select()
    .from(table)
    .where(whereClause)
    .offset(offsetc)
    .limit(limitc);
    return c.json(await data);
}
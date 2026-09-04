import { db,and,
    eq,
    isNull,
    ilike,
    or,
    type AnyColumn,
    type PgTable,
    desc, } from "../index";

import { auditLogging } from "../schema";
import { getAuditContext } from "./context";
import { auditRedactedFields } from "./auditOptions";
import { getTableName } from "drizzle-orm/table";

export const AuditAction = {
	INSERT: "INSERT",
	UPDATE: "UPDATE",
	DELETE: "DELETE",
	RESTORE: "RESTORE",
	DELETE_FOREVER: "DELETE_FOREVER",
} as const;

type AuditAction =
	(typeof AuditAction)[keyof typeof AuditAction];

function sanitize(data: unknown) {
	if (
		!data ||
		typeof data !== "object" ||
		Array.isArray(data)
	) {
		return data;
	}

	const result = {
		...(data as Record<string, unknown>),
	};

	for (const field of auditRedactedFields) {
		if (field in result) {
			result[field] = "[REDACTED]";
		}
	}

	return result;
}

async function writeAudit(
	tx: any,
	data: {
		action: AuditAction;
		tableName: string;
		recordId?: string;
		oldData?: unknown;
		newData?: unknown;
		metadata?: Record<string, unknown>;
	},
) {
	const context = getAuditContext();

	await tx.insert(auditLogging).values({
		action: data.action,
		tableName: data.tableName,
		recordId: data.recordId,

		userId: context?.userId,
		ipAddress: context?.ipAddress,
		userAgent: context?.userAgent,
		requestId: context?.requestId,
		method: context?.method,
		path: context?.path,

		oldData: sanitize(data.oldData),
		newData: sanitize(data.newData),

		metadata: data.metadata,
	});
}

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
) {
    return db.transaction(async (tx) => {
		const context = getAuditContext();

		const [row] = await tx
			.insert(table)
			.values({
				...data,

				createdBy: context?.userId,
				updatedBy: context?.userId,
			} as TTable["$inferInsert"])
			.returning();

		if (!row) {
			throw new Error("Insert failed");
		}

		await writeAudit(tx, {
			action: AuditAction.INSERT,
			tableName: getTableName(table),
			recordId: String(
				(row as Record<string, unknown>).id,
			),
			newData: row,
		});

		return row;
	});
    /*const result = await db
        .insert(table)
        .values({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: userId,
            updatedBy: userId,
        })
        .returning();

    return result[0];*/
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
) {
    return db.transaction(async (tx) => {
		const [oldRow] = await tx
			.select()
			.from(table)
			.where(eq(idColumn, id))
			.limit(1);

		if (!oldRow) {
			return undefined;
		}

		const context = getAuditContext();

		const [newRow] = await tx
			.update(table)
			.set({
				...stripAuditFields(data),
                updatedAt: new Date(),
				updatedBy: context?.userId,
			} as Partial<TTable["$inferInsert"]>)
			.where(eq(idColumn, id))
			.returning();

		if (!newRow) {
			return undefined;
		}

		await writeAudit(tx, {
			action: AuditAction.UPDATE,
			tableName: getTableName(table),
			recordId: id,
			oldData: oldRow,
			newData: newRow,
		});

		return newRow;
	});
    /*const result = await db
        .update(table)
        .set({
            ...stripAuditFields(data),
            updatedAt: new Date(),
            updatedBy: userId,
        })
        .where(eq(idColumn, id))
        .returning();

    return result[0];*/
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
) {
    return db.transaction(async (tx) => {
		const [oldRow] = await tx
			.select()
			.from(table)
			.where(eq(idColumn, id))
			.limit(1);

		if (!oldRow) {
			return undefined;
		}

		const context = getAuditContext();

		const [newRow] = await tx
			.update(table)
			.set({
				deletedAt: new Date(),
				deletedBy: context?.userId,
				updatedBy: context?.userId,
			} as Partial<TTable["$inferInsert"]>)
			.where(eq(idColumn, id))
			.returning();

		if (!newRow) {
			return undefined;
		}

		await writeAudit(tx, {
			action: AuditAction.DELETE,
			tableName: getTableName(table),
			recordId: id,
			oldData: oldRow,
			newData: newRow,
		});

		return newRow;
	});
    /*const result = await db
        .update(table)
        .set({
            deletedAt: new Date(),
            deletedBy: userId,
            updatedAt: new Date(),
            updatedBy: userId,
        })
        .where(eq(idColumn, id))
        .returning();

    return result[0];*/
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
) {
    return db.transaction(async (tx) => {
		const [oldRow] = await tx
			.select()
			.from(table)
			.where(eq(idColumn, id))
			.limit(1);

		if (!oldRow) {
			return undefined;
		}

		const context = getAuditContext();

		const [newRow] = await tx
			.update(table)
			.set({
				deletedAt: null,
				deletedBy: null,
				updatedBy: context?.userId,
			} as Partial<TTable["$inferInsert"]>)
			.where(eq(idColumn, id))
			.returning();

		if (!newRow) {
			return undefined;
		}

		await writeAudit(tx, {
			action: AuditAction.RESTORE,
			tableName: getTableName(table),
			recordId: id,
			oldData: oldRow,
			newData: newRow,
		});

		return newRow;
	});
    /*const result = await db
        .update(table)
        .set({
            deletedAt: null,
            deletedBy: null,
            updatedAt: new Date(),
            updatedBy: userId,
        })
        .where(eq(idColumn, id))
        .returning();

    return result[0];*/
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
    return db.transaction(async (tx) => {
		const [oldRow] = await tx
			.select()
			.from(table)
			.where(eq(idColumn, id))
			.limit(1);

		if (!oldRow) {
			return undefined;
		}

		await tx
			.delete(table)
			.where(eq(idColumn, id));

		await writeAudit(tx, {
			action: AuditAction.DELETE_FOREVER,
			tableName: getTableName(table),
			recordId: id,
			oldData: oldRow,
			newData: null,
		});

		return oldRow;
	});
    /*await db
        .delete(table)
        .where(eq(idColumn, id));

    return {
        success: true,
    };*/
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
        .orderBy(desc(table.createdAt))
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
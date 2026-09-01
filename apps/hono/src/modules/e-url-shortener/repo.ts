import { eq } from "drizzle-orm";

import { db } from "@dkrh/db";
import { eUrlShortener } from "@dkrh/db/schema";

import * as audit from "@/db/audit";

import type {
	NewEUrlShortener,
} from "@dkrh/types";

const table = eUrlShortener;

/* =========================
   GET ALL
========================= */

export async function getAll(
	search: string,
	offset: number,
	limit: number,
) {
	return audit.auditedList({
		table,
		search,
		searchableColumns: [
			table.originalURL,
			table.shortenURL,
			table.isLocked,
			table.password,
			table.expireDateUTC,
		],
		offset,
		limit,
	});
}

/* =========================
   FIND BY ID
========================= */

export async function findByID(
	id: string,
) {
	const [url] = await db
		.select({
			id: table.id,
			isLocked: table.isLocked,
		})
		.from(table)
		.where(eq(table.id, id));

	return url;
}

/* =========================
   CREATE
========================= */

export async function create(
	data: NewEUrlShortener,
	userId: string,
) {
	return audit.auditedInsert(
		table,
		data,
		userId,
	);
}

/* =========================
   UPDATE
========================= */

export async function update(
	id: string,
	data: Partial<NewEUrlShortener>,
	userId: string,
) {
	return audit.auditedUpdate(
		table,
		table.id,
		id,
		data,
		userId,
	);
}

/* =========================
   UPDATE LOCK
========================= */

export async function updateLock(
	id: string,
	isLocked: boolean,
	userId: string,
) {
	const updated =
		await audit.auditedUpdate(
			table,
			table.id,
			id,
			{
				isLocked,
			},
			userId,
		);

	return updated;
}

/* =========================
   DELETE
========================= */

export async function remove(
	id: string,
	userId: string,
) {
	return audit.auditedDelete(
		table,
		table.id,
		id,
		userId,
	);
}

/* =========================
   RESTORE
========================= */

export async function restore(
	id: string,
	userId: string,
) {
	return audit.auditedRestore(
		table,
		table.id,
		id,
		userId,
	);
}

/* =========================
   DELETE FOREVER
========================= */

export async function deleteForever(
	id: string,
) {
	return audit.auditedDeleteForever(
		table,
		table.id,
		id,
	);
}
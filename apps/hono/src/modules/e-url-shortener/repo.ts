import { db,eq } from "@dkrh/db";
import { eUrlShortener } from "@dkrh/db/schema";

import * as audit from "@dkrh/db/audit";

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
) {
	return audit.auditedInsert(
		table,
		data,
	);
}

/* =========================
   UPDATE
========================= */

export async function update(
	id: string,
	data: Partial<NewEUrlShortener>,
) {
	return audit.auditedUpdate(
		table,
		table.id,
		id,
		data,
	);
}

/* =========================
   UPDATE LOCK
========================= */

export async function updateLock(
	id: string,
	isLocked: boolean,
) {
	const updated =
		await audit.auditedUpdate(
			table,
			table.id,
			id,
			{
				isLocked,
			},
		);

	return updated;
}

/* =========================
   DELETE
========================= */

export async function remove(
	id: string,
) {
	return audit.auditedDelete(
		table,
		table.id,
		id,
	);
}

/* =========================
   RESTORE
========================= */

export async function restore(
	id: string,
) {
	return audit.auditedRestore(
		table,
		table.id,
		id,
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
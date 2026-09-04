import {
	kMUniverses,
} from "@dkrh/db/schema";

import * as audit from "@dkrh/db/audit";

const table = kMUniverses;

export async function getAll(
	search: string,
	offset: number,
	limit: number,
) {
	return audit.auditedList({
		table,
		search,
		searchableColumns: [
			table.name,
			table.desc,
		],
		offset,
		limit,
	});
}

export async function create(
	data: typeof table.$inferInsert,
) {
	return audit.auditedInsert(
		table,
		data,
	);
}

export async function update(
	id: string,
	data: Partial<typeof table.$inferInsert>,
) {
	return audit.auditedUpdate(
		table,
		table.id,
		id,
		data,
	);
}

export async function remove(
	id: string,
) {
	return audit.auditedDelete(
		table,
		table.id,
		id,
	);
}

export async function restore(
	id: string,
) {
	return audit.auditedRestore(
		table,
		table.id,
		id,
	);
}

export async function deleteForever(
	id: string,
) {
	return audit.auditedDeleteForever(
		table,
		table.id,
		id,
	);
}
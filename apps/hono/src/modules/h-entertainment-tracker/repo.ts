import {
	hEntertainmentTracker,
	hEntertainmentTrackerType,
} from "@dkrh/db/schema";

import * as audit from "@/db/audit";

const table = hEntertainmentTracker;

export async function getAll(
	search: string,
	offset: number,
	limit: number,
) {
	return audit.auditedList({
		table,
		search,
		searchableColumns: [
			table.entryTitle,
			table.lastMark,
			table.statusDL,
			table.statusPublication,
			table.linkDL,
		],
		searchableRelations: [
			{
				column: table.typeId,
				table: hEntertainmentTrackerType,
				foreignColumn:
					hEntertainmentTrackerType.id,
				searchColumn:
					hEntertainmentTrackerType.name,
			},
		],
		offset,
		limit,
	});
}

export async function create(
	data: typeof table.$inferInsert,
	userId: string,
) {
	return audit.auditedInsert(
		table,
		data,
		userId,
	);
}

export async function update(
	id: string,
	data: Partial<typeof table.$inferInsert>,
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

export async function deleteForever(
	id: string,
) {
	return audit.auditedDeleteForever(
		table,
		table.id,
		id,
	);
}
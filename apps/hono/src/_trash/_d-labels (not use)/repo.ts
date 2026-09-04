import { dLabels } from "@dkrh/db/schema";

import * as audit from "@dkrh/db/audit";

import type {
	NewDLabels,
} from "@dkrh/types";

const table = dLabels;

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
		],
		offset,
		limit,
	});
}

export async function create(
	data: NewDLabels,
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
	data: Partial<NewDLabels>,
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
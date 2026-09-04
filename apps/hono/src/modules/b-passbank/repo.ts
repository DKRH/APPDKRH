import { b_passbank } from "@dkrh/db/schema";
import * as audit from "@dkrh/db/audit";

import type {
	NewBPassbank,
} from "@dkrh/types";

const table = b_passbank;

export async function getAll(
	search: string,
	offset: number,
	limit: number,
) {
	return audit.auditedList({
		table,

		search,

		searchableColumns: [
			table.title,
			table.username,
			table.note,
		],

		offset,
		limit,
	});
}

export async function create(
	data: NewBPassbank,
) {
	return audit.auditedInsert(
		table,
		data,
	);
}

export async function update(
	id: string,
	data: Partial<NewBPassbank>,
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

export async function findById(
	id: string,
) {
	return audit.auditedFindById(
		table,
		table.id,
		id,
	);
}
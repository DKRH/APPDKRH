import { b_passbank } from "@dkrh/db/schema";
import * as audit from "@/db/audit";

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
	data: Partial<NewBPassbank>,
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

export async function findById(
	id: string,
) {
	return audit.auditedFindById(
		table,
		table.id,
		id,
	);
}
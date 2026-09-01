import {
	dNotes,
	dLabels,
	dJNoteLabels,
} from "@dkrh/db/schema";

import { db } from "@dkrh/db";

import * as audit from "@/db/audit";

import {
	and,
	eq,
	isNull,
} from "drizzle-orm";

import type {
	NewDNotes,
} from "@dkrh/types";

const table = dNotes;

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
			table.title,
			table.content,
		],

		offset,
		limit,
	});
}

/* =========================
   GET BY ID
========================= */

export async function getById(
	id: string,
) {
	const [note] = await db
		.select()
		.from(table)
		.where(
			and(
				eq(table.id, id),
				isNull(table.deletedAt),
			),
		)
		.limit(1);

	if (!note) {
		return null;
	}

	const labels = await db
		.select({
			id: dLabels.id,
			name: dLabels.name,
		})
		.from(dJNoteLabels)
		.innerJoin(
			dLabels,
			eq(
				dJNoteLabels.labelId,
				dLabels.id,
			),
		)
		.where(
			and(
				eq(
					dJNoteLabels.noteId,
					id,
				),
				isNull(
					dJNoteLabels.deletedAt,
				),
				isNull(
					dLabels.deletedAt,
				),
			),
		);

	return {
		...note,
		labels,
	};
}

/* =========================
   CREATE
========================= */

export async function create(
	data: NewDNotes,
	labelIds: string[],
	userId: string,
) {
	const note =
		await audit.auditedInsert(
			table,
			data,
			userId,
		);

	if (
		!note ||
		labelIds.length === 0
	) {
		return note;
	}

	for (
		const labelId of labelIds
	) {
		await audit.auditedInsert(
			dJNoteLabels,
			{
				noteId: note.id,
				labelId,
			},
			userId,
		);
	}

	return note;
}

/* =========================
   UPDATE
========================= */

export async function update(
	id: string,
	data: Partial<NewDNotes>,
	labelIds: string[] | undefined,
	userId: string,
) {
	const result =
		await audit.auditedUpdate(
			table,
			table.id,
			id,
			data,
			userId,
		);

	if (
		Array.isArray(labelIds)
	) {
		const oldRelations =
			await db
				.select()
				.from(dJNoteLabels)
				.where(
					and(
						eq(
							dJNoteLabels.noteId,
							id,
						),
						isNull(
							dJNoteLabels.deletedAt,
						),
					),
				);

		/*
		 * Soft-delete existing
		 * label relationships.
		 */
		for (
			const relation of oldRelations
		) {
			await audit.auditedDelete(
				dJNoteLabels,
				dJNoteLabels.id,
				relation.id,
				userId,
			);
		}

		/*
		 * Create the new
		 * label relationships.
		 */
		for (
			const labelId of labelIds
		) {
			await audit.auditedInsert(
				dJNoteLabels,
				{
					noteId: id,
					labelId,
				},
				userId,
			);
		}
	}

	return result;
}

/* =========================
   TOGGLE PINNED
========================= */

export async function togglePinned(
	id: string,
	isPinned: boolean,
	userId: string,
) {
	return audit.auditedUpdate(
		table,
		table.id,
		id,
		{
			isPinned,
		},
		userId,
	);
}

/* =========================
   TOGGLE ARCHIVED
========================= */

export async function toggleArchived(
	id: string,
	isArchived: boolean,
	userId: string,
) {
	return audit.auditedUpdate(
		table,
		table.id,
		id,
		{
			isArchived,
		},
		userId,
	);
}

/* =========================
   SOFT DELETE
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
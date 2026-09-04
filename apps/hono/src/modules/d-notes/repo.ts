
import {
	db,
	dNotes,
	dLabels,
	dJNoteLabels,
	and,
	desc,
	eq,
	ilike,
	or,
} from "@dkrh/db";

import { getAuditContext } from "@dkrh/db/audit/context";

// ============================================================
// NOTES
// ============================================================

export async function findAllNotes(
	options?: {
		view?: "notes" | "archive" | "trash";
		search?: string;
	},
) {
	const context = getAuditContext();
	const view = options?.view ?? "notes";
	const search = options?.search?.trim();

	const conditions = [
		eq(dNotes.createdBy, context.userId),
	];

	if (view === "trash") {
		conditions.push(
			eq(dNotes.isTrashed, true),
		);
	} else if (view === "archive") {
		conditions.push(
			eq(dNotes.isArchived, true),
			eq(dNotes.isTrashed, false),
		);
	} else {
		conditions.push(
			eq(dNotes.isArchived, false),
			eq(dNotes.isTrashed, false),
		);
	}

	if (search) {
		conditions.push(
			or(
				ilike(
					dNotes.title,
					`%${search}%`,
				),
				ilike(
					dNotes.content,
					`%${search}%`,
				),
			)!,
		);
	}

	return db
		.select()
		.from(dNotes)
		.where(and(...conditions))
		.orderBy(
			desc(dNotes.isPinned),
			desc(dNotes.updatedAt),
		);
}


export async function findNoteById(
	noteId: string,
) {
	const context = getAuditContext();
	return db
		.select()
		.from(dNotes)
		.where(
			and(
				eq(dNotes.id, noteId),
				eq(dNotes.createdBy, context.userId),
			),
		)
		.limit(1);
}


export async function createNote(
	data: {
		title: string;
		content?: string | null;
		color?: string;
	},
) {
	const context = getAuditContext();
	const [note] = await db
		.insert(dNotes)
		.values({
			title: data.title,
			content: data.content ?? null,
			color:
				data.color ??
				"bg-zinc-900",

			createdBy: context.userId,
			updatedBy: context.userId,
		})
		.returning();

	return note;
}


export async function updateNote(
	noteId: string,
	data: {
		title?: string;
		content?: string | null;
		color?: string;
	},
) {
	
	const context = getAuditContext();
	const [note] = await db
		.update(dNotes)
		.set({
			...data,
			updatedBy: context.userId,
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(dNotes.id, noteId),
				eq(dNotes.createdBy, context.userId),
			),
		)
		.returning();

	return note;
}


export async function setPinned(
	noteId: string,
	isPinned: boolean,
) {
	
	const context = getAuditContext();
	const [note] = await db
		.update(dNotes)
		.set({
			isPinned,
			updatedBy: context.userId,
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(dNotes.id, noteId),
				eq(dNotes.createdBy, context.userId),
			),
		)
		.returning();

	return note;
}


export async function setArchived(
	noteId: string,
	isArchived: boolean,
) {
	
	const context = getAuditContext();
	const [note] = await db
		.update(dNotes)
		.set({
			isArchived,
			updatedBy: context.userId,
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(dNotes.id, noteId),
				eq(dNotes.createdBy, context.userId),
			),
		)
		.returning();

	return note;
}


export async function moveNoteToTrash(
	noteId: string,
) {
	
	const context = getAuditContext();
	const [note] = await db
		.update(dNotes)
		.set({
			isTrashed: true,
			isArchived: false,
			isPinned: false,

			deletedAt: new Date(),
			deletedBy: context.userId,

			updatedBy: context.userId,
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(dNotes.id, noteId),
				eq(dNotes.createdBy, context.userId),
				eq(dNotes.isTrashed, false),
			),
		)
		.returning();

	return note;
}


export async function restoreNote(
	noteId: string,
) {
	
	const context = getAuditContext();
	const [note] = await db
		.update(dNotes)
		.set({
			isTrashed: false,

			deletedAt: null,
			deletedBy: null,

			updatedBy: context.userId,
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(dNotes.id, noteId),
				eq(dNotes.createdBy, context.userId),
				eq(dNotes.isTrashed, true),
			),
		)
		.returning();

	return note;
}


export async function deleteNoteForever(
	noteId: string,
) {
	
	const context = getAuditContext();
	const [note] = await db
		.delete(dNotes)
		.where(
			and(
				eq(dNotes.id, noteId),
				eq(dNotes.createdBy, context.userId),
				eq(dNotes.isTrashed, true),
			),
		)
		.returning();

	return note;
}


// ============================================================
// LABELS
// ============================================================

export async function findAllLabels() {
	const context = getAuditContext();
	return db
		.select()
		.from(dLabels)
		.where(
			eq(dLabels.createdBy, context.userId),
		)
		.orderBy(
			dLabels.name,
		);
}


export async function findLabelById(
	labelId: string,
) {
	
	const context = getAuditContext();
	return db
		.select()
		.from(dLabels)
		.where(
			and(
				eq(dLabels.id, labelId),
				eq(dLabels.createdBy, context.userId),
			),
		)
		.limit(1);
}


export async function createLabel(
	name: string,
) {
	
	const context = getAuditContext();
	const [label] = await db
		.insert(dLabels)
		.values({
			name,

			createdBy: context.userId,
			updatedBy: context.userId,
		})
		.returning();

	return label;
}


export async function updateLabel(
	labelId: string,
	name: string,
) {
	
	const context = getAuditContext();
	const [label] = await db
		.update(dLabels)
		.set({
			name,
			updatedBy: context.userId,
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(dLabels.id, labelId),
				eq(dLabels.createdBy, context.userId),
			),
		)
		.returning();

	return label;
}


export async function deleteLabel(
	labelId: string,
) {
	
	const context = getAuditContext();
	const [label] = await db
		.delete(dLabels)
		.where(
			and(
				eq(dLabels.id, labelId),
				eq(dLabels.createdBy, context.userId),
			),
		)
		.returning();

	return label;
}


// ============================================================
// NOTE <-> LABEL
// ============================================================

export async function findLabelsByNote(
	noteId: string,
) {
	
	const context = getAuditContext();
	return db
		.select({
			id: dLabels.id,
			name: dLabels.name,
			createdAt: dLabels.createdAt,
			updatedAt: dLabels.updatedAt,
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
				eq(dJNoteLabels.noteId, noteId),
				eq(dJNoteLabels.createdBy, context.userId),
				eq(dLabels.createdBy, context.userId),
			),
		)
		.orderBy(dLabels.name);
}


export async function findNotesByLabel(
	labelId: string,
) {
	
	const context = getAuditContext();
	return db
		.select({
			id: dNotes.id,
			title: dNotes.title,
			content: dNotes.content,
			color: dNotes.color,
			isPinned: dNotes.isPinned,
			isArchived: dNotes.isArchived,
			isTrashed: dNotes.isTrashed,
			createdAt: dNotes.createdAt,
			updatedAt: dNotes.updatedAt,
		})
		.from(dJNoteLabels)
		.innerJoin(
			dNotes,
			eq(
				dJNoteLabels.noteId,
				dNotes.id,
			),
		)
		.where(
			and(
				eq(dJNoteLabels.labelId, labelId),
				eq(dJNoteLabels.createdBy, context.userId),
				eq(dNotes.createdBy, context.userId),
			),
		)
		.orderBy(
			desc(dNotes.updatedAt),
		);
}


export async function addLabelToNote(
	noteId: string,
	labelId: string,
) {
	
	const context = getAuditContext();
	const [relation] = await db
		.insert(dJNoteLabels)
		.values({
			noteId,
			labelId,

			createdBy: context.userId,
			updatedBy: context.userId,
		})
		.onConflictDoNothing({
			target: [
				dJNoteLabels.noteId,
				dJNoteLabels.labelId,
			],
		})
		.returning();

	return relation;
}


export async function removeLabelFromNote(
	noteId: string,
	labelId: string,
) {
	
	const context = getAuditContext();
	const [relation] = await db
		.delete(dJNoteLabels)
		.where(
			and(
				eq(dJNoteLabels.noteId, noteId),
				eq(dJNoteLabels.labelId, labelId),
				eq(dJNoteLabels.createdBy, context.userId),
			),
		)
		.returning();

	return relation;
}
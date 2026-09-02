
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


// ============================================================
// NOTES
// ============================================================

export async function findAllNotes(
	userId: string,
	options?: {
		view?: "notes" | "archive" | "trash";
		search?: string;
	},
) {
	const view = options?.view ?? "notes";
	const search = options?.search?.trim();

	const conditions = [
		eq(dNotes.createdBy, userId),
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
	userId: string,
	noteId: string,
) {
	return db
		.select()
		.from(dNotes)
		.where(
			and(
				eq(dNotes.id, noteId),
				eq(dNotes.createdBy, userId),
			),
		)
		.limit(1);
}


export async function createNote(
	userId: string,
	data: {
		title: string;
		content?: string | null;
		color?: string;
	},
) {
	const [note] = await db
		.insert(dNotes)
		.values({
			title: data.title,
			content: data.content ?? null,
			color:
				data.color ??
				"bg-zinc-900",

			createdBy: userId,
			updatedBy: userId,
		})
		.returning();

	return note;
}


export async function updateNote(
	userId: string,
	noteId: string,
	data: {
		title?: string;
		content?: string | null;
		color?: string;
	},
) {
	const [note] = await db
		.update(dNotes)
		.set({
			...data,
			updatedBy: userId,
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(dNotes.id, noteId),
				eq(dNotes.createdBy, userId),
			),
		)
		.returning();

	return note;
}


export async function setPinned(
	userId: string,
	noteId: string,
	isPinned: boolean,
) {
	const [note] = await db
		.update(dNotes)
		.set({
			isPinned,
			updatedBy: userId,
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(dNotes.id, noteId),
				eq(dNotes.createdBy, userId),
			),
		)
		.returning();

	return note;
}


export async function setArchived(
	userId: string,
	noteId: string,
	isArchived: boolean,
) {
	const [note] = await db
		.update(dNotes)
		.set({
			isArchived,
			updatedBy: userId,
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(dNotes.id, noteId),
				eq(dNotes.createdBy, userId),
			),
		)
		.returning();

	return note;
}


export async function moveNoteToTrash(
	userId: string,
	noteId: string,
) {
	const [note] = await db
		.update(dNotes)
		.set({
			isTrashed: true,
			isArchived: false,
			isPinned: false,

			deletedAt: new Date(),
			deletedBy: userId,

			updatedBy: userId,
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(dNotes.id, noteId),
				eq(dNotes.createdBy, userId),
				eq(dNotes.isTrashed, false),
			),
		)
		.returning();

	return note;
}


export async function restoreNote(
	userId: string,
	noteId: string,
) {
	const [note] = await db
		.update(dNotes)
		.set({
			isTrashed: false,

			deletedAt: null,
			deletedBy: null,

			updatedBy: userId,
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(dNotes.id, noteId),
				eq(dNotes.createdBy, userId),
				eq(dNotes.isTrashed, true),
			),
		)
		.returning();

	return note;
}


export async function deleteNoteForever(
	userId: string,
	noteId: string,
) {
	const [note] = await db
		.delete(dNotes)
		.where(
			and(
				eq(dNotes.id, noteId),
				eq(dNotes.createdBy, userId),
				eq(dNotes.isTrashed, true),
			),
		)
		.returning();

	return note;
}


// ============================================================
// LABELS
// ============================================================

export async function findAllLabels(
	userId: string,
) {
	return db
		.select()
		.from(dLabels)
		.where(
			eq(dLabels.createdBy, userId),
		)
		.orderBy(
			dLabels.name,
		);
}


export async function findLabelById(
	userId: string,
	labelId: string,
) {
	return db
		.select()
		.from(dLabels)
		.where(
			and(
				eq(dLabels.id, labelId),
				eq(dLabels.createdBy, userId),
			),
		)
		.limit(1);
}


export async function createLabel(
	userId: string,
	name: string,
) {
	const [label] = await db
		.insert(dLabels)
		.values({
			name,

			createdBy: userId,
			updatedBy: userId,
		})
		.returning();

	return label;
}


export async function updateLabel(
	userId: string,
	labelId: string,
	name: string,
) {
	const [label] = await db
		.update(dLabels)
		.set({
			name,
			updatedBy: userId,
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(dLabels.id, labelId),
				eq(dLabels.createdBy, userId),
			),
		)
		.returning();

	return label;
}


export async function deleteLabel(
	userId: string,
	labelId: string,
) {
	const [label] = await db
		.delete(dLabels)
		.where(
			and(
				eq(dLabels.id, labelId),
				eq(dLabels.createdBy, userId),
			),
		)
		.returning();

	return label;
}


// ============================================================
// NOTE <-> LABEL
// ============================================================

export async function findLabelsByNote(
	userId: string,
	noteId: string,
) {
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
				eq(dJNoteLabels.createdBy, userId),
				eq(dLabels.createdBy, userId),
			),
		)
		.orderBy(dLabels.name);
}


export async function findNotesByLabel(
	userId: string,
	labelId: string,
) {
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
				eq(dJNoteLabels.createdBy, userId),
				eq(dNotes.createdBy, userId),
			),
		)
		.orderBy(
			desc(dNotes.updatedAt),
		);
}


export async function addLabelToNote(
	userId: string,
	noteId: string,
	labelId: string,
) {
	const [relation] = await db
		.insert(dJNoteLabels)
		.values({
			noteId,
			labelId,

			createdBy: userId,
			updatedBy: userId,
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
	userId: string,
	noteId: string,
	labelId: string,
) {
	const [relation] = await db
		.delete(dJNoteLabels)
		.where(
			and(
				eq(dJNoteLabels.noteId, noteId),
				eq(dJNoteLabels.labelId, labelId),
				eq(dJNoteLabels.createdBy, userId),
			),
		)
		.returning();

	return relation;
}
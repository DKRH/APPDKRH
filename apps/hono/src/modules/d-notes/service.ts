import type { Context } from "hono";

import * as repo from "./repo";


function getId(c: Context): string {
	const id = c.req.param("id");

	if (!id) {
		throw new Error("Invalid ID");
	}

	return id;
}


function errorResponse(error: unknown) {
	if (
		error instanceof Error &&
		error.message === "Unauthorized"
	) {
		return {
			status: 401 as const,
			message: "Unauthorized",
		};
	}

	if (
		error instanceof Error &&
		error.message === "Invalid ID"
	) {
		return {
			status: 400 as const,
			message: "Invalid ID",
		};
	}

	console.error(error);

	return {
		status: 500 as const,
		message: "Internal server error",
	};
}


// ============================================================
// NOTES
// ============================================================

export async function getAll(c: Context) {
	try {
		const view =
			(c.req.query("view") ??
				"notes") as
				| "notes"
				| "archive"
				| "trash";

		const search =
			c.req.query("search");

		const data =
			await repo.findAllNotes(
				{
					view,
					search,
				},
			);

		return c.json({ data });
	} catch (error) {
		const result = errorResponse(error);

		return c.json(
			{ message: result.message },
			result.status,
		);
	}
}


export async function getOne(c: Context) {
	try {
		const noteId = getId(c);

		const [note] =
			await repo.findNoteById(
				noteId,
			);

		if (!note) {
			return c.json(
				{
					message: "Note not found",
				},
				404,
			);
		}

		const labels =
			await repo.findLabelsByNote(
				noteId,
			);

		return c.json({
			data: {
				...note,
				labels,
			},
		});
	} catch (error) {
		const result = errorResponse(error);

		return c.json(
			{ message: result.message },
			result.status,
		);
	}
}


export async function createData(c: Context) {
	try {

		const body = await c.req.json();

		const title =
			typeof body.title === "string"
				? body.title.trim()
				: "";

		const content =
			typeof body.content === "string"
				? body.content.trim()
				: null;

		const color =
			typeof body.color === "string"
				? body.color
				: "bg-zinc-900";

		if (!title && !content) {
			return c.json(
				{
					message:
						"Title or content is required",
				},
				400,
			);
		}

		const note =
			await repo.createNote(
				{
					title,
					content,
					color,
				},
			);

		return c.json(
			{
				message: "Note created",
				data: note,
			},
			201,
		);
	} catch (error) {
		const result = errorResponse(error);

		return c.json(
			{ message: result.message },
			result.status,
		);
	}
}


export async function editData(c: Context) {
	try {
		const noteId = getId(c);

		const body = await c.req.json();

		const update: {
			title?: string;
			content?: string | null;
			color?: string;
		} = {};

		if (typeof body.title === "string") {
			update.title =
				body.title.trim();
		}

		if (typeof body.content === "string") {
			update.content =
				body.content.trim();
		}

		if (body.content === null) {
			update.content = null;
		}

		if (typeof body.color === "string") {
			update.color = body.color;
		}

		if (!Object.keys(update).length) {
			return c.json(
				{
					message:
						"Nothing to update",
				},
				400,
			);
		}

		const note =
			await repo.updateNote(
				noteId,
				update,
			);

		if (!note) {
			return c.json(
				{
					message:
						"Note not found",
				},
				404,
			);
		}

		return c.json({
			message: "Note updated",
			data: note,
		});
	} catch (error) {
		const result = errorResponse(error);

		return c.json(
			{ message: result.message },
			result.status,
		);
	}
}


export async function togglePin(c: Context) {
	try {
		const noteId = getId(c);

		const [note] =
			await repo.findNoteById(
				noteId,
			);

		if (!note) {
			return c.json(
				{
					message:
						"Note not found",
				},
				404,
			);
		}

		const updated =
			await repo.setPinned(
				noteId,
				!note.isPinned,
			);

		return c.json({
			message: updated?.isPinned
				? "Note pinned"
				: "Note unpinned",
			data: updated,
		});
	} catch (error) {
		const result = errorResponse(error);

		return c.json(
			{ message: result.message },
			result.status,
		);
	}
}


export async function toggleArchive(c: Context) {
	try {
		const noteId = getId(c);

		const [note] =
			await repo.findNoteById(
				noteId,
			);

		if (!note) {
			return c.json(
				{
					message:
						"Note not found",
				},
				404,
			);
		}

		const updated =
			await repo.setArchived(
				noteId,
				!note.isArchived,
			);

		return c.json({
			message: updated?.isArchived
				? "Note archived"
				: "Note unarchived",
			data: updated,
		});
	} catch (error) {
		const result = errorResponse(error);

		return c.json(
			{ message: result.message },
			result.status,
		);
	}
}


export async function restore(c: Context) {
	try {
		const noteId = getId(c);

		const note =
			await repo.restoreNote(
				noteId,
			);

		if (!note) {
			return c.json(
				{
					message:
						"Note not found in trash",
				},
				404,
			);
		}

		return c.json({
			message: "Note restored",
			data: note,
		});
	} catch (error) {
		const result = errorResponse(error);

		return c.json(
			{ message: result.message },
			result.status,
		);
	}
}


export async function deleteData(c: Context) {
	try {
		const noteId = getId(c);

		const note =
			await repo.moveNoteToTrash(
				noteId,
			);

		if (!note) {
			return c.json(
				{
					message:
						"Note not found",
				},
				404,
			);
		}

		return c.json({
			message:
				"Note moved to trash",
			data: note,
		});
	} catch (error) {
		const result = errorResponse(error);

		return c.json(
			{ message: result.message },
			result.status,
		);
	}
}


export async function deleteForever(c: Context) {
	try {
		const noteId = getId(c);

		const note =
			await repo.deleteNoteForever(
				noteId,
			);

		if (!note) {
			return c.json(
				{
					message:
						"Note not found in trash",
				},
				404,
			);
		}

		return c.json({
			message:
				"Note permanently deleted",
		});
	} catch (error) {
		const result = errorResponse(error);

		return c.json(
			{ message: result.message },
			result.status,
		);
	}
}


// ============================================================
// LABELS
// ============================================================

export async function getLabels(c: Context) {
	try {

		const data =
			await repo.findAllLabels();

		return c.json({ data });
	} catch (error) {
		const result = errorResponse(error);

		return c.json(
			{ message: result.message },
			result.status,
		);
	}
}


export async function createLabel(c: Context) {
	try {
		const body = await c.req.json();

		const name =
			typeof body.name === "string"
				? body.name.trim()
				: "";

		if (!name) {
			return c.json(
				{
					message:
						"Label name is required",
				},
				400,
			);
		}

		const label =
			await repo.createLabel(
				name,
			);

		return c.json(
			{
				message: "Label created",
				data: label,
			},
			201,
		);
	} catch (error) {
		const result = errorResponse(error);

		return c.json(
			{ message: result.message },
			result.status,
		);
	}
}


export async function updateLabel(c: Context) {
	try {
		const labelId = getId(c);

		const body = await c.req.json();

		const name =
			typeof body.name === "string"
				? body.name.trim()
				: "";

		if (!name) {
			return c.json(
				{
					message:
						"Label name is required",
				},
				400,
			);
		}

		const label =
			await repo.updateLabel(
				labelId,
				name,
			);

		if (!label) {
			return c.json(
				{
					message:
						"Label not found",
				},
				404,
			);
		}

		return c.json({
			message: "Label updated",
			data: label,
		});
	} catch (error) {
		const result = errorResponse(error);

		return c.json(
			{ message: result.message },
			result.status,
		);
	}
}


export async function deleteLabel(c: Context) {
	try {
		const labelId = getId(c);

		const label =
			await repo.deleteLabel(
				labelId,
			);

		if (!label) {
			return c.json(
				{
					message:
						"Label not found",
				},
				404,
			);
		}

		return c.json({
			message:
				"Label deleted",
		});
	} catch (error) {
		const result = errorResponse(error);

		return c.json(
			{ message: result.message },
			result.status,
		);
	}
}


// ============================================================
// NOTE <-> LABEL
// ============================================================

export async function getNoteLabels(c: Context) {
	try {
		const noteId = getId(c);

		const [note] =
			await repo.findNoteById(
				noteId,
			);

		if (!note) {
			return c.json(
				{
					message:
						"Note not found",
				},
				404,
			);
		}

		const labels =
			await repo.findLabelsByNote(
				noteId,
			);

		return c.json({
			data: labels,
		});
	} catch (error) {
		const result = errorResponse(error);

		return c.json(
			{ message: result.message },
			result.status,
		);
	}
}


export async function addLabel(c: Context) {
	try {
		const noteId = getId(c);

		const body = await c.req.json();

		const labelId =
			typeof body.labelId === "string"
				? body.labelId
				: "";

		if (!labelId) {
			return c.json(
				{
					message:
						"labelId is required",
				},
				400,
			);
		}

		// Make sure the note belongs
		// to the current user.
		const [note] =
			await repo.findNoteById(
				noteId,
			);

		if (!note) {
			return c.json(
				{
					message:
						"Note not found",
				},
				404,
			);
		}

		// Make sure the label belongs
		// to the current user.
		const [label] =
			await repo.findLabelById(
				labelId,
			);

		if (!label) {
			return c.json(
				{
					message:
						"Label not found",
				},
				404,
			);
		}

		const relation =
			await repo.addLabelToNote(
				noteId,
				labelId,
			);

		return c.json(
			{
				message: relation
					? "Label added"
					: "Label already attached",
				data: relation,
			},
			relation ? 201 : 200,
		);
	} catch (error) {
		const result = errorResponse(error);

		return c.json(
			{ message: result.message },
			result.status,
		);
	}
}


export async function removeLabel(c: Context) {
	try {
		const noteId = getId(c);

		const labelId =
			c.req.query("labelId");

		if (!labelId) {
			return c.json(
				{
					message:
						"labelId is required",
				},
				400,
			);
		}

		const relation =
			await repo.removeLabelFromNote(
				noteId,
				labelId,
			);

		if (!relation) {
			return c.json(
				{
					message:
						"Label is not attached to this note",
				},
				404,
			);
		}

		return c.json({
			message: "Label removed",
		});
	} catch (error) {
		const result = errorResponse(error);

		return c.json(
			{ message: result.message },
			result.status,
		);
	}
}
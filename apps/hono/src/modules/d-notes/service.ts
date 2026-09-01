import type { Context } from "hono";

import type {
	NewDNotes,
} from "@dkrh/types";

import * as repo from "./repo";

/* =========================
   GET ALL
========================= */

export async function getAll(
	c: Context,
) {
	const search =
		c.req.query("search") ?? "";

	const offset = Number(
		c.req.query("offset") ?? 0,
	);

	const limit = Number(
		c.req.query("limit") ?? 50,
	);

	const data =
		await repo.getAll(
			search,
			offset,
			limit,
		);

	return c.json(data);
}

/* =========================
   GET BY ID
========================= */

export async function getById(
	c: Context,
) {
	const id =
		c.req.param("id");

	if (!id) {
		return c.json(
			{
				message: "ID is required",
			},
			400,
		);
	}

	const data =
		await repo.getById(id);

	if (!data) {
		return c.json(
			{
				message: "Note not found",
			},
			404,
		);
	}

	return c.json(data);
}

/* =========================
   CREATE
========================= */

export async function createData(
	c: Context,
) {
	const body =
		await c.req.json<
			NewDNotes & {
				labelIds?: string[];
			}
		>();

	const {
		labelIds = [],
		...noteData
	} = body;

	const userId =
		c.get("userId");

	const data =
		await repo.create(
			noteData,
			Array.isArray(labelIds)
				? labelIds
				: [],
			userId,
		);

	return c.json(
		data,
		201,
	);
}

/* =========================
   UPDATE
========================= */

export async function editData(
	c: Context,
) {
	const id =
		c.req.param("id");

	if (!id) {
		return c.json(
			{
				message: "ID is required",
			},
			400,
		);
	}

	const body =
		await c.req.json<
			Partial<NewDNotes> & {
				labelIds?: string[];
			}
		>();

	const {
		labelIds,
		...noteData
	} = body;

	const userId =
		c.get("userId");

	const data =
		await repo.update(
			id,
			noteData,
			labelIds,
			userId,
		);

	if (!data) {
		return c.json(
			{
				message: "Note not found",
			},
			404,
		);
	}

	return c.json(data);
}

/* =========================
   TOGGLE PINNED
========================= */

export async function togglePinned(
	c: Context,
) {
	const id =
		c.req.param("id");

	if (!id) {
		return c.json(
			{
				message: "ID is required",
			},
			400,
		);
	}

	const body =
		await c.req.json<{
			isPinned: boolean;
		}>();

	const userId =
		c.get("userId");

	const data =
		await repo.togglePinned(
			id,
			body.isPinned,
			userId,
		);

	if (!data) {
		return c.json(
			{
				message: "Note not found",
			},
			404,
		);
	}

	return c.json(data);
}

/* =========================
   TOGGLE ARCHIVED
========================= */

export async function toggleArchived(
	c: Context,
) {
	const id =
		c.req.param("id");

	if (!id) {
		return c.json(
			{
				message: "ID is required",
			},
			400,
		);
	}

	const body =
		await c.req.json<{
			isArchived: boolean;
		}>();

	const userId =
		c.get("userId");

	const data =
		await repo.toggleArchived(
			id,
			body.isArchived,
			userId,
		);

	if (!data) {
		return c.json(
			{
				message: "Note not found",
			},
			404,
		);
	}

	return c.json(data);
}

/* =========================
   SOFT DELETE
========================= */

export async function deleteData(
	c: Context,
) {
	const id =
		c.req.param("id");

	if (!id) {
		return c.json(
			{
				message: "ID is required",
			},
			400,
		);
	}

	const userId =
		c.get("userId");

	const data =
		await repo.remove(
			id,
			userId,
		);

	if (!data) {
		return c.json(
			{
				message: "Note not found",
			},
			404,
		);
	}

	return c.json(data);
}

/* =========================
   RESTORE
========================= */

export async function restoreData(
	c: Context,
) {
	const id =
		c.req.param("id");

	if (!id) {
		return c.json(
			{
				message: "ID is required",
			},
			400,
		);
	}

	const userId =
		c.get("userId");

	const data =
		await repo.restore(
			id,
			userId,
		);

	if (!data) {
		return c.json(
			{
				message: "Note not found",
			},
			404,
		);
	}

	return c.json(data);
}

/* =========================
   DELETE FOREVER
========================= */

export async function deleteDataForever(
	c: Context,
) {
	const id =
		c.req.param("id");

	if (!id) {
		return c.json(
			{
				message: "ID is required",
			},
			400,
		);
	}

	const data =
		await repo.deleteForever(id);

	return c.json(data);
}
import { type Context } from "hono";

import type {
	NewEUrlShortener,
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
   GENERATE SHORT CODE
========================= */

function generateShortCode(
	length = 7,
) {
	const chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	const values =
		crypto.getRandomValues(
			new Uint32Array(length),
		);

	return Array.from(
		values,
		(value) =>
			chars[value % chars.length],
	).join("");
}

/* =========================
   CREATE
========================= */

export async function createData(
	c: Context,
) {
	const body =
		await c.req.json<{
			originalURL: string;
			password?: string | null;
			expireDateUTC?: string | null;
		}>();

	const shortCode =
		generateShortCode();

	const data =
		await repo.create(
			{
				originalURL:
					body.originalURL,

				shortenURL:
					shortCode,

				password:
					body.password ?? null,

				expireDateUTC:
					body.expireDateUTC
						? new Date(
								body.expireDateUTC,
							)
						: null,

				isLocked: false,
			},
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
		await c.req.json<{
			originalURL?: string;
			password?: string | null;
			expireDateUTC?: string | null;
			isLocked?: boolean;
		}>();

	const data =
		await repo.update(
			id,
			{
				originalURL:
					body.originalURL,

				password:
					body.password ?? null,

				expireDateUTC:
					body.expireDateUTC
						? new Date(
								body.expireDateUTC,
							)
						: null,

				isLocked:
					body.isLocked ?? false,
			},
		);

	if (!data) {
		return c.json(
			{
				message:
					"Short URL not found",
			},
			404,
		);
	}

	return c.json(data);
}

/* =========================
   CHANGE LOCK
========================= */

export async function changeLock(
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

	const url =
		await repo.findByID(id);

	if (!url) {
		return c.json(
			{
				message:
					"Short URL not found",
			},
			404,
		);
	}

	const newLockedState =
		!url.isLocked;

	const updated =
		await repo.updateLock(
			id,
			newLockedState,
		);

	return c.json({
		message: newLockedState
			? "Short URL locked"
			: "Short URL unlocked",

		data: updated,
	});
}

/* =========================
   DELETE
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

	const data =
		await repo.remove(
			id,
		);

	if (!data) {
		return c.json(
			{
				message:
					"Short URL not found",
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

	const data =
		await repo.restore(
			id,
		);

	if (!data) {
		return c.json(
			{
				message:
					"Short URL not found",
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
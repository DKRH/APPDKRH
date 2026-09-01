import { type Context } from "hono";

import * as repo from "./repo";

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

export async function createData(
	c: Context,
) {
	const body =
		await c.req.json();

	const userId =
		c.get("userId");

	const data =
		await repo.create(
			body,
			userId,
		);

	return c.json(
		data,
		201,
	);
}

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
		await c.req.json();

	const userId =
		c.get("userId");

	const data =
		await repo.update(
			id,
			body,
			userId,
		);

	if (!data) {
		return c.json(
			{
				message:
					"Character not found",
			},
			404,
		);
	}

	return c.json(data);
}

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
				message:
					"Character not found",
			},
			404,
		);
	}

	return c.json(data);
}

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
				message:
					"Character not found",
			},
			404,
		);
	}

	return c.json(data);
}

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
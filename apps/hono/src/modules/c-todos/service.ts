import type { Context } from "hono";

import type {
	NewCTodos,
} from "@dkrh/types";

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

	const data = await repo.getAll(
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
		await c.req.json<NewCTodos>();

	const data = await repo.create(
		body,
	);

	return c.json(data, 201);
}

export async function editData(
	c: Context,
) {
	const id = c.req.param("id");

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
			Partial<NewCTodos>
		>();

	const data = await repo.update(
		id,
		body,
	);

	if (!data) {
		return c.json(
			{
				message: "Todo not found",
			},
			404,
		);
	}

	return c.json(data);
}

export async function toggleComplete(
	c: Context,
) {
	const id = c.req.param("id");

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
			isComplete: boolean;
		}>();

	const data = await repo.update(
		id,
		{
			isComplete:
				body.isComplete,
		},
	);

	if (!data) {
		return c.json(
			{
				message: "Todo not found",
			},
			404,
		);
	}

	return c.json(data);
}

export async function deleteData(
	c: Context,
) {
	const id = c.req.param("id");

	if (!id) {
		return c.json(
			{
				message: "ID is required",
			},
			400,
		);
	}

	const data = await repo.remove(
		id,
	);

	if (!data) {
		return c.json(
			{
				message: "Todo not found",
			},
			404,
		);
	}

	return c.json(data);
}

export async function restoreData(
	c: Context,
) {
	const id = c.req.param("id");

	if (!id) {
		return c.json(
			{
				message: "ID is required",
			},
			400,
		);
	}

	const data = await repo.restore(
		id,
	);

	if (!data) {
		return c.json(
			{
				message: "Todo not found",
			},
			404,
		);
	}

	return c.json(data);
}

export async function deleteDataForever(
	c: Context,
) {
	const id = c.req.param("id");

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
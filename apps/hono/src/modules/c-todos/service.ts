import { cTodos } from "@dkrh/db/schema";

import * as audit from "@/db/audit";

import { type Context } from "hono";

import type {
	CTodos,
	NewCTodos,
	UpdateCTodos,
} from "@dkrh/types";

const table1 = cTodos;

export async function getAll(c: Context) {
	return await audit.auditedList({
		c,
		table: table1,
		searchableColumns: [
			table1.name,
		],
	});
}

export async function createData(c: Context) {
	const body =
		await c.req.json<NewCTodos>();

	return await audit.auditedInsert(
		c,
		table1,
		{
			name: body.name,
			isComplete:
				body.isComplete ?? false,
		},
	);
}

export async function editData(c: Context) {
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

	return await audit.auditedUpdate(
		c,
		table1,
		table1.id,
		id,
		{
			...(body.name !== undefined
				? {
						name: body.name,
					}
				: {}),

			...(body.isComplete !==
			undefined
				? {
						isComplete:
							body.isComplete,
					}
				: {}),
		},
	);
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

	return await audit.auditedUpdate(
		c,
		table1,
		table1.id,
		id,
		{
			isComplete:
				body.isComplete,
		},
	);
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

	return await audit.auditedDelete(
		c,
		table1,
		table1.id,
		id,
	);
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

	return await audit.auditedRestore(
		c,
		table1,
		table1.id,
		id,
	);
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

	return await audit.auditedDeleteForever(
		c,
		table1,
		table1.id,
		id,
	);
}
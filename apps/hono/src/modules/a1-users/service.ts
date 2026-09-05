import { type Context } from "hono";

import * as repo from "./repo";

import { auth } from "@/lib/auth";
import { hashPassword } from "@/lib/password";

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
	const body = await c.req.json<{
		name: string;
		email: string;
		password: string;
	}>();

	if (!body.name?.trim()) {
		return c.json(
			{
				message: "Name is required",
			},
			400,
		);
	}

	if (!body.email?.trim()) {
		return c.json(
			{
				message: "Email is required",
			},
			400,
		);
	}

	if (!body.password) {
		return c.json(
			{
				message: "Password is required",
			},
			400,
		);
	}

	if (body.password.length < 8) {
		return c.json(
			{
				message:
					"Password must be at least 8 characters",
			},
			400,
		);
	}

	try {
		const user = await auth.api.signUpEmail({
			body: {
				name: body.name.trim(),
				email: body.email.trim(),
				password: body.password,
			},
		});

		return c.json(
			{
				id: user.user.id,
				name: user.user.name,
				email: user.user.email,
			},
			201,
		);
	} catch (error) {
		console.error(
			"Failed to create user:",
			error,
		);

		return c.json(
			{
				message:
					error instanceof Error
						? error.message
						: "Failed to create user",
			},
			400,
		);
	}
}

export async function resetPassword(
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
			password: string;
		}>();

	if (!body.password) {
		return c.json(
			{
				message: "Password is required",
			},
			400,
		);
	}

	if (body.password.length < 8) {
		return c.json(
			{
				message:
					"Password must be at least 8 characters",
			},
			400,
		);
	}

	const account =
		await repo.findCredentialAccount(id);

	if (!account) {
		return c.json(
			{
				message:
					"Credential account not found",
			},
			404,
		);
	}

	const passwordHash = await hashPassword(body.password);

	await repo.updatePassword(
		account.id,
		passwordHash,
	);

	return c.json({
		message:
			"Password reset successfully",
	});
}
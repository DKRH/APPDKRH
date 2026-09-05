import {
	a_user, a_account
} from "@dkrh/db/schema";

import {
	and,
	ilike,
	or,
	desc,
} from "drizzle-orm";

import { db, eq } from "@dkrh/db";

export async function getAll(
	search: string,
	offset: number,
	limit: number,
) {
	const conditions = search
		? or(
			ilike(a_user.name, `%${search}%`),
			ilike(a_user.email, `%${search}%`),
		)
		: undefined;

	return db
		.select({
			id: a_user.id,
			name: a_user.name,
			email: a_user.email,
			emailVerified: a_user.emailVerified,
			createdAt: a_user.createdAt,
		})
		.from(a_user)
		.where(conditions)
		.orderBy(desc(a_user.createdAt))
		.limit(limit)
		.offset(offset);
}

export async function findCredentialAccount(
	userId: string,
) {
	const [account] = await db
		.select({
			id: a_account.id,
			userId: a_account.userId,
		})
		.from(a_account)
		.where(
			and(
				eq(
					a_account.userId,
					userId,
				),
				eq(
					a_account.providerId,
					"credential",
				),
			),
		)
		.limit(1);

	return account;
}

export async function updatePassword(
	accountId: string,
	passwordHash: string,
) {
	const [account] = await db
		.update(a_account)
		.set({
			password: passwordHash,
			updatedAt: new Date(),
		})
		.where(
			eq(a_account.id, accountId),
		)
		.returning({
			id: a_account.id,
			userId: a_account.userId,
		});

	return account;
}
import {
	nGachaBanners,
	nGachaBannerItems,
	nGachaItems,
	nGachaUserPity,
	nGachaUserHistory,
} from "@dkrh/db/schema";

import { db } from "@dkrh/db";

import {
	and,
	eq,
	isNull,
	desc,
} from "@dkrh/db";

const banner = nGachaBanners;
const bannerItem = nGachaBannerItems;
const item = nGachaItems;
const pity = nGachaUserPity;
const history = nGachaUserHistory;

/*
|--------------------------------------------------------------------------
| Banners
|--------------------------------------------------------------------------
*/

export async function getBanners() {
	return db
		.select({
			id: banner.id,
			name: banner.name,
			softPityStart:
				banner.softPityStart,
			hardPityStart:
				banner.hardPityStart,
			uprate5: banner.uprate5,
			uprate4: banner.uprate4,
		})
		.from(banner)
		.where(
			isNull(banner.deletedAt),
		)
		.orderBy(
			desc(banner.createdAt),
		);
}

export async function getBanner(
	id: string,
) {
	const [result] =
		await db
			.select({
				id: banner.id,
				name: banner.name,
				softPityStart:
					banner.softPityStart,
				hardPityStart:
					banner.hardPityStart,
				uprate5:
					banner.uprate5,
				uprate4:
					banner.uprate4,
			})
			.from(banner)
			.where(
				and(
					eq(banner.id, id),
					isNull(banner.deletedAt),
				),
			)
			.limit(1);

	return result;
}

/*
|--------------------------------------------------------------------------
| Banner Items
|--------------------------------------------------------------------------
*/

export async function getBannerItems(
	bannerId: string,
) {
	return db
		.select({
			id: item.id,
			name: item.name,
			rarity: item.rarity,
			imageUrl: item.imageUrl,
			videoUrl: item.videoUrl,
		})
		.from(bannerItem)
		.innerJoin(
			item,
			eq(
				bannerItem.itemId,
				item.id,
			),
		)
		.where(
			and(
				eq(
					bannerItem.bannerId,
					bannerId,
				),
				isNull(
					bannerItem.deletedAt,
				),
				isNull(item.deletedAt),
			),
		);
}

/*
|--------------------------------------------------------------------------
| User Pity
|--------------------------------------------------------------------------
*/

export async function getUserPity(
	userId: string,
) {
	const [result] =
		await db
			.select()
			.from(pity)
			.where(
				and(
					eq(
						pity.userId,
						userId,
					),
					isNull(
						pity.deletedAt,
					),
				),
			)
			.limit(1);

	return result;
}

export async function createUserPity(
	userId: string,
) {
	const [result] =
		await db
			.insert(pity)
			.values({
				userId,
				pity5: 0,
				pity4: 0,
				guarantee5: 0,
			})
			.returning();

	return result;
}

export async function getOrCreateUserPity(
	userId: string,
) {
	const existing =
		await getUserPity(userId);

	if (existing) {
		return existing;
	}

	return createUserPity(userId);
}

export async function updatePity(
	userId: string,
	data: {
		pity5: number;
		pity4: number;
		guarantee5: number;
	},
) {
	const [result] =
		await db
			.update(pity)
			.set({
				pity5: data.pity5,
				pity4: data.pity4,
				guarantee5:
					data.guarantee5,
				updatedAt:
					new Date(),
			})
			.where(
				and(
					eq(
						pity.userId,
						userId,
					),
					isNull(
						pity.deletedAt,
					),
				),
			)
			.returning();

	return result;
}

/*
|--------------------------------------------------------------------------
| Pull History
|--------------------------------------------------------------------------
*/

export async function insertHistoryMany(
	userId: string,
	results: Array<{
		itemId: string;
		name: string | null;
		rarity: number | null;
	}>,
) {
	if (results.length === 0) {
		return [];
	}

	return db
		.insert(history)
		.values(
			results.map((result) => ({
				userId,
				itemId:
					result.itemId,
				name:
					result.name,
				rarity:
					result.rarity,
				obtainedAt:
					new Date(),
			})),
		)
		.returning();
}

export async function getUserHistory(
	userId: string,
	limit = 50,
	offset = 0,
) {
	return db
		.select()
		.from(history)
		.where(
			and(
				eq(
					history.userId,
					userId,
				),
				isNull(
					history.deletedAt,
				),
			),
		)
		.orderBy(
			desc(history.obtainedAt),
		)
		.limit(limit)
		.offset(offset);
}
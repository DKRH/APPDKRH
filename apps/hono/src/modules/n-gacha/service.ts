import { type Context } from "hono";

import * as repo from "./repo";

type GachaItem = {
	id: string;
	name: string | null;
	rarity: number | null;
	imageUrl: string | null;
	videoUrl: string | null;
};

function randomInt(
	min: number,
	max: number,
) {
	return Math.floor(
		Math.random() *
			(max - min + 1),
	) + min;
}

/*
|--------------------------------------------------------------------------
| Pick random item by rarity
|--------------------------------------------------------------------------
*/

function pickItem(
	items: GachaItem[],
	rarity: number,
) {
	const candidates =
		items.filter(
			(item) =>
				item.rarity === rarity,
		);

	if (
		candidates.length === 0
	) {
		return null;
	}

	return candidates[
		randomInt(
			0,
			candidates.length - 1,
		)
	];
}

/*
|--------------------------------------------------------------------------
| Pull one item
|--------------------------------------------------------------------------
*/
function rollItem(
	itemAll: GachaItem[],
	itemInBanner: GachaItem[],
	pity5: number,
	pity4: number,
	guarantee5: number,
	banner: {
		softPityStart: number | null;
		hardPityStart: number | null;
		uprate5: number | null;
		uprate4: number | null;
	},
) {
	let nextPity5 = pity5 + 1;
	let nextPity4 = pity4 + 1;
	let nextGuarantee5 = guarantee5;

	const hard4 = 10;
	const hard5 = banner.hardPityStart ?? 90;
	const soft5 = banner.softPityStart ?? 75;

	let rarity = 3;
	let result: GachaItem;

	// ----------------------------------------
	// 5★ chance
	// ----------------------------------------

	let chance5 = banner.uprate5 ?? 0.6;

	if (nextPity5 >= soft5) {
		const extra = (nextPity5 - soft5) * 5;
		chance5 = Math.min(100, chance5 + extra);
	}

	const roll5 = Math.random() * 100;

	// ----------------------------------------
	// 4★ chance
	// ----------------------------------------

	const chance4 = banner.uprate4 ?? 5;
	const roll4 = Math.random() * 100;

	// ----------------------------------------
	// Prevent 4★ and 5★ hard pity overlap
	//
	// If both would be guaranteed on this pull,
	// resolve the 4★ one pull earlier.
	// ----------------------------------------

	const fiveStarHardPity = nextPity5 >= hard5;
	const fourStarHardPity = nextPity4 >= hard4;

	const fourStarEarlySafety =
		nextPity4 === hard4 - 1 &&
		nextPity5 === hard5;

	const bannerItemIds = new Set(
		itemInBanner.map((item) => item.id),
	);

	const itemOffBanner = itemAll.filter(
		(item) => !bannerItemIds.has(item.id),
	);
	let is_featured = "";
	// ----------------------------------------
	// 5★
	// ----------------------------------------

	if (roll5 < chance5 || fiveStarHardPity) {
		rarity = 5;

		nextPity5 = 0;

		const percentageWinGuarantee5 = Math.random() < 0.5;

		result = pickItem(itemOffBanner, 5);

		// Lose 50/50
		nextGuarantee5 = 1;

		// Win 50/50 or guaranteed featured
		if (
			percentageWinGuarantee5 ||
			guarantee5 === 1
		) {
			result = pickItem(itemInBanner, 5);
			nextGuarantee5 = 0;
			is_featured = "FEATURED";
		}
	}

	// ----------------------------------------
	// 4★
	// ----------------------------------------

	else if (
		roll4 < chance4 ||
		fourStarHardPity ||
		fourStarEarlySafety
	) {
		rarity = 4;

		nextPity4 = 0;

		const percentageWin4 =
			Math.random() < 0.75;

		result = pickItem(itemOffBanner, 4);

		if (percentageWin4) {
			result = pickItem(itemInBanner, 4);
			is_featured = "FEATURED";
		}
	}

	// ----------------------------------------
	// 3★ fallback
	// ----------------------------------------

	else {
		rarity = 3;

		result = pickItem(itemOffBanner, 3);
	}

	return {
		item: result,
		rarity,
		is_featured,
		pity5: nextPity5,
		pity4: nextPity4,
		guarantee5: nextGuarantee5,
	};
}

/*
|--------------------------------------------------------------------------
| Pull
|--------------------------------------------------------------------------
*/

export async function pull(
	c: Context,
) {
	const bannerId =
		c.req.param("id");

	if (!bannerId) {
		return c.json(
			{
				message:
					"Banner ID is required",
			},
			400,
		);
	}

	const body =
		await c.req.json<{
			count?: number;
		}>();

	const count =
		Number(body.count ?? 1);

	if (
		count !== 1 &&
		count !== 10
	) {
		return c.json(
			{
				message:
					"Count must be 1 or 10",
			},
			400,
		);
	}

	const banner =
		await repo.getBanner(
			bannerId,
		);

	if (!banner) {
		return c.json(
			{
				message:
					"Banner not found",
			},
			404,
		);
	}

	const itemInBanner = await repo.getBannerItems(
			bannerId,
		);
	const itemAll = await repo.getItems();

	if (itemInBanner.length === 0) {
		return c.json(
			{
				message:
					"Banner has no items",
			},
			400,
		);
	}

	const currentPity =
		await repo.getOrCreateUserPity();

	let pity5 =
		currentPity.pity5 ?? 0;

	let pity4 =
		currentPity.pity4 ?? 0;

	let guarantee5 =
		currentPity.guarantee5 ?? 0;

	const results: Array<{
		id: string;
		name: string | null;
		rarity: number | null;
		imageUrl: string | null;
		videoUrl: string | null;
		is_featured: string | null;
	}> = [];

	for (
		let i = 0;
		i < count;
		i++
	) {
		const result =
			rollItem(
				itemAll,
				itemInBanner,
				pity5,
				pity4,
				guarantee5,
				banner,
			);

		pity5 =
			result.pity5;

		pity4 =
			result.pity4;

		guarantee5 =
			result.guarantee5;

		results.push({
			...result.item,
			rarity: result.rarity,
			is_featured: result.is_featured,
		});
	}

	await repo.updatePity(
		{
			pity5,
			pity4,
			guarantee5,
		},
	);

	await repo.insertHistoryMany(
		results.map(
			(result) => ({
				itemId: result.id,
				name: result.name,
				rarity: result.rarity,
			}),
		),
	);

	return c.json({
		results,

		pity: {
			pity5,
			pity4,
			guarantee5,
		},

		banner: {
			soft:
				banner.softPityStart,
			hard:
				banner.hardPityStart,
		},
	});
}

export async function getBanners(
	c: Context,
) {
	const data =
		await repo.getBanners();

	return c.json(data);
}

export async function getBanner(
	c: Context,
) {
	const id =
		c.req.param("id");

	if (!id) {
		return c.json(
			{
				message:
					"Banner ID is required",
			},
			400,
		);
	}

	const banner =
		await repo.getBanner(id);

	if (!banner) {
		return c.json(
			{
				message:
					"Banner not found",
			},
			404,
		);
	}

	const items =
		await repo.getBannerItems(id);

	return c.json({
		...banner,
		items,
	});
}

export async function getPity(
	c: Context,
) {
	const bannerId = c.req.param("id");

	if (!bannerId) {
		return c.json(
			{
				message:
					"Banner ID is required",
			},
			400,
		);
	}

	const bannerItems = await repo.getBannerItems( bannerId );
	const banner = await repo.getBanner( bannerId );
	const pity = await repo.getOrCreateUserPity();

	return c.json({
		pity: {
			pity5: pity.pity5 ?? 0,
			pity4: pity.pity4 ?? 0,
			guarantee5: pity.guarantee5 ?? 0,
		},
		banner: {
			soft: banner.softPityStart,
			hard: banner.hardPityStart,
		},
		item: bannerItems
	});
}

export async function getHistory(
	c: Context,
) {
	const limit = Math.min(
		Number(
			c.req.query("limit") ?? 50,
		),
		100,
	);

	const offset = Math.max(
		Number(
			c.req.query("offset") ?? 0,
		),
		0,
	);

	const data =
		await repo.getUserHistory(
			limit,
			offset,
		);

	return c.json(data);
}
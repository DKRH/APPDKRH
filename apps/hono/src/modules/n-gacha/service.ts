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
	items: GachaItem[],
	pity5: number,
	pity4: number,
	guarantee5: number,
	banner: {
		softPityStart:
			number | null;
		hardPityStart:
			number | null;
		uprate5:
			number | null;
		uprate4:
			number | null;
	},
) {
	const nextPity5 =
		pity5 + 1;

	const nextPity4 =
		pity4 + 1;

	const hard =
		banner.hardPityStart ?? 90;

	const soft =
		banner.softPityStart ?? 75;

	/*
	 * Guaranteed 5★
	 */
	if (nextPity5 >= hard) {
		const result =
			pickItem(items, 5);

		if (result) {
			return {
				item: result,
				rarity: 5,
				pity5: 0,
				pity4: 0,
				guarantee5: 0,
			};
		}
	}

	/*
	 * Soft pity
	 *
	 * This example increases
	 * the chance of 5★ once
	 * soft pity starts.
	 */
	let chance5 = 0.6;

	if (nextPity5 >= soft) {
		const extra =
			(nextPity5 - soft) * 5;

		chance5 =
			Math.min(
				100,
				chance5 + extra,
			);
	}

	/*
	 * Guaranteed featured 5★
	 */
	if (guarantee5 === 1) {
		const result =
			pickItem(items, 5);

		if (result) {
			return {
				item: result,
				rarity: 5,
				pity5: 0,
				pity4: 0,
				guarantee5: 0,
			};
		}
	}

	const roll =
		Math.random() * 100;

	/*
	 * 5★
	 */
	if (roll < chance5) {
		const result =
			pickItem(items, 5);

		if (result) {
			/*
			 * This implementation treats
			 * all 5★ banner items equally.
			 */
			return {
				item: result,
				rarity: 5,
				pity5: 0,
				pity4: 0,
				guarantee5: 0,
			};
		}
	}

	/*
	 * 4★
	 */
	const chance4 =
		banner.uprate4 ?? 5;

	if (
		roll <
		chance5 + chance4
	) {
		const result =
			pickItem(items, 4);

		if (result) {
			return {
				item: result,
				rarity: 4,
				pity5: nextPity5,
				pity4: 0,
				guarantee5,
			};
		}
	}

	/*
	 * 3★ fallback
	 */
	const result =
		pickItem(items, 3);

	if (!result) {
		/*
		 * If the banner has no 3★
		 * items, use any item.
		 */
		const fallback =
			items[
				randomInt(
					0,
					items.length - 1,
				)
			];

		return {
			item: fallback,
			rarity:
				fallback.rarity ?? 3,
			pity5: nextPity5,
			pity4: nextPity4,
			guarantee5,
		};
	}

	return {
		item: result,
		rarity: 3,
		pity5: nextPity5,
		pity4: nextPity4,
		guarantee5,
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

	const items =
		await repo.getBannerItems(
			bannerId,
		);

	if (items.length === 0) {
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
	}> = [];

	for (
		let i = 0;
		i < count;
		i++
	) {
		const result =
			rollItem(
				items,
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
			rarity:
				result.rarity,
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
	const pity =
		await repo.getOrCreateUserPity();

	return c.json({
		pity5:
			pity.pity5 ?? 0,

		pity4:
			pity.pity4 ?? 0,

		guarantee5:
			pity.guarantee5 ?? 0,
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
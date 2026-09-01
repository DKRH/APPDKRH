import { db } from "@dkrh/db";
import {
	nGachaBanners,
	nGachaBannerItems,
	nGachaItems,
} from "@dkrh/db/schema";

const items = [
	// 5★
	{
		name: "Astral Blade",
		rarity: 5,
		imageUrl: "/gacha/items/astral-blade.webp",
		videoUrl: null,
	},
	{
		name: "Celestial Staff",
		rarity: 5,
		imageUrl: "/gacha/items/celestial-staff.webp",
		videoUrl: null,
	},

	// 4★
	{
		name: "Moonlight Bow",
		rarity: 4,
		imageUrl: "/gacha/items/moonlight-bow.webp",
		videoUrl: null,
	},
	{
		name: "Crimson Sword",
		rarity: 4,
		imageUrl: "/gacha/items/crimson-sword.webp",
		videoUrl: null,
	},
	{
		name: "Azure Tome",
		rarity: 4,
		imageUrl: "/gacha/items/azure-tome.webp",
		videoUrl: null,
	},

	// 3★
	{
		name: "Iron Sword",
		rarity: 3,
		imageUrl: "/gacha/items/iron-sword.webp",
		videoUrl: null,
	},
	{
		name: "Wooden Bow",
		rarity: 3,
		imageUrl: "/gacha/items/wooden-bow.webp",
		videoUrl: null,
	},
	{
		name: "Apprentice Tome",
		rarity: 3,
		imageUrl: "/gacha/items/apprentice-tome.webp",
		videoUrl: null,
	},
];

const banners = [
	{
		name: "Celestial Dreams",
		softPityStart: 75,
		hardPityStart: 90,
		uprate5: 50,
		uprate4: 50,
	},
];

async function seed() {
	console.log("Seeding Gacha...");

	/*
	|--------------------------------------------------------------------------
	| Items
	|--------------------------------------------------------------------------
	*/

	const insertedItems =
		await db
			.insert(nGachaItems)
			.values(items)
			.returning();

	console.log(
		`Inserted ${insertedItems.length} items`,
	);

	/*
	|--------------------------------------------------------------------------
	| Banners
	|--------------------------------------------------------------------------
	*/

	const insertedBanners =
		await db
			.insert(nGachaBanners)
			.values(banners)
			.returning();

	console.log(
		`Inserted ${insertedBanners.length} banners`,
	);

	const banner =
		insertedBanners[0];

	if (!banner) {
		throw new Error(
			"Banner was not inserted",
		);
	}

	/*
	|--------------------------------------------------------------------------
	| Banner Items
	|--------------------------------------------------------------------------
	*/

	await db
		.insert(nGachaBannerItems)
		.values(
			insertedItems.map(
				(item) => ({
					bannerId: banner.id,
					itemId: item.id,
				}),
			),
		);

	console.log(
		`Linked ${insertedItems.length} items to banner`,
	);

	console.log(
		"Gacha seeding complete.",
	);
}

seed()
	.catch((error) => {
		console.error(
			"Gacha seeding failed:",
			error,
		);

		process.exit(1);
	});
import { faker } from "@faker-js/faker";

import { db } from "../index";

import {
	b_passbank,
} from "../schema";

async function seedPassbank() {

	const rows =
		Array.from(
			{ length: 200 },
			(_, index) => {

				const createdAt =
					faker.date.past({
						years: 2,
					});

				return {

					title:
						`${faker.company.name()} Account ${index + 1}`,

					username:
						faker.internet.username(),

					password:
						faker.internet.password({
							length: 12,
						}),

					note:
						faker.lorem.sentence(),

					createdAt,

					updatedAt:
						createdAt,

					deletedAt:
						null,

					createdBy:
						null,

					updatedBy:
						null,

					deletedBy:
						null,

				};

			}
		);

	await db
		.insert(
			b_passbank
		)
		.values(
			rows
		);

	console.log(
		"Inserted 200 fake passbank rows"
	);

	process.exit(0);

}

seedPassbank()
	.catch(
		(error) => {

			console.error(
				error
			);

			process.exit(1);

		}
	);
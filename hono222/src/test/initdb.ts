import { auth } from "@/lib/auth"; // your better-auth instance
import { loadEnv } from "@/lib/env";

loadEnv();

async function seed() {
	const email =
		process.env.ADMIN_EMAIL ??
		"admin@example.com";

	try {

		await auth.api.signUpEmail({
			body: {
				name:
					process.env.ADMIN_NAME ??
					"Administrator",

				email,

				password:
					process.env.ADMIN_PASSWORD ??
					"ChangeMe123!",
			},
		});

		console.log(
			`Admin '${email}' created.`
		);

	}
	catch (err: any) {

		// User already exists
		if (
			err?.message?.includes("exists") ||
			err?.message?.includes("already")
		) {

			console.log(
				"Admin already exists."
			);

			return;
		}

		throw err;
	}
}

seed()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
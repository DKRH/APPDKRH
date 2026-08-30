import {
	redirect,
	type Handle,
} from "@sveltejs/kit";
import { getAPIURL } from "$lib/api";
export const handle:
	Handle =
	async ({
		event,
		resolve,
	}) => {

		const pathname = event.url.pathname;

		const publicRoutes = [
			"/auth/login",
			"/auth/register",
		];

		const isPublic =
			publicRoutes.some(
				(route) =>
					pathname.startsWith(
						route
					)
			);

		/*
		|--------------------------------------------------------------------------
		| Allow auth pages
		|--------------------------------------------------------------------------
		*/

		if (isPublic) {
			return resolve(event);
		}

		/*
		|--------------------------------------------------------------------------
		| Check authentication
		|--------------------------------------------------------------------------
		*/

		const response =
			await event.fetch(
				getAPIURL("/api/auth/get-session")
			);

		if (!response.ok) {
			throw redirect(
				303,
				"/auth/login"
			);
		}

		const session =
			await response.json();

		if (!session?.user) {
			throw redirect(
				303,
				"/auth/login"
			);
		}

		event.locals.user =
			session.user;

		return resolve(event);
	};
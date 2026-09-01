import { createAuthClient } from "better-auth/svelte";

const API_URL = "";

export async function apiFetch(
	path: string,
	options: RequestInit = {},
) {
	const headers = new Headers(options.headers);

	if (
		options.body &&
		!headers.has("Content-Type") &&
		!(options.body instanceof FormData)
	) {
		headers.set(
			"Content-Type",
			"application/json",
		);
	}

	const response = await fetch(
		`${API_URL}${path}`,
		{
			credentials: "include",
			headers,
			...options,
		},
	);

	if (!response.ok) {
		const data =
			await response
				.json()
				.catch(() => null);

		throw new Error(
			data?.message ??
			"Request failed",
		);
	}

	return response;
}

export function getAPIURL(
	path: string = "",
) {
	return `${API_URL}${path}`;
}

export const authClient =
	createAuthClient({
		fetchOptions: {
			credentials: "include",
		},
	});
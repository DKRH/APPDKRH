/*import { hc } from "hono/client";
import type { AppType } from "@dkrh/hono/types";

export const api = hc<AppType>(
  "http://localhost:2601/api",
  {
    init: {
      credentials: "include",
    },
  },
);*/

import { createAuthClient } from "better-auth/svelte";
const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:2601";

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
    headers.set("Content-Type", "application/json");
  }

  /*return fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });*/

  const response = await fetch(
		`${API_URL}${path}`,
		{
			credentials: "include",
      headers,
			...options,
		}
	);

	if (!response.ok) {
		const data =
			await response
				.json()
				.catch(() => null);

		throw new Error(
			data?.message ??
			"Request failed"
		);
	}

	return response;
}

export function getAPIURL( path: string = "", ) {
	return `${API_URL}${path}`;
}

export const authClient =
	createAuthClient({
		baseURL: API_URL,

		fetchOptions: {
			credentials:
				"include",
		},
	});
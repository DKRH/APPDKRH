import { apiFetch } from "$lib/api";

import type {
	GachaBanner,
	PullResponse,
} from "$lib/components/gacha/gacha.type";

export async function getGachaBanners(): Promise<
	GachaBanner[]
> {
	const response = await apiFetch(
		"/api/n-gacha/banners",
	);

	return response.json();
}

export async function getGachaBanner(
	id: string,
): Promise<GachaBanner> {
	const response = await apiFetch(
		`/api/n-gacha/banners/${id}`,
	);

	return response.json();
}

export async function doGachaPull(
	bannerId: string,
	count: number,
): Promise<PullResponse> {
	const response = await apiFetch(
		`/api/n-gacha/banners/${bannerId}/pull`,
		{
			method: "POST",
			body: JSON.stringify({
				bannerId,
				count,
			}),
		},
	);

	return response.json();
}
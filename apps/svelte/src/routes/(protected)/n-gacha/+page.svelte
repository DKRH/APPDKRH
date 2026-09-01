<script lang="ts">
	import { onMount } from "svelte";
	import BannerCard from "$lib/components/gacha/BannerCard.svelte";
	import {
		getGachaBanners,
	} from "$lib/api/gacha";

	import type {
		GachaBanner,
	} from "$lib/components/gacha/gacha.type";

	let banners = $state<GachaBanner[]>([]);
	let loading = $state(true);
	let error = $state("");

	onMount(async () => {
		try {
			banners =
				await getGachaBanners();
		} catch (err) {
			error =
				err instanceof Error
					? err.message
					: "Failed to load banners";
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Gacha</title>
</svelte:head>

<div class="gacha-page">
	<h1>Gacha</h1>

	{#if loading}
		<p>Loading banners...</p>

	{:else if error}
		<p class="error">
			{error}
		</p>

	{:else if banners.length === 0}
		<p>
			No banners available.
		</p>

	{:else}
		<div class="grid">
			{#each banners as banner (banner.id)}
				<BannerCard {banner} />
			{/each}
		</div>
	{/if}
</div>
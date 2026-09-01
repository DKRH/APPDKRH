<script lang="ts">
	import "$lib/components/gacha/style.css";
	import {
		doGachaPull,
	} from "$lib/api/gacha";

	import PityMeter from "$lib/components/gacha/PityMeter.svelte";
	import PullResult from "$lib/components/gacha/PullResult.svelte";

	import type {
		GachaItem,
	} from "$lib/components/gacha/gacha.type";

	import { page } from "$app/state";

	const bannerId = $derived(
		page.params.id,
	);
    
	let rolling = $state(false);

	let results =
		$state<GachaItem[]>([]);

	let pity = $state(0);

	let soft = $state(75);

	let hard = $state(90);

	let guarantee5 = $state(0);

	let showSky = $state(false);

	async function doPullAction(
		count = 1,
	) {
		if (rolling) {
			return;
		}
		if (!bannerId) {
			console.error("Banner ID is missing");
			return;
		}

		rolling = true;

		try {
			const response =
				await doGachaPull(
					bannerId,
					count,
				);

			results =
				response.results;

			pity =
				response.pity.pity5;

			soft =
				response.banner.soft;

			hard =
				response.banner.hard;

			guarantee5 =
				response.pity.guarantee5;

			if (
				response.results.some(
					(item) =>
						item.rarity === 5,
				)
			) {
				showSky = true;

				setTimeout(() => {
					showSky = false;
				}, 700);
			}
		} catch (err) {
			console.error(
				"Gacha pull failed:",
				err,
			);
		} finally {
			rolling = false;
		}
	}
</script>

<svelte:head>
	<title>Gacha Pull</title>
</svelte:head>

<div
	class="gacha-stage"
	class:shake={showSky}
>
	<PityMeter
		current={pity}
		soft={soft}
		hard={hard}
		guarantee5={guarantee5}
	/>

	<div class="actions">
		<button
			disabled={rolling}
			onclick={() =>
				doPullAction(1)}
		>
			Summon
		</button>

		<button
			disabled={rolling}
			onclick={() =>
				doPullAction(10)}
		>
			Summon ×10
		</button>
	</div>

	{#if rolling}
		<div class="orb"></div>
	{/if}

	<PullResult {results} />

	{#if showSky}
		<div class="flash-overlay"></div>
		<div class="crack"></div>
	{/if}
</div>
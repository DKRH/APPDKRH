<script lang="ts">
	import RarityGlow from "./RarityGlow.svelte";
	import type { GachaItem } from "./gacha.type";

	let {
		results = [],
	}: {
		results?: GachaItem[];
	} = $props();
</script>

{#if results.length}
	<div class="results">
		{#each results as result, i (i)}
			<RarityGlow rarity={result.rarity}>
				<div class={`card r${result.rarity}`}>
					<h3>
						{result.name}
					</h3>

					<small>
						{result.rarity}★
					</small>

					{#if result.is_featured === "FEATURED"}
						<div class="featured-badge">
							FEATURED
						</div>
					{/if}
				</div>
			</RarityGlow>
		{/each}
	</div>
{/if}
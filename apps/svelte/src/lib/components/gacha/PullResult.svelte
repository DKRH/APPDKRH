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

					<div class="featured-badge">
						{#if result.is_featured === "FEATURED"}
							FEATURED
						{:else}
							&nbsp;
						{/if}
					</div>
				</div>
			</RarityGlow>
		{/each}
	</div>
{/if}

<style>
.results {
	margin-top: 35px;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
	gap: 16px;
}
@keyframes reveal {
	to {
		opacity: 1;
		transform: scale(1);
	}
}
.card {
    padding: 16px;
    border-radius: 16px;

    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);

    border: 1px solid rgba(255, 255, 255, 0.18);

    transition:
        transform 0.25s ease,
        box-shadow 0.25s ease,
        background 0.25s ease;

    opacity: 0;
    transform: scale(0.8);

    animation: reveal 0.4s ease forwards;
}

.card:hover {
    transform: translateY(-6px) scale(1.02);

    background: rgba(255, 255, 255, 0.13);

    box-shadow:
        0 12px 35px rgba(0, 0, 0, 0.3),
        0 0 20px rgba(120, 150, 255, 0.15);
}
</style>
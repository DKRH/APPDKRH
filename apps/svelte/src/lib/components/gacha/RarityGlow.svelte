<script lang="ts">
	let {
		rarity,
		children,
	}: {
		rarity: number;
		children: import("svelte").Snippet;
	} = $props();
</script>

<div class={`glow glow-r${rarity}`}>
	{@render children()}
</div>
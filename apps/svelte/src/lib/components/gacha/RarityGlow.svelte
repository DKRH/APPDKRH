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

<style>

@keyframes divinePulse {
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.06);
	}
	100% {
		transform: scale(1);
	}
}
.glow-r5 {
	box-shadow: 0 0 60px 10px gold;
	animation: divinePulse 1.2s infinite;
}
.glow-r4 {
	box-shadow: 0 0 30px 5px #a55cff;
}
.glow-r3 {
	box-shadow: 0 0 10px 2px #4aa3ff;
}
</style>
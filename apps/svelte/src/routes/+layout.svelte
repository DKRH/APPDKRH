<script lang="ts">
	import "./layout.css";
	import { navigating } from "$app/state";
	
	let { children } = $props();
    
</script>

{#if navigating.to}
	<div
		class="
			fixed
			inset-0
			z-[9999]
			flex
			items-center
			justify-center
			bg-zinc-950/80
			backdrop-blur-sm
		"
	>
		<div
			class="
				h-10
				w-10
				animate-spin
				rounded-full
				border-4
				border-zinc-700
				border-t-emerald-400
			"
		></div>
	</div>
{/if}
<div>
{@render children()}
</div>
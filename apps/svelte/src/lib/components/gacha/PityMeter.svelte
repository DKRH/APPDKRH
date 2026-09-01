<script lang="ts">
	let {
		current,
		hard = 90,
		soft = 70,
		guarantee5 = 0,
	}: {
		current: number;
		hard?: number;
		soft?: number;
		guarantee5?: number;
	} = $props();

	let pct = $derived(
		Math.min((current / hard) * 100, 100),
	);
</script>

<div class="pity-shell">
	<div
		class="pity-bar"
		style={`width: ${pct}%`}
	></div>

	<div class="pity-text">
		{current}/{hard} pulls

		{#if current >= soft}
			<span class="soft">
				Soft Pity
			</span>
		{/if}

		<div class="guarantee">
			Next 5★ Guaranteed Featured:

			{guarantee5
				? "YES"
				: "NO"}
		</div>
	</div>
</div>
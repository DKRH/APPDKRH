<script lang="ts">
	let { children } = $props();
</script>

<div class="flex h-full flex-col">

	<div class=" flex items-center justify-between border-b border-zinc-200 p-3 mb-3">
		<div class="flex gap-2">
			<a
				href="/n-gacha"
				class="border border-zinc-300 px-3 py-1 text-sm hover:bg-indigo-300">
				Pull
			</a>

			<a
				href="/n-gacha/banners"
				class="border border-zinc-300 px-3 py-1 text-sm hover:bg-indigo-300">
				Banners Edit
			</a>
			<a
				href="/n-gacha/items"
				class="border border-zinc-300 px-3 py-1 text-sm hover:bg-indigo-300">
				Items Edit
			</a>

		</div>

	</div>

	<div class="flex-1 min-h-0">

		{@render children()}

	</div>

</div>
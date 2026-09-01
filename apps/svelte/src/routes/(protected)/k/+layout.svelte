<script lang="ts">
	let { children } = $props();
</script>

<div class="flex h-full flex-col">

	<div
		class="
			flex
			items-center
			justify-between
			border-b
			border-zinc-200
			p-3
            mb-3
		"
	>

		<div class="flex gap-2">

			<a
				href="/k/char"

				class="
					border
					border-zinc-300
					px-3
					py-1
					text-sm
                    hover:bg-indigo-300
				"
			>
				Chars
			</a>

			<a
				href="/k/universe"

				class="
					border
					border-zinc-300
					px-3
					py-1
					text-sm
                    hover:bg-indigo-300
				"
			>
				Universes
			</a>
			<a
				href="/k/attribute"
				class="border border-zinc-300 px-3 py-1 text-sm hover:bg-indigo-300">
				Attributes
			</a>

		</div>

	</div>

	<div class="flex-1 min-h-0">

		{@render children()}

	</div>

</div>
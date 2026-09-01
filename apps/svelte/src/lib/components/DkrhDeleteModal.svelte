<script lang="ts">
	let {
		title,

		message,

		onCancel,

		onConfirm,
	}: {
		title: string;

		message: string;

		onCancel: () => void;

		onConfirm: () => void;
	} = $props();
</script>
```svelte
<div
	class="
		fixed
		inset-0
		z-50
		flex
		items-center
		justify-center
		bg-black/70
		p-4
		backdrop-blur-sm
	"
>
	<div
		class="
			w-full
			max-w-md
			rounded-2xl
			border
			border-zinc-800
			bg-zinc-900
			p-6
			text-zinc-100
			shadow-2xl
			shadow-black/50
		"
	>

		<!-- Warning Icon -->
		<div
			class="
				mb-4
				flex
				h-11
				w-11
				items-center
				justify-center
				rounded-xl
				border
				border-red-500/20
				bg-red-500/10
				text-red-400
			"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				class="h-5 w-5"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 9v4m0 4h.01M10.29 3.86 2.82 17a2 2 0 0 0 1.74 3h14.88a2 2 0 0 0 1.74-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
				/>
			</svg>
		</div>

		<!-- Title -->
		<h2
			class="
				text-xl
				font-semibold
				tracking-tight
				text-white
			"
		>
			{title}
		</h2>

		<!-- Message -->
		<p
			class="
				mt-2
				text-sm
				leading-6
				text-zinc-400
			"
		>
			Are you sure you want to delete
			<span class="font-medium text-zinc-200">
				{message}
			</span>
			?
		</p>

		<p
			class="
				mt-2
				text-xs
				text-zinc-600
			"
		>
			This action cannot be undone.
		</p>

		<!-- Actions -->
		<div
			class="
				mt-6
				flex
				gap-2
			"
		>

			<button
				type="button"
				onclick={onCancel}
				class="
					flex-1
					rounded-lg
					border
					border-zinc-700
					bg-zinc-800
					px-3
					py-2.5
					text-sm
					font-medium
					text-zinc-300
					transition
					hover:border-zinc-600
					hover:bg-zinc-700
					hover:text-white
					active:scale-[0.98]
				"
			>
				Cancel
			</button>

			<button
				type="button"
				onclick={onConfirm}
				class="
					flex-1
					rounded-lg
					bg-red-500
					px-3
					py-2.5
					text-sm
					font-semibold
					text-white
					transition-all
					hover:bg-red-400
					hover:shadow-lg
					hover:shadow-red-500/10
					active:scale-[0.98]
				"
			>
				Delete
			</button>

		</div>

	</div>
</div>
```

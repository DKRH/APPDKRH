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

<div
	class="
		fixed
		inset-0
		z-50
		bg-black/70
		flex
		items-center
		justify-center
		p-4
	"
>
	<div
		class="
			bg-zinc-900
			border
			border-zinc-700
			rounded-lg
			w-full
			max-w-md
			p-6
		"
	>
		<h2
			class="
				text-xl
				font-bold
				mb-3
			"
		>
			{title}
		</h2>

		<p
			class="
				text-zinc-300
			"
		>
			Are you sure you want to delete
			{message}
		</p>

		<div
			class="
				flex
				justify-end
				gap-2
				mt-6
			"
		>
			<button
				onclick={onCancel}

				class="
					bg-zinc-700
					px-4
					py-2
					rounded
				"
			>
				Cancel
			</button>

			<button
				onclick={onConfirm}

				class="
					bg-red-700
					hover:bg-red-600
					px-4
					py-2
					rounded
				"
			>
				Delete
			</button>
		</div>
	</div>
</div>
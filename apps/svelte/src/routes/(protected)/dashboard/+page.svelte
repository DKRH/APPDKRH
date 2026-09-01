<script lang="ts">
	import {
		Film,
		KeyRound,
		NotebookPen,
		Link,
		FileText,
	} from "lucide-svelte";

	export const appPages = [
		{
			name: "PassBank",
			icon: KeyRound,
			to: "/b-passbank",
		},
		{
			name: "To-Do",
			icon: NotebookPen,
			to: "/c-todo",
		},
		{
			name: "Note",
			icon: NotebookPen,
			to: "/d-note",
		},
		{
			name: "URL Shortener",
			icon: Link,
			to: "/e-url-shortener",
		},
		{
			name: "Text Storage",
			icon: FileText,
			to: "/f-text-storage",
		},
		{
			name: "Entertainment Tracker",
			icon: Film,
			to: "/h-entertainment",
		},
		{
			name: "Char",
			icon: KeyRound,
			to: "/k/char",
		},

	];
</script>

<div
	class="
		h-full
		flex
		flex-col
		overflow-hidden
		text-black
	"
>

	<h1
		class="
			mb-8
			text-3xl
			font-bold
		"
	>
		Dashboard
	</h1>

	<div
		class="
			flex-1
			min-h-0
			overflow-auto
			p-6
		"
	>

		<div
			class="
				grid
				grid-cols-2
				gap-4
				sm:grid-cols-6
				lg:grid-cols-6
			"
		>

			{#each appPages as page}

				<a
					href={page.to}

					class="
						group
						aspect-square
						rounded-xl
						border
						border-zinc-800
						hover:bg-emerald-300
						hover:border-blue-500
						transition
						flex
						flex-col
						items-center
						justify-center
						gap-4
					"
				>

					<page.icon
						size={40}

						class="
							
							group-hover:scale-110
							transition
						"
					/>

					<span
						class="
							text-center
							text-sm
							font-medium
						"
					>
						{page.name}
					</span>

				</a>

			{/each}

		</div>

	</div>

</div>
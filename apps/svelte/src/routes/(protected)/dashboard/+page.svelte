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
		{
			name: "Gacha",
			icon: KeyRound,
			to: "/n-gacha",
		},
	];
</script>

<svelte:head>
	<title>DKRH | Dashboard</title>
</svelte:head>

<div class="min-h-full text-zinc-100">

	<!-- Header -->
	<div class="mb-8">
		<div class="flex items-center gap-3">

			<div
				class="flex h-10 w-10 items-center
				justify-center rounded-xl
				border border-teal-500/20
				bg-teal-500/10"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="h-5 w-5 text-teal-400"
				>
					<rect
						width="7"
						height="7"
						x="3"
						y="3"
						rx="1"
					/>
					<rect
						width="7"
						height="7"
						x="14"
						y="3"
						rx="1"
					/>
					<rect
						width="7"
						height="7"
						x="3"
						y="14"
						rx="1"
					/>
					<rect
						width="7"
						height="7"
						x="14"
						y="14"
						rx="1"
					/>
				</svg>
			</div>

			<div>
				<h1
					class="text-2xl font-semibold
					tracking-tight text-white"
				>
					Dashboard
				</h1>

				<p class="mt-0.5 text-sm text-zinc-500">
					Select an application to continue
				</p>
			</div>

		</div>
	</div>

	<!-- Applications -->
	<div
		class="grid grid-cols-2 gap-4
		sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
	>

		{#each appPages as page}

			<a
				href={page.to}
				class="
					group relative
					aspect-square
					overflow-hidden
					rounded-2xl
					border border-zinc-800
					bg-zinc-900/70
					p-5
					transition-all duration-200

					hover:-translate-y-1
					hover:border-teal-500/40
					hover:bg-zinc-900
					hover:shadow-xl
					hover:shadow-black/30

					active:translate-y-0
				"
			>

				<!-- Hover glow -->
				<div
					class="
						pointer-events-none
						absolute
						-left-10
						-top-10
						h-28
						w-28
						rounded-full
						bg-teal-500/0
						blur-3xl
						transition-all
						duration-300
						group-hover:bg-teal-500/10
					"
				></div>

				<!-- Arrow -->
				<div
					class="
						absolute
						right-4
						top-4
						opacity-0
						translate-x-1
						text-zinc-600
						transition-all
						duration-200
						group-hover:translate-x-0
						group-hover:text-teal-400
						group-hover:opacity-100
					"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="h-4 w-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M7 17 17 7M7 7h10v10"
						/>
					</svg>
				</div>

				<!-- Content -->
				<div
					class="
						relative
						flex
						h-full
						flex-col
						items-center
						justify-center
						gap-4
					"
				>

					<div
						class="
							flex
							h-14
							w-14
							items-center
							justify-center
							rounded-xl
							border
							border-zinc-800
							bg-zinc-950
							text-zinc-500
							transition-all
							duration-200

							group-hover:border-teal-500/20
							group-hover:bg-teal-500/10
							group-hover:text-teal-400
							group-hover:scale-105
						"
					>
						<page.icon
							size={28}
							strokeWidth={1.7}
						/>
					</div>

					<span
						class="
							text-center
							text-sm
							font-medium
							text-zinc-300
							transition-colors
							group-hover:text-white
						"
					>
						{page.name}
					</span>

				</div>

			</a>

		{/each}

	</div>

</div>

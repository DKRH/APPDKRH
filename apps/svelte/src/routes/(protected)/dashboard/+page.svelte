<script lang="ts">
	import {
		Vault,
		ListChecks,
		NotebookPen,
		Link2,
		FileText,
		Clapperboard,
		UserRound,
		Dices,
		Gamepad2,
		Album,
		Cat,
		Crosshair,
		WalletCards,
		Package,
		FolderLock,
		Contact,
		QrCode,
		CalendarDays,
	} from "lucide-svelte";

	export const appPages = [
		{
			name: "PassBank",
			description: "Securely store and manage passwords and sensitive information.",
			icon: Vault,
			to: "/b-passbank",
			dev: false,
		},
		{
			name: "To-Do",
			description: "Manage your tasks and daily activities.",
			icon: ListChecks,
			to: "/c-todo",
			dev: false,
		},
		{
			name: "Note",
			description: "Create and organize your notes.",
			icon: NotebookPen,
			to: "/d-note",
			dev: false,
		},
		{
			name: "URL Shortener",
			description: "Create, Manage and Share shortened URLs.",
			icon: Link2,
			to: "/e-url-shortener",
			dev: true,
		},
		{
			name: "Text Storage",
			description: "Store and Share access text snippets.",
			icon: FileText,
			to: "/f-text-storage",
			dev: true,
		},
		{
			name: "Entertainment Tracker",
			description: "Track movies, shows, and other entertainment.",
			icon: Clapperboard,
			to: "/h-entertainment",
			dev: false,
		},
		{
			name: "Char",
			description: "Character database throughout all.",
			icon: UserRound,
			to: "/k/char",
			dev: false,
		},
		{
			name: "Gacha",
			description: "Simulate gacha pulls to fix your addiction.",
			icon: Dices,
			to: "/n-gacha",
			dev: true,
		},
		{
			name: "Game Whitelist",
			description: "Keep track of games you own, play, or want to whitelist.",
			icon: Gamepad2,
			to: "/g-game-whitelist",
			dev: true,
		},
		{
			name: "TCG Database",
			description: "Browse and organize your trading card game collection.",
			icon: Album,
			to: "/m-tcg-database",
			dev: true,
		},
		{
			name: "Cat History",
			description: "Keep a history of cats, sightings, and memorable moments.",
			icon: Cat,
			to: "/o-cat-history",
			dev: true,
		},
		{
			name: "Firearm Database",
			description: "Catalog and organize firearm reference information.",
			icon: Crosshair,
			to: "/p-firearm-database",
			dev: true,
		},
		{
			name: "Wallet",
			description: "Track income, expenses, assets, and personal finances.",
			icon: WalletCards,
			to: "/q-wallet",
			dev: true,
		},
		{
			name: "Inventory",
			description: "Track the things you own, their details, and where they are.",
			icon: Package,
			to: "/q-inventory",
			dev: true,
		},
		{
			name: "File Vault",
			description: "Store and organize personal documents, PDFs, and images.",
			icon: FolderLock,
			to: "/r-file-vault",
			dev: true,
		},
		{
			name: "Contacts",
			description: "Keep personal contacts and useful information organized.",
			icon: Contact,
			to: "/s-contacts",
			dev: true,
		},
		{
			name: "QR Generator",
			description: "Generate QR codes for URLs, text, and other information.",
			icon: QrCode,
			to: "/t-qr-generator",
			dev: true,
		},
		{
			name: "Calendar",
			description: "Keep track of events, dates, reminders, and important occasions.",
			icon: CalendarDays,
			to: "/u-calendar",
			dev: true,
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

				{#if page.dev}
					<span
						class="
							absolute left-3 top-3 z-10
							rounded-md
							border border-amber-500/20
							bg-amber-500/10
							px-2 py-1
							text-[9px]
							font-semibold
							tracking-wider
							text-amber-400
						"
					>
						IN DEVELOPMENT
					</span>
				{/if}
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
						gap-3
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

					<div class="text-center">
						<span
							class="
								block
								text-sm
								font-medium
								text-zinc-300
								transition-colors
								group-hover:text-white
							"
						>
							{page.name}
						</span>

						<p
							class="
								mt-1
								line-clamp-2
								text-xs
								leading-relaxed
								text-zinc-600
								transition-colors
								group-hover:text-zinc-500
							"
						>
							{page.description}
						</p>
					</div>

				</div>

			</a>

		{/each}

	</div>

		<!-- Divider -->
	<hr class="my-8 border-zinc-800" />

	<!-- User Management -->
	<div>
		<div class="mb-4">
			<h2 class="text-sm font-medium text-zinc-300">
				Administration
			</h2>

			<p class="mt-1 text-xs text-zinc-600">
				Manage users and account access.
			</p>
		</div>

		<a
			href="/a-auth/users"
			class="
				group relative
				flex
				min-h-32
				items-center
				gap-5
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

			<!-- Icon -->
			<div
				class="
					relative
					flex
					h-14
					w-14
					shrink-0
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
				<UserRound
					size={28}
					strokeWidth={1.7}
				/>
			</div>

			<!-- Content -->
			<div class="relative min-w-0">
				<span
					class="
						block
						text-sm
						font-medium
						text-zinc-300
						transition-colors
						group-hover:text-white
					"
				>
					Users
				</span>

				<p
					class="
						mt-1
						text-xs
						leading-relaxed
						text-zinc-600
						transition-colors
						group-hover:text-zinc-500
					"
				>
					Manage users, passwords, and account access.
				</p>
			</div>

			<!-- Arrow -->
			<div
				class="
					relative
					ml-auto
					shrink-0
					translate-x-1
					text-zinc-600
					opacity-0
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
					class="h-5 w-5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M7 17 17 7M7 7h10v10"
					/>
				</svg>
			</div>
		</a>
	</div>

</div>

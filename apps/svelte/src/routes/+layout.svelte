<script lang="ts">
	import "./layout.css";
    import { goto } from "$app/navigation";
	import { pageTitle } from "$lib/stores/pageTitle";
	let profileOpen = $state(false);
	let { children } = $props();
	const currentYear = new Date().getFullYear();
	import { onMount } from "svelte";
	let profileMenu: HTMLDivElement;
	onMount(() => {

	function handleClick(
			event: MouseEvent
		) {

			if (
				profileOpen &&
				profileMenu &&
				!profileMenu.contains(
					event.target as Node
				)
			) {
				profileOpen = false;
			}

		}

		document.addEventListener(
			"click",
			handleClick
		);

		return () => {
			document.removeEventListener(
				"click",
				handleClick
			);
		};

	});
</script>

<div class="min-h-screen flex flex-col bg-zinc-50 text-zinc-900">

	<header
		class="
			relative
			grid
			grid-cols-3
			items-center
			bg-white
			border-b
			border-zinc-200
			px-6
			py-3
			shadow-sm
		"
	>

		<div class="justify-self-start">

			<button
				onclick={() =>
					goto("/")
				}

				class="
					border
					border-zinc-300
					bg-white
					hover:bg-zinc-50
					px-3
					py-2
					rounded
				"
			>
				Menu
			</button>

		</div>

		<h1
			class="
				justify-self-center
				font-semibold
				text-lg
			"
		>
			{pageTitle.value}
		</h1>

		<div bind:this={profileMenu}
			class="
				relative
				justify-self-end
			"
		>

			<button
				onclick={() =>
					profileOpen =
						!profileOpen
				}

				class="
					border
					border-zinc-300
					bg-white
					hover:bg-zinc-50
					px-3
					py-2
					rounded
				"
			>
				Profile
			</button>

			{#if profileOpen}

				<div
					class="
						absolute
						right-0
						top-full
						mt-2
						w-40
						bg-white
						border
						border-zinc-200
						rounded
						shadow-lg
						overflow-hidden
						z-50
					"
				>

					<button
						class="
							w-full
							text-left
							px-4
							py-2
							hover:bg-zinc-50
						"
					>
						Settings
					</button>

					<button
						class="
							w-full
							text-left
							px-4
							py-2
							hover:bg-red-50
							text-red-600
						"
					>
						Logout
					</button>

				</div>

			{/if}

		</div>

	</header>

	<main class="flex-1 min-h-0 p-6">
		{@render children()}
	</main>

	<footer
		class="
			bg-white
			border-t
			border-zinc-200
			px-6
			py-4
			text-sm
			text-zinc-500
			text-center
		"
	>
		© {currentYear} DKRH
	</footer>

</div>
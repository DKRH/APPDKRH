<script lang="ts">
    import { goto } from "$app/navigation";
	import { authClient } from "$lib/api";
	import { pageTitle } from "$lib/stores/pageTitle";
	let profileOpen = $state(false);
	let loggingOut = $state(false);
	let { children } = $props();
	const currentYear = new Date().getFullYear();
	import { onMount } from "svelte";
	let profileMenu = $state<HTMLDivElement>();

	const sessionState = authClient.useSession();

	$effect(() => {
		console.log(
			"SESSION STATE:",
			$sessionState
		);
		if (
			!$sessionState.isPending &&
			!$sessionState.data
		) {
			goto(
				"/auth/login",
				{
					replaceState: true,
				}
			);
		}
	});

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

	async function logout() {
		loggingOut = true;

		try {
			await authClient.signOut();

			await goto("/", {
				replaceState: true,
			});
		} catch (error) {
			console.error("Logout failed:", error);
			loggingOut = false;
		}
	}
</script>
{#if $sessionState.isPending || loggingOut}

	<div class="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
		<div
			class="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
		></div>
	</div>

{:else if $sessionState.data}

	<div
		class="
			h-screen
			flex
			flex-col
			overflow-hidden
			bg-zinc-50
			text-zinc-900
		"
	>

		<header
			class="
				shrink-0
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
						goto("/dashboard")
					}
					class="
						border
						border-zinc-300
						bg-white
						hover:bg-zinc-50
						px-3
						py-2
						cursor-pointer
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

			<div
				bind:this={profileMenu}
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
						cursor-pointer
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
								cursor-pointer
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
								cursor-pointer
							"
							onclick={logout}
						>
							Logout
						</button>

					</div>

				{/if}

			</div>

		</header>

		<main
			class="
				flex-1
				min-h-0
				overflow-y-auto
				p-6 app-scroll
			"
		>

			{@render children()}

		</main>

		<footer
			class="
				shrink-0
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

{/if}

<style>
	.app-scroll {
		scrollbar-width: thin;
		scrollbar-color: #a1a1aa transparent;
	}

	/* Chrome, Edge, Safari */
	.app-scroll::-webkit-scrollbar {
		width: 10px;
	}

	.app-scroll::-webkit-scrollbar-track {
		background: transparent;
		margin: 8px 0;
	}

	.app-scroll::-webkit-scrollbar-thumb {
		background: #d4d4d8;
		border: 3px solid transparent;
		background-clip: content-box;
		border-radius: 999px;
	}

	.app-scroll::-webkit-scrollbar-thumb:hover {
		background: #a1a1aa;
		border: 3px solid transparent;
		background-clip: content-box;
	}

	.app-scroll::-webkit-scrollbar-thumb:active {
		background: #71717a;
		border: 3px solid transparent;
		background-clip: content-box;
	}
</style>
<script lang="ts">
	import { goto } from "$app/navigation";
	import { authClient } from "$lib/api";
	import { pageTitle } from "$lib/stores/pageTitle";
	import { onMount } from "svelte";

	let profileOpen = $state(false);
	let loggingOut = $state(false);
	let { children } = $props();
	let profileMenu = $state<HTMLDivElement>();

	const currentYear = new Date().getFullYear();

	const sessionState = authClient.useSession();

	$effect(() => {
		console.log("SESSION STATE:", $sessionState);

		if (
			!$sessionState.isPending &&
			!$sessionState.data
		) {
			goto("/auth/login", {
				replaceState: true,
			});
		}
	});

	onMount(() => {
		function handleClick(event: MouseEvent) {
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

	<!-- Loading -->
	<div
		class="fixed inset-0 z-50 flex items-center
		justify-center bg-zinc-950/90 backdrop-blur-sm"
	>
		<div class="flex flex-col items-center gap-4">
			<div
				class="h-9 w-9 animate-spin rounded-full
				border-2 border-zinc-700
				border-t-teal-400"
			></div>

			<span
				class="text-xs tracking-widest text-zinc-500"
			>
				{loggingOut
					? "SIGNING OUT"
					: "AUTHENTICATING"}
			</span>
		</div>
	</div>

{:else if $sessionState.data}

	<div
		class="h-screen flex flex-col overflow-hidden
		bg-zinc-950 text-zinc-100"
	>

		<!-- =====================================================
		     HEADER
		     ===================================================== -->

		<header
			class="relative grid shrink-0 grid-cols-3
			items-center border-b border-zinc-800
			bg-zinc-900/90 px-4 py-3
			shadow-lg shadow-black/10
			backdrop-blur-xl sm:px-6 z-[100]"
		>

			<!-- Left -->
			<div class="justify-self-start">

				<button
					onclick={() => goto("/dashboard")}
					class="group flex items-center gap-2
					rounded-lg border border-zinc-700
					bg-zinc-900 px-3 py-2
					text-sm font-medium text-zinc-300
					transition-all
					hover:border-zinc-600
					hover:bg-zinc-800
					hover:text-white
					active:scale-[0.98]
					cursor-pointer"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="h-4 w-4 text-zinc-500
						transition-colors
						group-hover:text-teal-400"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3 12h18M3 12l6-6M3 12l6 6"
						/>
					</svg>

					Menu
				</button>

			</div>

			<!-- Page title -->
			<h1
				class="justify-self-center truncate
				max-w-[45vw] text-sm font-semibold
				tracking-tight text-white sm:text-base"
			>
				{pageTitle.value}
			</h1>

			<!-- Profile -->
			<div
				bind:this={profileMenu}
				class="relative justify-self-end"
			>

				<button
					onclick={() =>
						profileOpen = !profileOpen
					}
					aria-expanded={profileOpen}
					class="flex items-center gap-2
					rounded-lg border border-zinc-700
					bg-zinc-900 px-3 py-2
					text-sm font-medium text-zinc-300
					transition-all
					hover:border-zinc-600
					hover:bg-zinc-800
					hover:text-white
					active:scale-[0.98]
					cursor-pointer"
				>

					<!-- Avatar -->
					<span
						class="flex h-6 w-6 items-center
						justify-center rounded-full
						bg-teal-500/10
						text-[10px] font-bold
						text-teal-400
						ring-1 ring-teal-500/20"
					>
						U
					</span>

					<span class="hidden sm:inline">
						Profile
					</span>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="h-4 w-4 text-zinc-500
						transition-transform
						{profileOpen ? 'rotate-180' : ''}"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m6 9 6 6 6-6"
						/>
					</svg>

				</button>

				<!-- Profile dropdown -->
				{#if profileOpen}

					<div
						class="absolute right-0 top-full z-50 mt-2
						w-48 overflow-hidden rounded-xl
						border border-zinc-800
						bg-zinc-900
						shadow-2xl shadow-black/40"
					>

						<!-- Header -->
						<div
							class="border-b border-zinc-800
							px-4 py-3"
						>
							<p
								class="text-xs font-medium
								text-zinc-500"
							>
								Account
							</p>

							<p
								class="mt-0.5 truncate
								text-sm font-medium
								text-zinc-200"
							>
								Profile
							</p>
						</div>

						<div class="p-1.5">

							<button
								class="flex w-full items-center
								gap-3 rounded-lg px-3 py-2.5
								text-left text-sm
								text-zinc-300
								transition-colors
								hover:bg-zinc-800
								hover:text-white
								cursor-pointer"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									class="h-4 w-4 text-zinc-500"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.42 1.42-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56V19.6h-2v-.08a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.42-1.42.06-.06A1.7 1.7 0 0 0 9.4 15a1.7 1.7 0 0 0-1.56-1.04H7.76v-2h.08A1.7 1.7 0 0 0 9.4 10.9a1.7 1.7 0 0 0-.34-1.88L9 8.96l1.42-1.42.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 13.4 6.38V6.3h2v.08a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.42 1.42-.06.06A1.7 1.7 0 0 0 19.4 10.9a1.7 1.7 0 0 0 1.56 1.04h.08v2h-.08A1.7 1.7 0 0 0 19.4 15Z"
									/>
								</svg>

								Settings
							</button>

							<button
								class="flex w-full items-center
								gap-3 rounded-lg px-3 py-2.5
								text-left text-sm
								text-red-400
								transition-colors
								hover:bg-red-500/10
								hover:text-red-300
								cursor-pointer"
								onclick={logout}
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
										d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="m10 17 5-5-5-5M15 12H3"
									/>
								</svg>

								Logout
							</button>

						</div>

					</div>

				{/if}

			</div>

		</header>

		<!-- =====================================================
		     CONTENT
		     ===================================================== -->

		<main
			class="app-scroll min-h-0 flex-1
			overflow-y-auto p-4 sm:p-6"
		>
			{@render children()}
		</main>

		<!-- =====================================================
		     FOOTER
		     ===================================================== -->

		<footer
			class="shrink-0 border-t border-zinc-800
			bg-zinc-900/80 px-6 py-3
			text-center text-xs text-zinc-600"
		>
			© {currentYear} DKRH
		</footer>

	</div>

{/if}

<style>
	.app-scroll {
		scrollbar-width: thin;
		scrollbar-color: #3f3f46 transparent;
	}

	.app-scroll::-webkit-scrollbar {
		width: 10px;
	}

	.app-scroll::-webkit-scrollbar-track {
		background: transparent;
		margin: 8px 0;
	}

	.app-scroll::-webkit-scrollbar-thumb {
		background: #3f3f46;
		border: 3px solid transparent;
		background-clip: content-box;
		border-radius: 999px;
	}

	.app-scroll::-webkit-scrollbar-thumb:hover {
		background: #52525b;
		border: 3px solid transparent;
		background-clip: content-box;
	}

	.app-scroll::-webkit-scrollbar-thumb:active {
		background: #71717a;
		border: 3px solid transparent;
		background-clip: content-box;
	}
</style>
<script lang="ts">
	import { goto } from "$app/navigation";
	import { authClient } from "$lib/api";

	let email = $state("");
	let password = $state("");
	let error = $state("");
	let loading = $state(false);

	const sessionState = authClient.useSession();

	$effect(() => {
		console.log("GUEST SESSION:", $sessionState);

		if (!$sessionState.isPending && $sessionState.data) {
			goto("/dashboard", {
				replaceState: true,
			});
		}
	});

	$effect(() => {
		if (!error) return;

		const timer = setTimeout(() => {
			error = "";
		}, 3000);

		return () => clearTimeout(timer);
	});

	async function login() {
		error = "";
		loading = true;

		try {
			const response = await authClient.signIn.email({
				email,
				password,
			});

			console.log("LOGIN:", response);

			const session = await authClient.getSession();

			console.log("SESSION:", session);

			if (response.error) {
				error = response.error.message;
				loading = false;
				return;
			}

			await goto("/dashboard", {
				invalidateAll: true,
			});
		} catch {
			error = "Cannot connect to server";
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>DKRH | Login</title>
</svelte:head>

{#if $sessionState.isPending}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center
		bg-zinc-950"
	>
		<div class="flex flex-col items-center gap-4">
			<div
				class="h-9 w-9 animate-spin rounded-full
				border-2 border-zinc-700 border-t-teal-400"
			></div>

			<span class="text-xs tracking-widest text-zinc-500">
				AUTHENTICATING
			</span>
		</div>
	</div>

{:else if !$sessionState.data}

	<div
		class="relative min-h-screen overflow-hidden
		bg-zinc-950 text-white"
	>
		<!-- Ambient background -->
		<div
			class="pointer-events-none absolute -left-40 -top-40
			h-[500px] w-[500px] rounded-full
			bg-teal-500/10 blur-[120px]"
		></div>

		<div
			class="pointer-events-none absolute -bottom-40 -right-40
			h-[500px] w-[500px] rounded-full
			bg-cyan-500/5 blur-[120px]"
		></div>

		<!-- Subtle grid -->
		<div
			class="pointer-events-none absolute inset-0 opacity-[0.025]"
			style="
				background-image:
					linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px),
					linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px);
				background-size: 40px 40px;
			"
		></div>

		<div
			class="relative z-10 flex min-h-screen items-center
			justify-center px-4"
		>
			<div class="w-full max-w-sm">

				<!-- Logo / Brand -->
				<div class="mb-8 text-center">
					<div
						class="mx-auto mb-4 flex h-12 w-12 items-center
						justify-center rounded-xl
						border border-teal-400/20
						bg-teal-400/10
						shadow-lg shadow-teal-950/20"
					>
						<span
							class="text-lg font-bold tracking-tight
							text-teal-300"
						>
							D
						</span>
					</div>

					<h1
						class="text-2xl font-semibold tracking-tight
						text-white"
					>
						Welcome back
					</h1>

					<p class="mt-2 text-sm text-zinc-500">
						Sign in to your DKRH account
					</p>
				</div>

				<!-- Login Card -->
				<div
					class="rounded-2xl border border-zinc-800
					bg-zinc-900/80 p-6 shadow-2xl
					shadow-black/40 backdrop-blur-xl"
				>
					{#if error}
						<div
							class="mb-4 flex items-start gap-3
							rounded-xl border border-red-500/20
							bg-red-500/10 p-3 text-sm text-red-300"
						>
							<div
								class="mt-0.5 flex h-5 w-5 shrink-0
								items-center justify-center rounded-full
								bg-red-500/15 text-xs font-bold text-red-400"
							>
								!
							</div>

							<span>{error}</span>
						</div>
					{/if}

					<form
						onsubmit={(event) => {
							event.preventDefault();
							login();
						}}
						class="space-y-4"
					>
						<!-- Email -->
						<div>
							<label
								for="email"
								class="mb-1.5 block text-xs font-medium
								text-zinc-400"
							>
								Email
							</label>

							<input
								id="email"
								type="email"
								placeholder="you@example.com"
								bind:value={email}
								autocomplete="email"
								disabled={loading}
								class="w-full rounded-xl border
								border-zinc-700 bg-zinc-950/70
								px-3.5 py-2.5 text-sm text-white
								placeholder:text-zinc-600
								outline-none transition
								focus:border-teal-500/60
								focus:ring-2 focus:ring-teal-500/10
								disabled:cursor-not-allowed
								disabled:opacity-50"
							/>
						</div>

						<!-- Password -->
						<div>
							<label
								for="password"
								class="mb-1.5 block text-xs font-medium
								text-zinc-400"
							>
								Password
							</label>

							<input
								id="password"
								type="password"
								placeholder="Enter your password"
								bind:value={password}
								autocomplete="current-password"
								disabled={loading}
								class="w-full rounded-xl border
								border-zinc-700 bg-zinc-950/70
								px-3.5 py-2.5 text-sm text-white
								placeholder:text-zinc-600
								outline-none transition
								focus:border-teal-500/60
								focus:ring-2 focus:ring-teal-500/10
								disabled:cursor-not-allowed
								disabled:opacity-50"
							/>
						</div>

						<!-- Login -->
						<button
							type="submit"
							disabled={loading}
							class="mt-2 flex w-full items-center
							justify-center rounded-xl
							bg-teal-500 px-4 py-2.5
							text-sm font-semibold text-zinc-950
							shadow-lg shadow-teal-950/20
							transition-all
							hover:bg-teal-400
							hover:shadow-teal-500/10
							active:scale-[0.99]
							disabled:cursor-not-allowed
							disabled:opacity-50
							cursor-pointer
							"
							
						>
							{#if loading}
								<span
									class="mr-2 h-4 w-4 animate-spin
									rounded-full border-2
									border-zinc-950/30
									border-t-zinc-950"
								></span>

								Signing in...
							{:else}
								Sign in
							{/if}
						</button>
					</form>
				</div>

				<p
					class="mt-6 text-center text-xs text-zinc-600"
				>
					DKRH · Secure authentication
				</p>
			</div>
		</div>
	</div>
{/if}

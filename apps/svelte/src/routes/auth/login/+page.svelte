<script lang="ts">
	import { goto } from "$app/navigation";
	import { authClient } from "$lib/api";

	let email = $state("");
	let password = $state("");
	let error = $state("");
	let loading = $state(false);

	const sessionState = authClient.useSession();

	$effect(() => {

		console.log(
			"GUEST SESSION:",
			$sessionState
		);

		if (
			!$sessionState.isPending &&
			$sessionState.data
		) {

			goto(
				"/dashboard",
				{
					replaceState: true,
				}
			);

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
			const response =
				await authClient.signIn.email({
					email,
					password,
				});
					console.log("LOGIN:", response);

			const session = await authClient.getSession();

			console.log(
				"SESSION:",
				session
			);

			if (response.error) {
				error =
					response.error.message;

				loading = false;

				return;
			}

			await goto("/dashboard", {
				invalidateAll: true,
			});
		}
		catch {
			error =
				"Cannot connect to server";

			loading = false;
		}
	}
</script>

{#if $sessionState.isPending}

	<div class="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
		<div
			class="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
		></div>
	</div>
{:else if !$sessionState.data}
	<div
		class="
			min-h-screen
			bg-zinc-300
			text-white
			flex
			items-center
			justify-center
		"
	>

		<div
			class="
				w-[250px]
				bg-zinc-400
				border
				border-zinc-800
				p-4
				rounded-xl
			"
		>

			{#if error}

				<div
					class="
						bg-red-700
						text-white
						p-2
						rounded-lg
						mb-3
						text-sm
					"
				>
					{error}
				</div>

			{/if}

			<input
				type="text"
				placeholder="Email"
				bind:value={email}

				class="
					w-full
					bg-zinc-800
					p-2
					rounded-lg
					mb-2
					outline-none
				"
			/>

			<input
				type="password"
				placeholder="Password"
				bind:value={password}

				class="
					w-full
					bg-zinc-800
					p-2
					rounded-lg
					mb-2
					outline-none
				"
			/>

			<button
				onclick={login}
				disabled={loading}

				class="
					w-full
					bg-zinc-600
					hover:bg-zinc-800
					transition
					p-2
					rounded-lg
					font-semibold
					cursor-pointer
				"
			>
				{loading
					? "LOADING..."
					: "LOGIN"}
			</button>

		</div>

	</div>
{/if}
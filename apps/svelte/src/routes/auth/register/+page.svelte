<script lang="ts">
	import { goto } from "$app/navigation";
	import { authClient } from "$lib/api";

	let username = $state("");
	let email = $state("");
	let password = $state("");

	let error = $state("");
	let success = $state("");

	let loading = $state(false);

	$effect(() => {

		if (!error && !success)
			return;

		const timer =
			setTimeout(() => {

				error = "";
				success = "";

			}, 3000);

		return () =>
			clearTimeout(timer);

	});

	async function register() {

		error = "";
		success = "";

		loading = true;

		try {

			const response =
				await authClient.signUp.email({
					name: username,
					email,
					password,
				});

			if (response.error) {

				error =
					response.error.message;

				loading = false;

				return;

			}

			success =
				"Account created";

			setTimeout(() => {

				goto("/");

			}, 1000);

		}
		catch {

			error =
				"Cannot connect to server";

		}

		loading = false;

	}
</script>

<div
	class="
		min-h-screen
		bg-zinc-100
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

		<div
			class="
				bg-red-700
				text-white
				p-2
				rounded-lg
				mb-2
				text-sm
				transition-all
				duration-300
				{error
					? 'opacity-100 translate-y-0'
					: 'opacity-0 -translate-y-2 pointer-events-none h-0 p-0 mb-0'}
			"
		>

			{error || "placeholder"}

		</div>

		<div
			class="
				bg-green-700
				text-white
				p-2
				rounded-lg
				mb-2
				text-sm
				transition-all
				duration-300
				{success
					? 'opacity-100 translate-y-0'
					: 'opacity-0 -translate-y-2 pointer-events-none h-0 p-0 mb-0'}
			"
		>

			{success || "placeholder"}

		</div>

		<input
			type="text"
			placeholder="Username"
			bind:value={username}

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
			type="email"
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
			onclick={register}
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
				disabled:opacity-50
			"
		>

			{loading
				? "CREATING..."
				: "REGISTER"}

		</button>

	</div>

</div>
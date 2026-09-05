<script lang="ts">
    import { apiFetch } from "$lib/api";

	type User = {
		id: string;
		name: string;
		email: string;
		emailVerified: boolean;
		createdAt: string;
	};

	const API = "/api/a1-users";

	let users = $state<User[]>([]);

	let search = $state("");
	let loading = $state(false);

	let showCreate = $state(false);
	let showReset = $state(false);

	let selectedUser = $state<User | null>(null);

	let name = $state("");
	let email = $state("");
	let password = $state("");

	let resetPassword = $state("");

	async function loadUsers() {
		loading = true;

		try {
			const params = new URLSearchParams({
				search,
				offset: "0",
				limit: "50",
			});

			const response = await apiFetch(
				`${API}?${params}`,
			);

			if (!response.ok) {
				throw new Error(
					"Failed to load users",
				);
			}

			users = await response.json();
		} finally {
			loading = false;
		}
	}

	async function createUser() {
		const response = await apiFetch(
			`${API}`,
			{
				method: "POST",
				headers: {
					"Content-Type":
						"application/json",
				},
				body: JSON.stringify({
					name,
					email,
					password,
				}),
			},
		);

		const result = await response.json();

		if (!response.ok) {
			alert(
				result.message ??
					"Failed to create user",
			);

			return;
		}

		closeCreate();

		await loadUsers();
	}

	async function resetUserPassword() {
		if (!selectedUser) {
			return;
		}

		const response = await apiFetch(
			`${API}/${selectedUser.id}/reset-password`,
			{
				method: "POST",
				headers: {
					"Content-Type":
						"application/json",
				},
				body: JSON.stringify({
					password: resetPassword,
				}),
			},
		);

		const result = await response.json();

		if (!response.ok) {
			alert(
				result.message ??
					"Failed to reset password",
			);

			return;
		}

		closeReset();

		alert("Password reset successfully");
	}

	function openCreate() {
		name = "";
		email = "";
		password = "";

		showCreate = true;
	}

	function closeCreate() {
		showCreate = false;

		name = "";
		email = "";
		password = "";
	}

	function openReset(user: User) {
		selectedUser = user;
		resetPassword = "";

		showReset = true;
	}

	function closeReset() {
		showReset = false;

		selectedUser = null;
		resetPassword = "";
	}

	$effect(() => {
		loadUsers();
	});
</script>

<svelte:head>
	<title>Users</title>
</svelte:head>
<div class="mx-auto w-full max-w-7xl">
	<!-- Header -->
	<div
		class="mb-6 flex items-center justify-between"
	>
		<div>
			<h1
				class="text-xl font-semibold tracking-tight
				text-white sm:text-2xl"
			>
				Users
			</h1>

			<p
				class="mt-1 text-sm text-zinc-500"
			>
				Manage application users and passwords.
			</p>
		</div>

		<button
			onclick={openCreate}
			class="cursor-pointer rounded-lg
			border border-teal-500/30
			bg-teal-500/10 px-3 py-2
			text-sm font-medium text-teal-400
			transition-all
			hover:border-teal-500/50
			hover:bg-teal-500/15
			hover:text-teal-300
			active:scale-[0.98]"
		>
			<div class="flex items-center gap-2">
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
						d="M12 5v14M5 12h14"
					/>
				</svg>

				Add User
			</div>
		</button>
	</div>

	<!-- Search -->
	<div class="mb-4">
		<div class="relative">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				class="pointer-events-none
				absolute left-3 top-1/2
				h-4 w-4 -translate-y-1/2
				text-zinc-600"
			>
				<circle
					cx="11"
					cy="11"
					r="8"
				/>
				<path
					stroke-linecap="round"
					d="m21 21-4.35-4.35"
				/>
			</svg>

			<input
				type="search"
				placeholder="Search name or email..."
				bind:value={search}
				oninput={loadUsers}
				class="w-full rounded-lg
				border border-zinc-800
				bg-zinc-900/70
				py-2.5 pl-10 pr-4
				text-sm text-zinc-200
				outline-none
				placeholder:text-zinc-600
				transition-all
				focus:border-teal-500/50
				focus:bg-zinc-900
				focus:ring-1
				focus:ring-teal-500/20"
			/>
		</div>
	</div>

	<!-- Table -->
	<div
		class="overflow-hidden rounded-xl
		border border-zinc-800
		bg-zinc-900/60
		shadow-xl shadow-black/10"
	>
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm">
				<thead
					class="border-b border-zinc-800
					bg-zinc-900/80"
				>
					<tr>
						<th
							class="px-5 py-3.5
							text-xs font-medium
							tracking-wide text-zinc-500"
						>
							Name
						</th>

						<th
							class="px-5 py-3.5
							text-xs font-medium
							tracking-wide text-zinc-500"
						>
							Email
						</th>

						<th
							class="px-5 py-3.5
							text-right
							text-xs font-medium
							tracking-wide text-zinc-500"
						>
							Actions
						</th>
					</tr>
				</thead>

				<tbody
					class="divide-y divide-zinc-800/70"
				>
					{#if loading}
						<tr>
							<td
								colspan="3"
								class="px-5 py-10
								text-center
								text-sm text-zinc-600"
							>
								<div
									class="flex items-center
									justify-center gap-3"
								>
									<div
										class="h-4 w-4
										animate-spin
										rounded-full
										border-2
										border-zinc-700
										border-t-teal-400"
									></div>

									Loading...
								</div>
							</td>
						</tr>

					{:else if users.length === 0}

						<tr>
							<td
								colspan="3"
								class="px-5 py-12
								text-center"
							>
								<div
									class="flex flex-col
									items-center"
								>
									<div
										class="mb-3 flex h-10 w-10
										items-center
										justify-center
										rounded-full
										bg-zinc-800/80
										text-zinc-600"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="1.5"
											class="h-5 w-5"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
											/>
											<circle
												cx="9"
												cy="7"
												r="4"
											/>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
											/>
										</svg>
									</div>

									<p
										class="text-sm
										font-medium
										text-zinc-400"
									>
										No users found
									</p>

									<p
										class="mt-1 text-xs
										text-zinc-600"
									>
										Try a different search
										or create a new user.
									</p>
								</div>
							</td>
						</tr>

					{:else}

						{#each users as user}
							<tr
								class="transition-colors
								hover:bg-zinc-800/30"
							>
								<td
									class="px-5 py-4"
								>
									<div
										class="font-medium
										text-zinc-200"
									>
										{user.name}
									</div>
								</td>

								<td
									class="px-5 py-4
									text-zinc-400"
								>
									{user.email}
								</td>

								<td
									class="px-5 py-4
									text-right"
								>
									<button
										onclick={() =>
											openReset(user)}
										class="cursor-pointer
										rounded-lg
										border border-zinc-700
										bg-zinc-900
										px-3 py-1.5
										text-xs font-medium
										text-zinc-400
										transition-all
										hover:border-teal-500/40
										hover:bg-teal-500/5
										hover:text-teal-400
										active:scale-[0.98]"
									>
										Reset Password
									</button>
								</td>
							</tr>
						{/each}

					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- =====================================================
     CREATE USER MODAL
     ===================================================== -->

{#if showCreate}

	<div
		class="fixed inset-0 z-[200]
		flex items-center justify-center
		bg-black/70 p-4
		backdrop-blur-sm"
	>
		<div
			class="w-full max-w-md
			rounded-xl
			border border-zinc-800
			bg-zinc-900
			shadow-2xl shadow-black/50"
		>
			<!-- Modal header -->
			<div
				class="border-b border-zinc-800
				px-5 py-4"
			>
				<h2
					class="text-base font-semibold
					text-white"
				>
					Add User
				</h2>

				<p
					class="mt-1 text-xs
					text-zinc-500"
				>
					Create a new application user.
				</p>
			</div>

			<!-- Form -->
			<div class="space-y-4 px-5 py-5">

				<label class="block">
					<span
						class="mb-1.5 block
						text-xs font-medium
						text-zinc-400"
					>
						Name
					</span>

					<input
						bind:value={name}
						autocomplete="name"
						class="w-full rounded-lg
						border border-zinc-800
						bg-zinc-950
						px-3 py-2.5
						text-sm text-zinc-200
						outline-none
						placeholder:text-zinc-600
						transition-all
						focus:border-teal-500/50
						focus:ring-1
						focus:ring-teal-500/20"
					/>
				</label>

				<label class="block">
					<span
						class="mb-1.5 block
						text-xs font-medium
						text-zinc-400"
					>
						Email
					</span>

					<input
						type="email"
						bind:value={email}
						autocomplete="email"
						class="w-full rounded-lg
						border border-zinc-800
						bg-zinc-950
						px-3 py-2.5
						text-sm text-zinc-200
						outline-none
						placeholder:text-zinc-600
						transition-all
						focus:border-teal-500/50
						focus:ring-1
						focus:ring-teal-500/20"
					/>
				</label>

				<label class="block">
					<span
						class="mb-1.5 block
						text-xs font-medium
						text-zinc-400"
					>
						Password
					</span>

					<input
						type="password"
						bind:value={password}
						autocomplete="new-password"
						class="w-full rounded-lg
						border border-zinc-800
						bg-zinc-950
						px-3 py-2.5
						text-sm text-zinc-200
						outline-none
						placeholder:text-zinc-600
						transition-all
						focus:border-teal-500/50
						focus:ring-1
						focus:ring-teal-500/20"
					/>
				</label>

			</div>

			<!-- Actions -->
			<div
				class="flex justify-end gap-2
				border-t border-zinc-800
				px-5 py-4"
			>
				<button
					onclick={closeCreate}
					class="cursor-pointer
					rounded-lg
					border border-zinc-700
					bg-zinc-900
					px-4 py-2
					text-sm font-medium
					text-zinc-400
					transition-all
					hover:bg-zinc-800
					hover:text-zinc-200"
				>
					Cancel
				</button>

				<button
					onclick={createUser}
					class="cursor-pointer
					rounded-lg
					border border-teal-500/30
					bg-teal-500/10
					px-4 py-2
					text-sm font-medium
					text-teal-400
					transition-all
					hover:border-teal-500/50
					hover:bg-teal-500/15
					hover:text-teal-300
					active:scale-[0.98]"
				>
					Create
				</button>
			</div>
		</div>
	</div>

{/if}

<!-- =====================================================
     RESET PASSWORD MODAL
     ===================================================== -->

{#if showReset && selectedUser}

	<div
		class="fixed inset-0 z-[200]
		flex items-center justify-center
		bg-black/70 p-4
		backdrop-blur-sm"
	>
		<div
			class="w-full max-w-md
			rounded-xl
			border border-zinc-800
			bg-zinc-900
			shadow-2xl shadow-black/50"
		>
			<!-- Modal header -->
			<div
				class="border-b border-zinc-800
				px-5 py-4"
			>
				<h2
					class="text-base font-semibold
					text-white"
				>
					Reset Password
				</h2>

				<p
					class="mt-1 text-xs
					text-zinc-500"
				>
					Update the user's login password.
				</p>
			</div>

			<!-- Form -->
			<div class="px-5 py-5">

				<div
					class="mb-4 rounded-lg
					border border-zinc-800
					bg-zinc-950/50
					px-3 py-2.5"
				>
					<p
						class="text-xs text-zinc-600"
					>
						User
					</p>

					<p
						class="mt-0.5 text-sm
						font-medium text-zinc-200"
					>
						{selectedUser.name}
					</p>

					<p
						class="mt-0.5 text-xs
						text-zinc-500"
					>
						{selectedUser.email}
					</p>
				</div>

				<label class="block">
					<span
						class="mb-1.5 block
						text-xs font-medium
						text-zinc-400"
					>
						New password
					</span>

					<input
						type="password"
						bind:value={resetPassword}
						autocomplete="new-password"
						class="w-full rounded-lg
						border border-zinc-800
						bg-zinc-950
						px-3 py-2.5
						text-sm text-zinc-200
						outline-none
						placeholder:text-zinc-600
						transition-all
						focus:border-teal-500/50
						focus:ring-1
						focus:ring-teal-500/20"
					/>
				</label>

			</div>

			<!-- Actions -->
			<div
				class="flex justify-end gap-2
				border-t border-zinc-800
				px-5 py-4"
			>
				<button
					onclick={closeReset}
					class="cursor-pointer
					rounded-lg
					border border-zinc-700
					bg-zinc-900
					px-4 py-2
					text-sm font-medium
					text-zinc-400
					transition-all
					hover:bg-zinc-800
					hover:text-zinc-200"
				>
					Cancel
				</button>

				<button
					onclick={resetUserPassword}
					class="cursor-pointer
					rounded-lg
					border border-teal-500/30
					bg-teal-500/10
					px-4 py-2
					text-sm font-medium
					text-teal-400
					transition-all
					hover:border-teal-500/50
					hover:bg-teal-500/15
					hover:text-teal-300
					active:scale-[0.98]"
				>
					Reset Password
				</button>
			</div>
		</div>
	</div>

{/if}
<script lang="ts">
	import { apiFetch } from "$lib/api";
	import { pageTitle } from "$lib/stores/pageTitle";

	type Todo = {
		id: string;
		name: string;
		isComplete: boolean;
		createdAt?: string | Date;
		updatedAt?: string | Date;
	};

	pageTitle.set("Todos");

	const apiBase = "/api/c-todos";

	let todos = $state<Todo[]>([]);

	let loading = $state(true);
	let saving = $state(false);
	let deleting = $state<string | null>(null);

	let newTodo = $state("");
	let search = $state("");

	let editingId = $state<string | null>(null);
	let editingName = $state("");

	let error = $state("");

	async function loadTodos() {
		loading = true;
		error = "";

		try {
			const params = new URLSearchParams();

			if (search.trim()) {
				params.set(
					"search",
					search.trim()
				);
			}

			params.set("offset", "0");
			params.set("limit", "100");

			const query = params.toString();

			const response = await apiFetch(
				`${apiBase}?${query}`
			);

			if (!response.ok) {
				throw new Error(
					`Failed to load todos (${response.status})`
				);
			}

			const result = await response.json();

			// auditedList returns the rows directly
			todos = Array.isArray(result)
				? result
				: result.data ?? [];
		} catch (err: any) {
			error =
				err.message ??
				"Failed to load todos.";
		} finally {
			loading = false;
		}
	}

	async function addTodo() {
		const name = newTodo.trim();

		if (!name || saving) {
			return;
		}

		saving = true;
		error = "";

		try {
			const response = await apiFetch(
				apiBase,
				{
					method: "POST",
					headers: {
						"Content-Type":
							"application/json",
					},
					body: JSON.stringify({
						name,
					}),
				}
			);

			if (!response.ok) {
				const body =
					await response
						.json()
						.catch(() => null);

				throw new Error(
					body?.message ??
						"Failed to create todo."
				);
			}

			newTodo = "";

			await loadTodos();
		} catch (err: any) {
			error =
				err.message ??
				"Failed to create todo.";
		} finally {
			saving = false;
		}
	}

	async function toggleTodo(todo: Todo) {
		error = "";

		// Optimistic update
		const oldValue = todo.isComplete;

		todo.isComplete =
			!todo.isComplete;

		try {
			const response = await apiFetch(
				`${apiBase}/${todo.id}/complete`,
				{
					method: "PATCH",
					headers: {
						"Content-Type":
							"application/json",
					},
					body: JSON.stringify({
						isComplete:
							todo.isComplete,
					}),
				}
			);

			if (!response.ok) {
				throw new Error(
					"Failed to update todo."
				);
			}
		} catch (err: any) {
			// Rollback
			todo.isComplete = oldValue;

			error =
				err.message ??
				"Failed to update todo.";
		}
	}

	function startEdit(todo: Todo) {
		editingId = todo.id;
		editingName = todo.name;
	}

	function cancelEdit() {
		editingId = null;
		editingName = "";
	}

	async function saveEdit(todo: Todo) {
		const name = editingName.trim();

		if (!name || saving) {
			return;
		}

		saving = true;
		error = "";

		try {
			const response = await apiFetch(
				`${apiBase}/${todo.id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type":
							"application/json",
					},
					body: JSON.stringify({
						name,
						isComplete:
							todo.isComplete,
					}),
				}
			);

			if (!response.ok) {
				throw new Error(
					"Failed to update todo."
				);
			}

			todo.name = name;

			cancelEdit();
		} catch (err: any) {
			error =
				err.message ??
				"Failed to update todo.";
		} finally {
			saving = false;
		}
	}

	async function deleteTodo(todo: Todo) {
		if (deleting) {
			return;
		}

		const confirmed = confirm(
			`Delete "${todo.name}"?`
		);

		if (!confirmed) {
			return;
		}

		deleting = todo.id;
		error = "";

		try {
			const response = await apiFetch(
				`${apiBase}/${todo.id}`,
				{
					method: "DELETE",
				}
			);

			if (!response.ok) {
				throw new Error(
					"Failed to delete todo."
				);
			}

			todos = todos.filter(
				(item) =>
					item.id !== todo.id
			);
		} catch (err: any) {
			error =
				err.message ??
				"Failed to delete todo.";
		} finally {
			deleting = null;
		}
	}

	async function handleSearch() {
		await loadTodos();
	}

	function handleKeydown(
		event: KeyboardEvent
	) {
		if (
			event.key === "Enter"
		) {
			addTodo();
		}
	}

	function formatDate(
		value?: string | Date
	) {
		if (!value) {
			return "";
		}

		const date =
			value instanceof Date
				? value
				: new Date(value);

		if (
			Number.isNaN(
				date.getTime()
			)
		) {
			return "";
		}

		return new Intl.DateTimeFormat(
			"en-US",
			{
				year: "numeric",
				month: "short",
				day: "numeric",
			}
		).format(date);
	}

	const remaining = $derived(
		todos.filter(
			(todo) =>
				!todo.isComplete
		).length
	);

	const completed = $derived(
		todos.filter(
			(todo) =>
				todo.isComplete
		).length
	);

	$effect(() => {
		loadTodos();
	});
</script>

<svelte:head>
	<title>DKRH | Todos</title>
</svelte:head>

<div class="mx-auto w-full max-w-4xl">

	<!-- Header -->
	<div
		class="
			mb-6
			flex
			flex-col
			gap-4
			sm:flex-row
			sm:items-center
			sm:justify-between
		"
	>
		<div>
			<h1
				class="
					text-2xl
					font-semibold
					tracking-tight
					text-white
				"
			>
				Todos
			</h1>

			<p
				class="
					mt-1
					text-sm
					text-zinc-500
				"
			>
				{remaining} remaining
				<span class="mx-1 text-zinc-700">•</span>
				{completed} completed
			</p>
		</div>

		<div class="flex items-center gap-2">
			<div
				class="
					rounded-full
					border
					border-teal-500/20
					bg-teal-500/10
					px-3
					py-1
					text-sm
					font-medium
					text-teal-400
				"
			>
				{todos.length} total
			</div>
		</div>
	</div>


	<!-- Add Todo -->
	<div
		class="
			mb-4
			rounded-xl
			border
			border-zinc-800
			bg-zinc-900/70
			p-4
			shadow-lg
			shadow-black/10
		"
	>
		<div
			class="
				flex
				flex-col
				gap-2
				sm:flex-row
			"
		>
			<input
				type="text"
				bind:value={newTodo}
				onkeydown={handleKeydown}
				placeholder="What needs to be done?"
				disabled={saving}
				class="
					min-w-0
					flex-1
					rounded-lg
					border
					border-zinc-700
					bg-zinc-950/70
					px-4
					py-2.5
					text-sm
					text-zinc-100
					placeholder:text-zinc-600
					outline-none
					transition
					focus:border-teal-500/60
					focus:ring-2
					focus:ring-teal-500/10
					disabled:cursor-not-allowed
					disabled:opacity-50
				"
			/>

			<button
				type="button"
				onclick={addTodo}
				disabled={
					saving ||
					!newTodo.trim()
				}
				class="
					rounded-lg
					bg-teal-500
					px-5
					py-2.5
					text-sm
					font-semibold
					text-zinc-950
					transition-all
					hover:bg-teal-400
					hover:shadow-lg
					hover:shadow-teal-500/10
					active:scale-[0.98]
					disabled:cursor-not-allowed
					disabled:opacity-40
				"
			>
				{saving
					? "Adding..."
					: "Add Todo"}
			</button>
		</div>
	</div>


	<!-- Search -->
	<div
		class="
			mb-4
			flex
			gap-2
		"
	>
		<div class="relative flex-1">

			<svg
				class="
					pointer-events-none
					absolute
					left-3
					top-1/2
					!h-4
					!w-4
					-shrink-0
					-translate-y-1/2
					text-zinc-600
				"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
				/>
			</svg>

			<input
				type="text"
				bind:value={search}
				onkeydown={(event) => {
					if (event.key === "Enter") {
						handleSearch();
					}
				}}
				placeholder="Search todos..."
				class="
					w-full
					rounded-lg
					border
					border-zinc-700
					bg-zinc-900/70
					py-2.5
					pl-10
					pr-4
					text-sm
					text-zinc-100
					placeholder:text-zinc-600
					outline-none
					transition
					focus:border-teal-500/60
					focus:ring-2
					focus:ring-teal-500/10
				"
			/>
		</div>

		<button
			type="button"
			onclick={handleSearch}
			class="
				rounded-lg
				border
				border-zinc-700
				bg-zinc-900
				px-4
				text-sm
				font-medium
				text-zinc-300
				transition
				hover:border-zinc-600
				hover:bg-zinc-800
				hover:text-white
			"
		>
			Search
		</button>
	</div>


	<!-- Error -->
	{#if error}
		<div
			class="
				mb-4
				flex
				items-center
				gap-3
				rounded-xl
				border
				border-red-500/20
				bg-red-500/10
				px-4
				py-3
				text-sm
				text-red-300
			"
		>
			<div
				class="
					flex
					h-5
					w-5
					shrink-0
					items-center
					justify-center
					rounded-full
					bg-red-500/10
					text-xs
					font-bold
					text-red-400
				"
			>
				!
			</div>

			{error}
		</div>
	{/if}


	<!-- Loading -->
	{#if loading}

		<div
			class="
				flex
				min-h-60
				items-center
				justify-center
				rounded-xl
				border
				border-zinc-800
				bg-zinc-900/70
			"
		>
			<div class="flex flex-col items-center gap-3">

				<div
					class="
						h-8
						w-8
						animate-spin
						rounded-full
						border-2
						border-zinc-700
						border-t-teal-400
					"
				></div>

				<span
					class="
						text-xs
						tracking-widest
						text-zinc-600
					"
				>
					LOADING
				</span>

			</div>
		</div>

	{:else if todos.length === 0}

		<!-- Empty -->
		<div
			class="
				rounded-xl
				border
				border-dashed
				border-zinc-800
				bg-zinc-900/50
				px-6
				py-16
				text-center
			"
		>
			<div
				class="
					mx-auto
					mb-4
					flex
					h-12
					w-12
					items-center
					justify-center
					rounded-full
					border
					border-teal-500/20
					bg-teal-500/10
					text-lg
					text-teal-400
				"
			>
				✓
			</div>

			<h2
				class="
					font-medium
					text-zinc-200
				"
			>
				No todos found
			</h2>

			<p
				class="
					mt-1
					text-sm
					text-zinc-600
				"
			>
				Add your first task above.
			</p>
		</div>

	{:else}

		<!-- Todo List -->
		<div
			class="
				overflow-hidden
				rounded-xl
				border
				border-zinc-800
				bg-zinc-900/70
				shadow-lg
				shadow-black/10
			"
		>

			{#each todos as todo, index (todo.id)}

				<div
					class="
						group
						flex
						items-center
						gap-3
						border-b
						border-zinc-800/70
						p-4
						transition
						last:border-b-0
						hover:bg-zinc-800/40
					"
				>

					<!-- Checkbox -->
					<button
						type="button"
						onclick={() =>
							toggleTodo(todo)
						}
						aria-label={
							todo.isComplete
								? "Mark incomplete"
								: "Mark complete"
						}
						class="
							flex
							h-5
							w-5
							shrink-0
							items-center
							justify-center
							rounded-full
							border-2
							transition-all
						"
						class:border-teal-500={
							todo.isComplete
						}
						class:bg-teal-500={
							todo.isComplete
						}
						class:border-zinc-600={
							!todo.isComplete
						}
						class:hover:border-teal-400={
							!todo.isComplete
						}
					>
						{#if todo.isComplete}
							<svg
								class="h-3 w-3 text-zinc-950"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.5 7.5a1 1 0 0 1-1.42 0l-3.5-3.5a1 1 0 0 1 1.42-1.414L8.5 12.086l6.793-6.79a1 1 0 0 1 1.41-.006Z"
									clip-rule="evenodd"
								/>
							</svg>
						{/if}
					</button>


					<!-- Content -->
					<div class="min-w-0 flex-1">

						{#if editingId === todo.id}

							<div class="flex gap-2">

								<input
									type="text"
									bind:value={editingName}
									onkeydown={(event) => {
										if (
											event.key === "Enter"
										) {
											saveEdit(todo);
										}

										if (
											event.key === "Escape"
										) {
											cancelEdit();
										}
									}}
									class="
										min-w-0
										flex-1
										rounded-lg
										border
										border-teal-500/50
										bg-zinc-950
										px-2
										py-1.5
										text-sm
										text-zinc-100
										outline-none
										ring-2
										ring-teal-500/10
									"
								/>

								<button
									type="button"
									onclick={() =>
										saveEdit(todo)
									}
									disabled={saving}
									class="
										rounded-lg
										bg-teal-500
										px-3
										py-1
										text-xs
										font-medium
										text-zinc-950
										transition
										hover:bg-teal-400
										disabled:opacity-50
									"
								>
									Save
								</button>

								<button
									type="button"
									onclick={cancelEdit}
									class="
										rounded-lg
										border
										border-zinc-700
										px-3
										py-1
										text-xs
										text-zinc-400
										transition
										hover:bg-zinc-800
										hover:text-white
									"
								>
									Cancel
								</button>

							</div>

						{:else}

							<button
								type="button"
								onclick={() =>
									startEdit(todo)
								}
								class="
									max-w-full
									text-left
								"
							>
								<div
									class="
										truncate
										text-sm
										font-medium
										transition
									"
									class:line-through={
										todo.isComplete
									}
									class:text-zinc-500={
										todo.isComplete
									}
									class:text-zinc-200={
										!todo.isComplete
									}
								>
									{todo.name}
								</div>

								{#if todo.createdAt}
									<div
										class="
											mt-1
											text-xs
											text-zinc-600
										"
									>
										{formatDate(
											todo.createdAt
										)}
									</div>
								{/if}
							</button>

						{/if}

					</div>


					<!-- Actions -->
					{#if editingId !== todo.id}

						<div
							class="
								flex
								shrink-0
								items-center
								gap-1
								opacity-100
								transition
								sm:opacity-0
								sm:group-hover:opacity-100
							"
						>

							<!-- Edit -->
							<button
								type="button"
								onclick={() =>
									startEdit(todo)
								}
								class="
									rounded-lg
									p-2
									text-zinc-500
									transition
									hover:bg-zinc-800
									hover:text-teal-400
								"
								title="Edit"
							>
								<svg
									class="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13l-3.514 1.004 1.004-3.514a4.5 4.5 0 0 1 1.13-1.897l9.557-9.557Z"
									/>
								</svg>
							</button>


							<!-- Delete -->
							<button
								type="button"
								onclick={() =>
									deleteTodo(todo)
								}
								disabled={
									deleting === todo.id
								}
								class="
									rounded-lg
									p-2
									text-zinc-500
									transition
									hover:bg-red-500/10
									hover:text-red-400
									disabled:opacity-50
								"
								title="Delete"
							>
								{#if deleting === todo.id}

									<div
										class="
											h-4
											w-4
											animate-spin
											rounded-full
											border-2
											border-zinc-700
											border-t-red-400
										"
									></div>

								{:else}

									<svg
										class="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.682-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0C10.91 2.568 10 3.552 10 4.732v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
										/>
									</svg>

								{/if}
							</button>

						</div>

					{/if}

				</div>

			{/each}

		</div>

	{/if}

</div>


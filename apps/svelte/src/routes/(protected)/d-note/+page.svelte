<script lang="ts">
	import { apiFetch } from "$lib/api";

	type View = "notes" | "archive" | "trash";

	type Label = {
		id: string;
		name: string;
		createdAt: string;
		updatedAt: string;
	};

	type Note = {
		id: string;
		title: string;
		content: string | null;
		color: string;
		isPinned: boolean;
		isArchived: boolean;
		isTrashed: boolean;
		createdAt: string;
		updatedAt: string;
		labels?: Label[];
	};

	const API = "/api/d-notes";

	const colors = [
		"bg-zinc-900",
		"bg-red-950/70",
		"bg-orange-950/70",
		"bg-yellow-950/70",
		"bg-emerald-950/70",
		"bg-blue-950/70",
		"bg-purple-950/70"
	];

	let notes = $state<Note[]>([]);
	let labels = $state<Label[]>([]);

	let view = $state<View>("notes");
	let search = $state("");

	let loading = $state(true);
	let saving = $state(false);

	let editorOpen = $state(false);
	let editingId = $state<string | null>(null);

	let title = $state("");
	let content = $state("");
	let selectedColor = $state("bg-zinc-900");
	let selectedLabelIds = $state<string[]>([]);

	let labelManagerOpen = $state(false);
	let newLabelName = $state("");

	let deleteForeverConfirm = $state<Note | null>(null);

	let searchInput = $state<HTMLInputElement>();


	// ============================================================
	// DERIVED
	// ============================================================

	let filteredNotes = $derived.by(() => {
		const query = search.trim().toLowerCase();

		return notes
			.filter((note) => {
				if (view === "trash") {
					return note.isTrashed;
				}

				if (view === "archive") {
					return (
						note.isArchived &&
						!note.isTrashed
					);
				}

				return (
					!note.isArchived &&
					!note.isTrashed
				);
			})
			.filter((note) => {
				if (!query) {
					return true;
				}

				return (
					note.title
						.toLowerCase()
						.includes(query) ||
					(note.content ?? "")
						.toLowerCase()
						.includes(query) ||
					note.labels?.some((label) =>
						label.name
							.toLowerCase()
							.includes(query)
					)
				);
			})
			.sort(
				(a, b) =>
					Number(b.isPinned) -
					Number(a.isPinned)
			);
	});

	let pinnedNotes = $derived(
		filteredNotes.filter(
			(note) => note.isPinned
		)
	);

	let otherNotes = $derived(
		filteredNotes.filter(
			(note) => !note.isPinned
		)
	);


	// ============================================================
	// LOAD
	// ============================================================

	async function loadLabels() {
		const response = await apiFetch(
			`${API}/labels`
		);

		const result = await response.json();

		labels = result.data ?? [];
	}


	async function loadNotes() {
		loading = true;

		try {
			const params = new URLSearchParams();

			params.set("view", view);

			if (search.trim()) {
				params.set(
					"search",
					search.trim()
				);
			}

			const response = await apiFetch(
				`${API}?${params}`
			);

			const result = await response.json();

			notes = result.data ?? [];

			// Load labels for every visible note.
			//await loadNoteLabels();
		} catch (error) {
			console.error(
				"Failed to load notes:",
				error
			);
		} finally {
			loading = false;
		}
	}


	async function loadNoteLabels() {
		await Promise.all(
			notes.map(async (note) => {
				try {
					const response =
						await apiFetch(
							`${API}/${note.id}/labels`
						);

					const result =
						await response.json();

					note.labels =
						result.data ?? [];
				} catch (error) {
					console.error(
						"Failed to load labels:",
						error
					);

					note.labels = [];
				}
			})
		);
	}


	$effect(() => {
		view;

		loadNotes();
	});


	// ============================================================
	// EDITOR
	// ============================================================

	function openCreate() {
		editingId = null;

		title = "";
		content = "";
		selectedColor = "bg-zinc-900";
		selectedLabelIds = [];

		editorOpen = true;
	}


	async function openEdit(note: Note) {
		editingId = note.id;

		title = note.title;
		content = note.content ?? "";
		selectedColor = note.color;

		selectedLabelIds =
			note.labels?.map(
				(label) => label.id
			) ?? [];

		editorOpen = true;
	}


	function closeEditor() {
		if (saving) return;

		editorOpen = false;
		editingId = null;
	}


	async function saveNote() {
		if (
			!title.trim() &&
			!content.trim()
		) {
			closeEditor();
			return;
		}

		saving = true;

		try {
			let note: Note;

			if (editingId) {
				const response =
					await apiFetch(
						`${API}/${editingId}`,
						{
							method: "PATCH",
							body: JSON.stringify({
								title:
									title.trim(),
								content:
									content.trim() ||
									null,
								color:
									selectedColor
							})
						}
					);

				const result =
					await response.json();

				note = result.data;

				await syncLabels(
					note.id,
	                note.labels?.map((label) => label.id) ?? [],
					selectedLabelIds
				);
			} else {
				const response =
					await apiFetch(API, {
						method: "POST",
						body: JSON.stringify({
							title:
								title.trim(),
							content:
								content.trim() ||
								null,
							color:
								selectedColor
						})
					});

				const result =
					await response.json();

				note = result.data;

				await syncLabels(
					note.id,
	                [],
					selectedLabelIds
				);
			}

			editorOpen = false;
			editingId = null;

			await loadNotes();
		} catch (error) {
			console.error(
				"Failed to save note:",
				error
			);
		} finally {
			saving = false;
		}
	}


	// ============================================================
	// LABELS ON NOTE
	// ============================================================

	async function syncLabels(
        noteId: string,
        currentLabelIds: string[],
        nextLabelIds: string[]
    ) {
        const currentIds = new Set(currentLabelIds);

		const nextIds =
			new Set(nextLabelIds);


		// Add new labels.
		for (const labelId of nextIds) {
			if (!currentIds.has(labelId)) {
				await apiFetch(
					`${API}/${noteId}/labels`,
					{
						method: "POST",
						body: JSON.stringify({
							labelId
						})
					}
				);
			}
		}


		// Remove labels.
		for (const labelId of currentIds) {
			if (!nextIds.has(labelId)) {
				await apiFetch(
					`${API}/${noteId}/labels?labelId=${encodeURIComponent(labelId)}`,
					{
						method: "DELETE"
					}
				);
			}
		}
	}


	function toggleEditorLabel(
		labelId: string
	) {
		if (
			selectedLabelIds.includes(labelId)
		) {
			selectedLabelIds =
				selectedLabelIds.filter(
					(id) => id !== labelId
				);
		} else {
			selectedLabelIds = [
				...selectedLabelIds,
				labelId
			];
		}
	}


	// ============================================================
	// NOTE ACTIONS
	// ============================================================

	async function togglePin(note: Note) {
		try {
			const response =
				await apiFetch(
					`${API}/${note.id}/pin`,
					{
						method: "PATCH"
					}
				);

			const result =
				await response.json();

			updateLocalNote(result.data);
		} catch (error) {
			console.error(
				"Failed to toggle pin:",
				error
			);
		}
	}


	async function toggleArchive(
		note: Note
	) {
		try {
			const response =
				await apiFetch(
					`${API}/${note.id}/archive`,
					{
						method: "PATCH"
					}
				);

			const result =
				await response.json();

			updateLocalNote(result.data);
		} catch (error) {
			console.error(
				"Failed to toggle archive:",
				error
			);
		}
	}


	async function moveToTrash(
		note: Note
	) {
		try {
			const response =
				await apiFetch(
					`${API}/${note.id}`,
					{
						method: "DELETE"
					}
				);

			const result =
				await response.json();

			updateLocalNote(result.data);
		} catch (error) {
			console.error(
				"Failed to delete note:",
				error
			);
		}
	}


	async function restoreNote(
		note: Note
	) {
		try {
			const response =
				await apiFetch(
					`${API}/${note.id}/restore`,
					{
						method: "PATCH"
					}
				);

			const result =
				await response.json();

			updateLocalNote(result.data);
		} catch (error) {
			console.error(
				"Failed to restore note:",
				error
			);
		}
	}


	async function deleteForever(
		note: Note
	) {
		try {
			await apiFetch(
				`${API}/${note.id}/permanent`,
				{
					method: "DELETE"
				}
			);

			notes = notes.filter(
				(item) =>
					item.id !== note.id
			);

			deleteForeverConfirm = null;
		} catch (error) {
			console.error(
				"Failed to permanently delete note:",
				error
			);
		}
	}


	function updateLocalNote(
		updated: Note
	) {
		const index = notes.findIndex(
			(note) =>
				note.id === updated.id
		);

		if (index === -1) return;

		notes[index] = {
			...notes[index],
			...updated
		};
	}


	// ============================================================
	// LABEL MANAGEMENT
	// ============================================================

	async function createLabel() {
		const name =
			newLabelName.trim();

		if (!name) return;

		try {
			const response =
				await apiFetch(
					`${API}/labels`,
					{
						method: "POST",
						body: JSON.stringify({
							name
						})
					}
				);

			const result =
				await response.json();

			labels = [
				...labels,
				result.data
			].sort((a, b) =>
				a.name.localeCompare(
					b.name
				)
			);

			newLabelName = "";
		} catch (error) {
			console.error(
				"Failed to create label:",
				error
			);
		}
	}


	async function renameLabel(
		label: Label
	) {
		const name = prompt(
			"Rename label:",
			label.name
		)?.trim();

		if (!name || name === label.name) {
			return;
		}

		try {
			const response =
				await apiFetch(
					`${API}/labels/${label.id}`,
					{
						method: "PATCH",
						body: JSON.stringify({
							name
						})
					}
				);

			const result =
				await response.json();

			labels = labels.map(
				(item) =>
					item.id === label.id
						? result.data
						: item
			);

			await loadNotes();
		} catch (error) {
			console.error(
				"Failed to rename label:",
				error
			);
		}
	}


	async function deleteLabel(
		label: Label
	) {
		if (
			!confirm(
				`Delete label "${label.name}"?`
			)
		) {
			return;
		}

		try {
			await apiFetch(
				`${API}/labels/${label.id}`,
				{
					method: "DELETE"
				}
			);

			labels = labels.filter(
				(item) =>
					item.id !== label.id
			);

			selectedLabelIds =
				selectedLabelIds.filter(
					(id) =>
						id !== label.id
				);

			await loadNotes();
		} catch (error) {
			console.error(
				"Failed to delete label:",
				error
			);
		}
	}


	// ============================================================
	// HELPERS
	// ============================================================

	function formatDate(
		date: string
	) {
		return new Intl.DateTimeFormat(
			"en",
			{
				month: "short",
				day: "numeric"
			}
		).format(new Date(date));
	}


	async function focusSearch() {
		searchInput?.focus();
	}


	function clearSearch() {
		search = "";
	}


	function switchView(
		nextView: View
	) {
		view = nextView;
	}


	function getLabel(
		id: string
	) {
		return labels.find(
			(label) =>
				label.id === id
		);
	}
</script>


<svelte:head>
	<title>Notes | DKRH</title>
	<meta
		name="description"
		content="Create and organize your notes."
	/>
</svelte:head>


<div
	class="flex h-full min-h-0 flex-col bg-zinc-950 text-zinc-100"
>

	<!-- ========================================================
	     HEADER
	========================================================= -->

	<header
		class="sticky top-0 z-30 flex min-h-16 shrink-0 items-center gap-3 border-b border-zinc-800/80 bg-zinc-950/90 px-4 backdrop-blur-xl"
	>

		<div
			class="flex shrink-0 items-center gap-3"
		>
			<div
				class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="21"
					height="21"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
				>
					<path
						d="M15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9z"
					/>
					<path
						d="M15 3v6h6"
					/>
					<path
						d="M8 13h8"
					/>
					<path
						d="M8 17h5"
					/>
				</svg>
			</div>

			<div class="hidden sm:block">
				<h1
					class="text-base font-semibold"
				>
					Notes
				</h1>

				<p
					class="text-xs text-zinc-500"
				>
					Keep your thoughts organized
				</p>
			</div>
		</div>


		<!-- SEARCH -->

		<div
			class="mx-auto flex w-full max-w-xl items-center"
		>
			<div
				class="flex h-11 w-full items-center rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 transition focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/10"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="shrink-0 text-zinc-500"
				>
					<circle
						cx="11"
						cy="11"
						r="8"
					/>
					<path
						d="m21 21-4.3-4.3"
					/>
				</svg>

				<input
					bind:this={searchInput}
					bind:value={search}
					placeholder="Search your notes..."
					class="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-zinc-600"
				/>

				{#if search}
					<button
						onclick={clearSearch}
						class="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
						aria-label="Clear search"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								d="M18 6 6 18"
							/>
							<path
								d="m6 6 12 12"
							/>
						</svg>
					</button>
				{/if}
			</div>
		</div>


		<button
			onclick={openCreate}
			class="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-emerald-500 px-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 active:scale-95"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="M12 5v14" />
				<path d="M5 12h14" />
			</svg>

			<span class="hidden sm:inline">
				New note
			</span>
		</button>
	</header>


	<!-- ========================================================
	     BODY
	========================================================= -->

	<div class="flex min-h-0 flex-1">


		<!-- SIDEBAR -->

		<aside
			class="hidden w-60 shrink-0 border-r border-zinc-800/70 bg-zinc-950 p-3 md:block"
		>

			<nav class="space-y-1">

				<button
					onclick={() =>
						switchView("notes")
					}
                    class={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                        view === "notes"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                        }`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
					>
						<rect
							x="4"
							y="4"
							width="16"
							height="16"
							rx="2"
						/>
						<path
							d="M8 8h8M8 12h8M8 16h5"
						/>
					</svg>

					<span class="flex-1 text-left">
						Notes
					</span>
				</button>


				<button
					onclick={() =>
						switchView("archive")
					}
                    class={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                        view === "archive"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                        }`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
					>
						<path
							d="M4 4h16v4H4z"
						/>
						<path
							d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8"
						/>
						<path
							d="M9 12h6"
						/>
					</svg>

					<span class="flex-1 text-left">
						Archive
					</span>
				</button>


				<button
					onclick={() =>
						switchView("trash")
					}
                    
                    class={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                        view === "trash"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                        }`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
					>
						<path d="M3 6h18" />
						<path
							d="M8 6V4h8v2"
						/>
						<path
							d="m19 6-1 14H6L5 6"
						/>
						<path
							d="M10 11v5M14 11v5"
						/>
					</svg>

					<span class="flex-1 text-left">
						Trash
					</span>
				</button>

			</nav>


			<div
				class="my-4 border-t border-zinc-800/70"
			></div>


			<div
				class="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600"
			>
				Labels
			</div>


			<div class="space-y-1">

				{#each labels as label (label.id)}
					<div
						class="group flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-500 transition hover:bg-zinc-900 hover:text-zinc-300"
					>
						<button
							class="flex min-w-0 flex-1 items-center gap-3 text-left"
							onclick={() => {
								search =
									label.name;
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="15"
								height="15"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.8"
							>
								<path
									d="M20 12 12 20l-8-8V4h8z"
								/>
								<path
									d="M8 8h.01"
								/>
							</svg>

							<span
								class="truncate"
							>
								{label.name}
							</span>
						</button>

						<button
							onclick={() =>
								renameLabel(
									label
								)
							}
							class="hidden rounded-md p-1 text-zinc-600 hover:bg-zinc-800 hover:text-zinc-300 group-hover:block"
							title="Rename"
						>
							✎
						</button>

						<button
							onclick={() =>
								deleteLabel(
									label
								)
							}
							class="hidden rounded-md p-1 text-zinc-600 hover:bg-red-500/10 hover:text-red-400 group-hover:block"
							title="Delete"
						>
							×
						</button>
					</div>
				{/each}

			</div>


			<button
				onclick={() =>
					(labelManagerOpen = true)
				}
				class="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-600 transition hover:bg-zinc-900 hover:text-zinc-300"
			>
				<span class="text-lg">+</span>
				Add label
			</button>


			<button
				onclick={focusSearch}
				class="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-600 transition hover:bg-zinc-900 hover:text-zinc-300"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="17"
					height="17"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
				>
					<circle
						cx="11"
						cy="11"
						r="7"
					/>
					<path
						d="m20 20-4-4"
					/>
				</svg>

				Find a note
			</button>

		</aside>


		<!-- ======================================================
		     NOTES
		======================================================= -->

		<main
			class="min-w-0 flex-1 overflow-y-auto"
		>
			<div
				class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
			>

				<!-- MOBILE FILTER -->

				<div
					class="mb-5 flex gap-2 overflow-x-auto md:hidden"
				>
					{#each [
						["notes", "Notes"],
						["archive", "Archive"],
						["trash", "Trash"]
					] as item}
						<button
							onclick={() =>
								switchView(
									item[0] as View
								)
							}
                            class={`shrink-0 rounded-lg  px-3 py-2 text-xs  ${
                                view === item[0]
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-zinc-900 text-zinc-400"
                                }`}
						>
							{item[1]}
						</button>
					{/each}
				</div>


				{#if loading}

					<div
						class="flex min-h-[50vh] items-center justify-center"
					>
						<div
							class="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-400"
						></div>
					</div>

				{:else if pinnedNotes.length > 0}

					<!-- PINNED -->

					<section class="mb-8">

						<div
							class="mb-3 flex items-center gap-2"
						>
							<span
								class="text-[11px] font-semibold uppercase tracking-widest text-zinc-600"
							>
								Pinned
							</span>

							<div
								class="h-px flex-1 bg-zinc-900"
							></div>
						</div>


						<div
							class="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4"
						>

							{#each pinnedNotes as note (note.id)}

								{@render NoteCard(note)}

							{/each}

						</div>

					</section>

				{/if}


				{#if !loading && otherNotes.length > 0}

					<section>

						{#if pinnedNotes.length > 0}

							<div
								class="mb-3 flex items-center gap-2"
							>
								<span
									class="text-[11px] font-semibold uppercase tracking-widest text-zinc-600"
								>
									Other notes
								</span>

								<div
									class="h-px flex-1 bg-zinc-900"
								></div>
							</div>

						{/if}


						<div
							class="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4"
						>

							{#each otherNotes as note (note.id)}

								{@render NoteCard(note)}

							{/each}

						</div>

					</section>

				{:else if !loading && pinnedNotes.length === 0}

					<div
						class="flex min-h-[50vh] flex-col items-center justify-center text-center"
					>

						<div
							class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-600"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="28"
								height="28"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<path
									d="M15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9z"
								/>
								<path
									d="M15 3v6h6"
								/>
							</svg>
						</div>

						<h2
							class="text-sm font-medium text-zinc-300"
						>
							{search
								? "No matching notes"
								: view ===
									"archive"
									? "No archived notes"
									: view ===
										  "trash"
										? "Trash is empty"
										: "No notes yet"}
						</h2>

						<p
							class="mt-1 max-w-xs text-xs leading-5 text-zinc-600"
						>
							{search
								? "Try another search term."
								: "Create a note and it will appear here."}
						</p>

						{#if !search && view === "notes"}

							<button
								onclick={openCreate}
								class="mt-5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-emerald-400"
							>
								Create your first note
							</button>

						{/if}

					</div>

				{/if}

			</div>
		</main>

	</div>
</div>


<!-- ============================================================
     EDITOR
============================================================= -->

{#if editorOpen}

	<div
		class="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
		role="presentation"
		onclick={(event) => {
			if (
				event.target ===
				event.currentTarget
			) {
				closeEditor();
			}
		}}
	>

		<div
			class={`w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-700/80 ${selectedColor} shadow-2xl shadow-black/50`}
		>

			<div class="p-5">

				<input
					bind:value={title}
					placeholder="Title"
					class="w-full bg-transparent text-lg font-semibold text-zinc-100 outline-none placeholder:text-zinc-600"
				/>

				<textarea
					bind:value={content}
					placeholder="Take a note..."
					rows="8"
					class="mt-4 w-full resize-none bg-transparent text-sm leading-6 text-zinc-300 outline-none placeholder:text-zinc-600"
				></textarea>


				<!-- LABELS -->

				{#if labels.length > 0}

					<div
						class="mt-4 flex flex-wrap gap-1.5"
					>

						{#each labels as label (label.id)}

							<button
								onclick={() =>
									toggleEditorLabel(
										label.id
									)
								}
								class={`rounded-full border px-2.5 py-1 text-[10px] transition ${
									selectedLabelIds.includes(
										label.id
									)
										? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
										: "border-zinc-700 bg-zinc-900/40 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
								}`}
							>
								{label.name}
							</button>

						{/each}

					</div>

				{/if}

			</div>


			<div
				class="flex flex-wrap items-center gap-2 border-t border-zinc-700/50 px-4 py-3"
			>

				<!-- COLORS -->

				<div
					class="flex items-center gap-1.5"
				>

					{#each colors as color}

						<button
							onclick={() =>
								(selectedColor =
									color)
							}
							class={`h-6 w-6 rounded-full border transition ${
								selectedColor ===
								color
									? "border-emerald-400 ring-2 ring-emerald-400/20"
									: "border-zinc-600 hover:scale-110"
							} ${color}`}
							aria-label="Set note color"
						></button>

					{/each}

				</div>


				<div class="flex-1"></div>


				<button
					onclick={closeEditor}
					disabled={saving}
					class="rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100 disabled:opacity-50"
				>
					Cancel
				</button>


				<button
					onclick={saveNote}
					disabled={saving}
					class="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-50"
				>

					{#if saving}

						<div
							class="h-3 w-3 animate-spin rounded-full border-2 border-zinc-950/30 border-t-zinc-950"
						></div>

					{/if}

					Save
				</button>

			</div>

		</div>

	</div>

{/if}


<!-- ============================================================
     LABEL MANAGER
============================================================= -->

{#if labelManagerOpen}

	<div
		class="fixed inset-0 z-[210] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
		role="presentation"
		onclick={(event) => {
			if (
				event.target ===
				event.currentTarget
			) {
				labelManagerOpen = false;
			}
		}}
	>

		<div
			class="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl"
		>

			<div class="p-5">

				<h2
					class="text-base font-semibold"
				>
					Create label
				</h2>

				<p
					class="mt-1 text-xs text-zinc-500"
				>
					Labels help organize your notes.
				</p>


				<div
					class="mt-5 flex gap-2"
				>

					<input
						bind:value={newLabelName}
						onkeydown={(event) => {
							if (
								event.key ===
								"Enter"
							) {
								createLabel();
							}
						}}
						placeholder="Label name"
						class="min-w-0 flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm outline-none placeholder:text-zinc-600 focus:border-emerald-500/50"
					/>

					<button
						onclick={createLabel}
						class="rounded-xl bg-emerald-500 px-4 text-xs font-semibold text-zinc-950 hover:bg-emerald-400"
					>
						Add
					</button>

				</div>

			</div>


			<div
				class="flex justify-end border-t border-zinc-800 px-4 py-3"
			>

				<button
					onclick={() =>
						(labelManagerOpen =
							false)
					}
					class="rounded-lg px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
				>
					Close
				</button>

			</div>

		</div>

	</div>

{/if}


<!-- ============================================================
     PERMANENT DELETE CONFIRMATION
============================================================= -->

{#if deleteForeverConfirm}

	<div
		class="fixed inset-0 z-[220] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
		role="presentation"
		onclick={(event) => {
			if (
				event.target ===
				event.currentTarget
			) {
				deleteForeverConfirm =
					null;
			}
		}}
	>

		<div
			class="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl"
		>

			<div
				class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M3 6h18" />
					<path
						d="M8 6V4h8v2"
					/>
					<path
						d="m19 6-1 14H6L5 6"
					/>
				</svg>
			</div>


			<h2
				class="text-base font-semibold"
			>
				Delete permanently?
			</h2>

			<p
				class="mt-2 text-sm leading-6 text-zinc-500"
			>
				This note will be permanently
				deleted and cannot be restored.
			</p>


			<div
				class="mt-5 flex justify-end gap-2"
			>

				<button
					onclick={() =>
						(deleteForeverConfirm =
							null)
					}
					class="rounded-lg px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
				>
					Cancel
				</button>

				<button
					onclick={() =>
						deleteForever(
							deleteForeverConfirm!
						)
					}
					class="rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-400"
				>
					Delete permanently
				</button>

			</div>

		</div>

	</div>

{/if}


<!-- ============================================================
     NOTE CARD
============================================================= -->

{#snippet NoteCard(note: Note)}

	<article
		class={`group relative mb-4 break-inside-avoid overflow-hidden rounded-xl border border-zinc-800/80 ${note.color} transition duration-200 hover:-translate-y-0.5 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/20`}
	>

		<button
			onclick={() => openEdit(note)}
			class="block w-full cursor-pointer p-4 text-left"
		>

			{#if note.title}

				<h3
					class="pr-7 text-sm font-semibold leading-5 text-zinc-100"
				>
					{note.title}
				</h3>

			{/if}


			{#if note.content}

				<p
					class="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-400"
				>
					{note.content}
				</p>

			{/if}


			<!-- LABEL CHIPS -->

			{#if note.labels && note.labels.length > 0}

				<div
					class="mt-3 flex flex-wrap gap-1"
				>

					{#each note.labels as label (label.id)}

						<span
							class="rounded-full border border-zinc-700/70 bg-zinc-950/20 px-2 py-0.5 text-[9px] font-medium text-zinc-500"
						>
							{label.name}
						</span>

					{/each}

				</div>

			{/if}


			<div
				class="mt-4 text-[10px] font-medium uppercase tracking-wide text-zinc-600"
			>
				{formatDate(note.updatedAt)}
			</div>

		</button>


		<!-- PIN -->

		<button
			onclick={(event) => {
				event.stopPropagation();

				togglePin(note);
			}}
			class={`absolute right-3 top-3 rounded-full p-1.5 transition ${
				note.isPinned
					? "text-emerald-400"
					: "text-zinc-600 opacity-0 group-hover:opacity-100 hover:bg-zinc-800 hover:text-zinc-300"
			}`}
			aria-label={
				note.isPinned
					? "Unpin note"
					: "Pin note"
			}
		>

			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill={
					note.isPinned
						? "currentColor"
						: "none"
				}
				stroke="currentColor"
				stroke-width="1.8"
			>
				<path
					d="m15 4 5 5-4 1-4 4-1 4-2-2-2-2 4-1 4-4z"
				/>
			</svg>

		</button>


		<!-- ACTIONS -->

		<div
			class="flex items-center justify-end gap-0.5 border-t border-zinc-800/40 px-2 py-1.5 opacity-0 transition group-hover:opacity-100"
		>

			{#if view === "trash"}

				<button
					onclick={() =>
						restoreNote(note)
					}
					class="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-emerald-400"
					title="Restore"
				>
					↶
				</button>

				<button
					onclick={() =>
						(deleteForeverConfirm =
							note)
					}
					class="rounded-lg p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
					title="Delete permanently"
				>
					⌫
				</button>

			{:else}

				<button
					onclick={() =>
						toggleArchive(
							note
						)
					}
					class="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
					title={
						view ===
						"archive"
							? "Unarchive"
							: "Archive"
					}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
					>
						<path
							d="M4 4h16v4H4z"
						/>
						<path
							d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8"
						/>
						<path
							d="M9 12h6"
						/>
					</svg>
				</button>


				<button
					onclick={() =>
						moveToTrash(
							note
						)
					}
					class="rounded-lg p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
					title="Delete"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
					>
						<path
							d="M3 6h18"
						/>
						<path
							d="M8 6V4h8v2"
						/>
						<path
							d="m19 6-1 14H6L5 6"
						/>
						<path
							d="M10 11v5M14 11v5"
						/>
					</svg>
				</button>

			{/if}

		</div>

	</article>

{/snippet}
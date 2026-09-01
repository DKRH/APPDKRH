<script lang="ts">
	import {
		onMount,
	} from "svelte";
	import { pageTitle } from "$lib/stores/pageTitle";
	import DkrhCrudModal
		from "./DkrhCrudModal.svelte";

	import {
		Pencil,
		Trash2,
		Eye,
	} from "lucide-svelte";

	import DkrhDeleteModal
		from "./DkrhDeleteModal.svelte";

	import {
		apiFetch,
	} from "$lib/api";

	let {
		title,

		apiBase,

		searchPlaceholder,

		columns,

		fields,

		deleteLabelColumn = "title",
	}: {
		title: string;

		apiBase: string;

		searchPlaceholder?: string;

		columns: any[];

		fields: any[];

		deleteLabelColumn?: string;
	} = $props();
	$effect(() => {
		pageTitle.set(title);
	});
	const LIMIT = 50;

	let tableElement =
		$state<HTMLDivElement | null>(
			null
		);

	let rows =
		$state<any[]>([]);

	let viewing = $state<any>(null);
	let editing =
		$state<any>(null);

	let deleteTarget =
		$state<any>(null);

	let search =
		$state("");

	let offset =
		$state(0);

	let loading =
		$state(false);

	let hasMore =
		$state(true);

	let lookups =
		$state<
			Record<
				string,
				any[]
			>
		>({});

	/*
	|--------------------------------------------------------------------------
	| LOAD LOOKUPS
	|--------------------------------------------------------------------------
	*/

	async function loadLookups() {
		const dropdowns =
			fields.filter(
				(f: any) =>
					f.type ===
						"dropdown" &&
					f.api
			);

		const result:
			Record<
				string,
				any[]
			> = {};

		await Promise.all(
			dropdowns.map(
				async (field: any) => {
					const response =
						await apiFetch(
								field.api
						);

					result[field.key] =
						await response.json();
				}
			)
		);

		lookups = result;
		console.log(
	"LOOKUPS LOADED:",
	lookups
);
	}

	/*
	|--------------------------------------------------------------------------
	| LOAD DATA
	|--------------------------------------------------------------------------
	*/

	async function loadData(
		searchValue: string,
		reset = false
	) {
		if (loading)
			return;

		loading = true;

		const currentOffset =
			reset
				? 0
				: offset;

		try {
			const response =
				await apiFetch(
						`${apiBase}` +
						`?search=${encodeURIComponent(
							searchValue
						)}` +
						`&offset=${currentOffset}` +
						`&limit=${LIMIT}`
				);

			const data =
				await response.json();

			if (reset) {
				rows = data;

				offset =
					data.length;

				hasMore =
					data.length ===
					LIMIT;
			}
			else {
				rows = [
					...rows,
					...data,
				];

				offset +=
					data.length;

				hasMore =
					data.length ===
					LIMIT;
			}
		}
		finally {
			loading = false;
		}
	}

	/*
	|--------------------------------------------------------------------------
	| INITIAL LOAD
	|--------------------------------------------------------------------------
	*/

	onMount(() => {
		loadLookups();

		loadData(
			"",
			true
		);
	});

	/*
	|--------------------------------------------------------------------------
	| SEARCH
	|--------------------------------------------------------------------------
	*/

	async function handleSearch(
		value: string
	) {
		search = value;

		offset = 0;

		await loadData(
			value,
			true
		);
	}

	/*
	|--------------------------------------------------------------------------
	| SCROLL
	|--------------------------------------------------------------------------
	*/

	function handleScroll() {
		if (
			!tableElement ||
			loading ||
			!hasMore
		)
			return;

		const nearBottom =
			tableElement.scrollTop +
			tableElement.clientHeight >=
			tableElement.scrollHeight -
				300;

		if (nearBottom) {
			loadData(
				search,
				false
			);
		}
	}

	/*
	|--------------------------------------------------------------------------
	| DELETE
	|--------------------------------------------------------------------------
	*/

	async function confirmDelete() {
		if (!deleteTarget)
			return;

		await apiFetch(
				`${apiBase}/${deleteTarget.id}`
			,
			{
				method: "DELETE",
			}
		);

		deleteTarget = null;

		offset = 0;

		await loadData(
			search,
			true
		);
	}

	/*
	|--------------------------------------------------------------------------
	| MODAL CLOSED
	|--------------------------------------------------------------------------
	*/

	async function handleModalClose() {
		editing = null;

		offset = 0;

		await loadData(
			search,
			true
		);
	}

	/*
	|--------------------------------------------------------------------------
	| COLUMN VALUE
	|--------------------------------------------------------------------------
	*/

	function getColumnValue(
		column: any,
		row: any
	) {
		if (column.show) {
			const field =
				fields.find(
					(f: any) =>
						f.key ===
						column.key
				);

			if (field) {
				const list =
					lookups[
						column.key
					] ?? [];

				const item =
					list.find(
						(x: any) =>
							x[
								field.valueField ??
									"id"
							] ===
							String(
								row[
									column.key
								]
							)
					);

				return (
					item?.[
						column.show
					] ?? ""
				);
			}
		}

		return row[column.key];
	}
</script>

<svelte:head>
	<title>DKRH | {title}</title>
</svelte:head>

<div
	class="
		h-full
		flex
		flex-col
		overflow-hidden
		bg-zinc-950
		text-zinc-100
	"
>

	<!-- Header -->
	<div
		class="
			mb-4
			flex
			shrink-0
			items-center
			justify-between
			gap-4
		"
	>
		<div class="min-w-0">
			<h1
				class="
					truncate
					text-xl
					font-semibold
					tracking-tight
					text-white
				"
			>
				{title}
			</h1>

			<p
				class="
					mt-0.5
					text-xs
					text-zinc-600
				"
			>
				Manage {title.toLowerCase()} records
			</p>
		</div>

		<button
			type="button"
			onclick={() =>
				editing = {}
			}
			class="
				shrink-0
				rounded-lg
				bg-teal-500
				px-4
				py-2
				text-sm
				font-semibold
				text-zinc-950
				transition-all
				hover:bg-teal-400
				hover:shadow-lg
				hover:shadow-teal-500/10
				active:scale-[0.98]
			"
		>
			+ Add
		</button>
	</div>


	<!-- Search -->
	<div
		class="
			mb-4
			shrink-0
			relative
		"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			class="
				pointer-events-none
				absolute
				left-3
				top-1/2
				h-4
				w-4
				-translate-y-1/2
				text-zinc-600
			"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
			/>
		</svg>

		<input
			type="text"
			placeholder={
				searchPlaceholder ??
				"Search..."
			}
			value={search}
			oninput={(event) =>
				handleSearch(
					event.currentTarget.value
				)
			}
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


	<!-- Table -->
	<div
		bind:this={tableElement}
		onscroll={handleScroll}
		class="
			min-h-0
			flex-1
			overflow-auto
			rounded-xl
			border
			border-zinc-800
			bg-zinc-900/60
			shadow-lg
			shadow-black/10
			app-table-scroll
		"
	>

		<table
			class="
				w-full
				min-w-max
				text-sm
			"
		>

			<!-- Table Header -->
			<thead
				class="
					sticky
					top-0
					z-30
					border-b
					border-zinc-800
					bg-zinc-900
				"
			>
				<tr>

					{#each columns as column}

						<th
							class="
								whitespace-nowrap
								p-3
								text-left
								text-xs
								font-semibold
								uppercase
								tracking-wider
								text-zinc-500
							"
						>
							{column.label}
						</th>

					{/each}

					<!-- Actions Header -->
					<th
						class="
							sticky
							right-0
							top-0
							z-40
							w-px
							whitespace-nowrap
							border-l
							border-zinc-800
							bg-zinc-900
							p-3
							text-left
							text-xs
							font-semibold
							uppercase
							tracking-wider
							text-zinc-500
						"
					>
						Actions
					</th>

				</tr>
			</thead>


			<!-- Table Body -->
			<tbody>

				{#each rows as row (row.id)}

					<tr
						class="
							group
							border-b
							border-zinc-800/70
							transition-colors
							last:border-b-0
							hover:bg-zinc-800/40
						"
					>

						{#each columns as column}

							<td
								class="
									p-3
									text-left
									text-zinc-300
								"
							>

								{#if column.render}

									{@render column.render(
										row[column.key],
										row
									)}

								{:else}

									{getColumnValue(
										column,
										row
									)}

								{/if}

							</td>

						{/each}


						<!-- Actions -->
						<td
							class="
								sticky
								right-0
								z-20
								border-l
								border-zinc-800
								bg-zinc-900
								p-3
								transition-colors
								group-hover:bg-zinc-850
							"
						>

							<div
								class="
									flex
									items-center
									gap-1.5
								"
							>

								<!-- View -->
								<button
									type="button"
									onclick={() =>
										viewing = {
											...row
										}
									}
									class="
										rounded-lg
										border
										border-zinc-700
										bg-zinc-800
										p-2
										text-zinc-500
										transition-all
										hover:border-teal-500/30
										hover:bg-teal-500/10
										hover:text-teal-400
									"
									title="View"
								>
									<Eye size={16} />
								</button>


								<!-- Edit -->
								<button
									type="button"
									onclick={() =>
										editing = {
											...row
										}
									}
									class="
										rounded-lg
										border
										border-zinc-700
										bg-zinc-800
										p-2
										text-zinc-500
										transition-all
										hover:border-amber-500/30
										hover:bg-amber-500/10
										hover:text-amber-400
									"
									title="Edit"
								>
									<Pencil size={16} />
								</button>


								<!-- Delete -->
								<button
									type="button"
									onclick={() =>
										deleteTarget = row
									}
									class="
										rounded-lg
										border
										border-zinc-700
										bg-zinc-800
										p-2
										text-zinc-500
										transition-all
										hover:border-red-500/30
										hover:bg-red-500/10
										hover:text-red-400
									"
									title="Delete"
								>
									<Trash2 size={16} />
								</button>

							</div>

						</td>

					</tr>

				{/each}

			</tbody>

		</table>


		<!-- Loading -->
		{#if loading}

			<div
				class="
					flex
					items-center
					justify-center
					gap-3
					border-t
					border-zinc-800
					p-6
					text-sm
					text-zinc-600
				"
			>
				<div
					class="
						h-4
						w-4
						animate-spin
						rounded-full
						border-2
						border-zinc-700
						border-t-teal-400
					"
				></div>

				Loading...
			</div>

		{/if}


		<!-- Empty -->
		{#if !loading && rows.length === 0}

			<div
				class="
					flex
					flex-col
					items-center
					justify-center
					border-t
					border-zinc-800
					p-12
					text-center
				"
			>

				<div
					class="
						mb-3
						flex
						h-11
						w-11
						items-center
						justify-center
						rounded-full
						border
						border-zinc-800
						bg-zinc-950
						text-zinc-600
					"
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
							d="M20.25 7.5v10.125a2.625 2.625 0 0 1-2.625 2.625H6.375a2.625 2.625 0 0 1-2.625-2.625V7.5m16.5 0-8.25 5.25L3.75 7.5m16.5 0-8.25-5.25L3.75 7.5"
						/>
					</svg>
				</div>

				<p
					class="
						text-sm
						font-medium
						text-zinc-400
					"
				>
					No data found
				</p>

				<p
					class="
						mt-1
						text-xs
						text-zinc-600
					"
				>
					There are no records to display.
				</p>

			</div>

		{/if}

	</div>

</div>


<!-- View Modal -->
{#if viewing}

	<DkrhCrudModal
		title={title}
		data={viewing}
		apiBase={apiBase}
		fields={fields}
		viewOnly={true}
		lookups={lookups}
		onClose={() => {
			viewing = null;
		}}
	/>

{/if}


<!-- Add / Edit Modal -->
{#if editing}

	<DkrhCrudModal
		{title}
		data={editing}
		apiBase={apiBase}
		{fields}
		lookups={lookups}
		onClose={handleModalClose}
	/>

{/if}


<!-- Delete Modal -->
{#if deleteTarget}

	<DkrhDeleteModal
		title={`Delete ${title}`}
		message={
			`${deleteTarget[
				deleteLabelColumn
			]}?`
		}
		onCancel={() =>
			deleteTarget = null
		}
		onConfirm={confirmDelete}
	/>

{/if}


<style>
	.app-table-scroll {
		scrollbar-width: thin;
		scrollbar-color: #3f3f46 transparent;
	}

	.app-table-scroll::-webkit-scrollbar {
		width: 10px;
		height: 10px;
	}

	.app-table-scroll::-webkit-scrollbar-track {
		background: transparent;
	}

	.app-table-scroll::-webkit-scrollbar-thumb {
		background: #3f3f46;
		border: 3px solid transparent;
		background-clip: content-box;
		border-radius: 999px;
	}

	.app-table-scroll::-webkit-scrollbar-thumb:hover {
		background: #52525b;
		border: 3px solid transparent;
		background-clip: content-box;
	}

	.app-table-scroll::-webkit-scrollbar-corner {
		background: transparent;
	}
</style>

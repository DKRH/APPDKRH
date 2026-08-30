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

<div
	class="
		h-full
		flex
		flex-col
		bg-zinc-450
		text-zinc-900
		overflow-hidden
	"
>
	<div
		class="
			flex
			items-center
			justify-between
			mb-4
		"
	>
		<h1
			class="
				text-xl
				font-bold
			"
		>
			{title}
		</h1>

		<button
			onclick={() =>
				editing = {}
			}
			class="
				bg-blue-600
				text-white
				cursor-pointer
				hover:bg-blue-500
				px-2
				py-1
			"
		>
			Add
		</button>
	</div>

	<div class="mb-4">
		<input
			type="text"

			placeholder={
				searchPlaceholder
			}

			value={search}

			oninput={(event) =>
				handleSearch(
					event.currentTarget
						.value
				)
			}
			class="
				w-full
				bg-zinc-100
				border
				border-zinc-700
				p-1
				text-black
				outline-none
				focus:border-blue-500
				focus:bg-zinc-200
			"
		/>
	</div>

	<div
		bind:this={tableElement}

		onscroll={handleScroll}

		class="
			flex-1
			overflow-auto
			border
			border-zinc-800
			rounded-lg
			min-h-0
		"
	>
		<table
			class="
				w-full
				min-w-max
				text-sm
			"
		>
			<thead
				class="
					sticky
					top-0
					z-30
					bg-amber-300
				"
			>
				<tr>
					{#each columns as column}

						<th
							class="
								p-3
								text-left
							"
						>
							{column.label}
						</th>

					{/each}

					<th
						class="
							sticky
							right-0
							top-0
							z-40
							bg-amber-500
							p-3
							text-left
							w-px
							whitespace-nowrap
						"
					>
						Actions
					</th>
				</tr>
			</thead>

			<tbody>

				{#each rows as row (row.id)}

					<tr
						class="
							border-t
							border-zinc-800
							hover:bg-amber-100
						"
					>
						{#each columns as column}

							<td
								class="
									p-3
									text-left
								"
							>
								{#if column.render}

									{@render column.render(
										row[
											column.key
										],
										row
									)}

								{:else}

									{
										getColumnValue(
											column,
											row
										)
									}

								{/if}

							</td>

						{/each}

						<td
							class="
								sticky
								right-0
								z-20
								bg-white
								p-3
							"
						>
							<div
								class="
									flex
									gap-2
								"
							>
								<button
									onclick={() =>
										viewing = {
											...row
										}
									}

									class="
										bg-blue-500
										hover:bg-blue-400
										p-2
										text-white
										cursor-pointer
									"
									title="View"
								>
									<Eye size={16} />
								</button>
								<button
									onclick={() =>
										editing =
											{
												...row
											}
									}
									class="
										bg-yellow-600
										hover:bg-yellow-500
										px-2
										py-2
										text-white
										cursor-pointer
									"
								>
									<Pencil size={16} />
								</button>

								<button
									onclick={() =>
										deleteTarget =
											row
									}
									class="
										bg-red-700
										hover:bg-red-600
										px-2
										py-2
										text-white
										cursor-pointer
									"
								>
									<Trash2 size={16} />
								</button>
							</div>
						</td>
					</tr>

				{/each}

			</tbody>
		</table>

		{#if loading}

			<div
				class="
					text-center
					p-6
					text-zinc-400
				"
			>
				Loading...
			</div>

		{/if}

		{#if !loading && rows.length === 0}

			<div
				class="
					text-center
					p-6
					text-zinc-500
				"
			>
				No data found.
			</div>

		{/if}
	</div>
</div>

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

{#if editing}

	<DkrhCrudModal
		{title}

		data={editing}

		apiBase={apiBase}

		{fields}
		lookups={lookups}
		onClose={
			handleModalClose
		}
	/>

{/if}

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

		onConfirm={
			confirmDelete
		}
	/>

{/if}
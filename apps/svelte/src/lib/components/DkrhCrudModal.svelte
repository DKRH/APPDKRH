<script lang="ts">
	import { apiFetch } from "$lib/api";

	let {
		title,
		data,
		apiBase,
		fields,
		lookups = {},
		onClose,
		viewOnly = false,
	}: {
		title: string;
		data: any;
		apiBase: string;
		fields: any[];
		lookups?: Record<string, any[]>;
		onClose: () => void;
		viewOnly?: boolean;
	} = $props();

	let form = $state<any>({});

	let dropdownOpen = $state<Record<string, boolean>>({});
	let dropdownSearch = $state<Record<string, string>>({});

	// Keep references to dropdown inputs
	let inputRefs = $state<
		Record<string, HTMLInputElement | undefined>
	>({});

	// Position of each dropdown
	let dropdownPosition = $state<
		Record<
			string,
			{
				top: number;
				left: number;
				width: number;
			}
		>
	>({});

	let saving = $state(false);
	let error = $state("");
	let errorTimeout: ReturnType<typeof setTimeout>;

	$effect(() => {
		const nextForm = {
			...data,
		};

		const nextDropdownSearch: Record<string, string> = {};

		for (const field of fields) {
			if (field.type !== "dropdown") continue;

			const selected = (
				lookups[field.key] ?? []
			).find(
				(item: any) =>
					item[field.valueField ?? "id"] ===
					nextForm[field.key]
			);

			if (selected) {
				nextDropdownSearch[field.key] =
					selected[
						field.labelField ?? "name"
					];
			}
		}

		form = nextForm;
		dropdownSearch = nextDropdownSearch;
	});

	function showError(message: string) {
		error = message;

		clearTimeout(errorTimeout);

		errorTimeout = setTimeout(() => {
			error = "";
		}, 5000);
	}

	function updateDropdownPosition(fieldKey: string) {
		const input = inputRefs[fieldKey];

		if (!input) return;

		const rect = input.getBoundingClientRect();

		dropdownPosition[fieldKey] = {
			top: rect.bottom,
			left: rect.left,
			width: rect.width,
		};
	}

	function openDropdown(fieldKey: string) {
		updateDropdownPosition(fieldKey);

		dropdownOpen[fieldKey] = true;
	}

	function getFilteredOptions(field: any) {
		const search = (
			dropdownSearch[field.key] ?? ""
		).toLowerCase();

		return (
			lookups[field.key] ?? []
		).filter((item: any) => {
			const label = String(
				item[
					field.labelField ?? "name"
				] ?? ""
			).toLowerCase();

			return label.includes(search);
		});
	}

	function selectFirstOption(field: any) {
		const options =
			getFilteredOptions(field);

		const first = options[0];

		if (!first) return;

		form[field.key] =
			first[
				field.valueField ?? "id"
			];

		dropdownSearch[field.key] =
			first[
				field.labelField ?? "name"
			];

		dropdownOpen[field.key] = false;
	}

	function selectOption(field: any, item: any) {
		const value =
			item[
				field.valueField ?? "id"
			];

		const label =
			item[
				field.labelField ?? "name"
			];

		form[field.key] = value;

		dropdownSearch[field.key] =
			label;

		dropdownOpen[field.key] = false;
	}

	async function submit() {
		error = "";

		for (const field of fields) {
			if (field.type !== "dropdown") {
				continue;
			}

			if (!form[field.key]) {
				const options =
					getFilteredOptions(field);

				if (options.length > 0) {
					const first = options[0];

					form[field.key] =
						first[
							field.valueField ??
								"id"
						];

					dropdownSearch[field.key] =
						first[
							field.labelField ??
								"name"
						];
				} else {
					error =
						`${field.label} is required.`;

					return;
				}
			}
		}

		saving = true;

		try {
			const isEdit = Boolean(form.id);

			const url = isEdit
				? `${apiBase}/${form.id}`
				: apiBase;

			await apiFetch(url, {
				method: isEdit
					? "PUT"
					: "POST",

				headers: {
					"Content-Type":
						"application/json",
				},

				body: JSON.stringify(form),
			});

			onClose();
		} catch (err: any) {
			showError(
				err.message ??
					"Failed to save."
			);
		} finally {
			saving = false;
		}
	}

	function updateAllDropdownPositions() {
		for (const field of fields) {
			if (
				field.type === "dropdown" &&
				dropdownOpen[field.key]
			) {
				updateDropdownPosition(
					field.key
				);
			}
		}
	}

	// Reposition dropdown when modal/content scrolls
	$effect(() => {
		if (
			typeof window === "undefined"
		) {
			return;
		}

		window.addEventListener(
			"scroll",
			updateAllDropdownPositions,
			true
		);

		window.addEventListener(
			"resize",
			updateAllDropdownPositions
		);

		return () => {
			window.removeEventListener(
				"scroll",
				updateAllDropdownPositions,
				true
			);

			window.removeEventListener(
				"resize",
				updateAllDropdownPositions
			);
		};
	});
</script>

<div
	class="
		fixed
		inset-0
		z-50
		bg-black/70
		flex
		items-center
		justify-center
		p-4
	"
>
	<div
		class="
			bg-white
			border
			border-zinc-700
			rounded-lg
			w-full
			max-w-lg
			max-h-[90vh]
			overflow-auto
			p-6
		"
	>
		<h2
			class="
				text-xl
				font-bold
				mb-4
			"
		>
			{viewOnly
				? `View ${title}`
				: form.id
					? `Edit ${title}`
					: `Add ${title}`}
		</h2>

		<div class="space-y-4">
			{#each fields as field}

				<div>
					<label
						for={field.key}
						class="
							block
							mb-1
							text-sm
						"
					>
						{field.label}
					</label>

					{#if field.type === "dropdown"}

						<div>
							<input
								id={field.key}
								bind:this={
									inputRefs[
										field.key
									]
								}
								type="text"
								disabled={viewOnly}

								value={
									dropdownSearch[
										field.key
									] ?? ""
								}

								onfocus={() => {
									if (!viewOnly) {
										openDropdown(
											field.key
										);
									}
								}}

								onblur={() => {
									if (!viewOnly) {
										selectFirstOption(
											field
										);
									}
								}}

								oninput={(event) => {
									dropdownSearch[
										field.key
									] =
										event
											.currentTarget
											.value;

									openDropdown(
										field.key
									);
								}}

								class="
									w-full
									border
									border-zinc-700
									p-1
									{viewOnly
										? 'bg-zinc-400 text-black cursor-default'
										: 'bg-zinc-100'}
								"
							/>

							{#if dropdownOpen[field.key] && !viewOnly}

								<!--
									IMPORTANT:
									fixed instead of absolute.
									This escapes the modal's
									overflow-auto clipping.
								-->
								<div
									class="
										fixed
										z-[99999]
										max-h-48
										overflow-y-auto
										bg-white
										border
										border-zinc-300
										shadow-xl
									"
									style="
										top: {dropdownPosition[field.key]?.top ?? 0}px;
										left: {dropdownPosition[field.key]?.left ?? 0}px;
										width: {dropdownPosition[field.key]?.width ?? 0}px;
									"
								>
									{#each getFilteredOptions(field) as item}

										<button
											type="button"

											onmousedown={(
												event
											) => {
												event.preventDefault();

												selectOption(
													field,
													item
												);
											}}

											class="
												w-full
												text-left
												p-2
												hover:bg-zinc-100
												cursor-pointer
											"
										>
											{
												item[
													field.labelField ??
														"name"
												]
											}
										</button>

									{/each}

									{#if getFilteredOptions(field).length === 0}
										<div
											class="
												p-2
												text-sm
												text-zinc-500
											"
										>
											No results
										</div>
									{/if}
								</div>

							{/if}
						</div>

					{:else if field.type === "textarea"}

						<textarea
							id={field.key}
							value={
								form[
									field.key
								] ?? ""
							}
							disabled={viewOnly}

							oninput={(event) =>
								(form[
									field.key
								] =
									event
										.currentTarget
										.value)
							}

							class="
								w-full
								{viewOnly
									? 'bg-zinc-400 text-black cursor-default'
									: 'bg-zinc-100'}
								border
								border-zinc-700
								p-1
							"
						></textarea>

					{:else}

						<input
							id={field.key}
							type={
								field.type ??
								"text"
							}

							value={
								form[
									field.key
								] ?? ""
							}

							disabled={viewOnly}

							oninput={(event) =>
								(form[
									field.key
								] =
									event
										.currentTarget
										.value)
							}

							class="
								{viewOnly
									? 'bg-zinc-400 text-black cursor-default'
									: 'bg-zinc-100'}
								w-full
								border
								border-zinc-700
								p-1
							"
						/>

					{/if}
				</div>

			{/each}
		</div>

		<div
			class="
				flex
				gap-2
				mt-6
			"
		>
			<button
				onclick={onClose}
				class="
					flex-1
					bg-zinc-700
					text-white
					px-2
					py-1
					cursor-pointer
				"
			>
				{viewOnly
					? "Close"
					: "Cancel"}
			</button>

			{#if !viewOnly}

				<button
					onclick={submit}
					disabled={saving}

					class="
						flex-1
						bg-blue-600
						text-white
						px-2
						py-1
						cursor-pointer
						disabled:opacity-50
					"
				>
					{saving
						? "Saving..."
						: "Save"}
				</button>

			{/if}
		</div>
	</div>

	{#if error}
		<div
			class="
				fixed
				top-4
				right-4
				z-[100]
				bg-red-600
				text-white
				border
				border-red-700
				px-4
				py-3
				shadow-lg
				max-w-sm
			"
		>
			{error}
		</div>
	{/if}
</div>
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
		flex
		items-center
		justify-center
		bg-black/70
		p-4
		backdrop-blur-sm
	"
>
	<div
		class="
			w-full
			max-w-lg
			max-h-[90vh]
			overflow-auto
			rounded-2xl
			border
			border-zinc-800
			bg-zinc-900
			p-6
			text-zinc-100
			shadow-2xl
			shadow-black/50
		"
	>

		<!-- Header -->
		<div class="mb-6">
			<h2
				class="
					text-xl
					font-semibold
					tracking-tight
					text-white
				"
			>
				{viewOnly
					? `View ${title}`
					: form.id
						? `Edit ${title}`
						: `Add ${title}`}
			</h2>

			<p
				class="
					mt-1
					text-xs
					text-zinc-600
				"
			>
				{viewOnly
					? "View the details below."
					: form.id
						? "Update the information below."
						: "Enter the information below."}
			</p>
		</div>


		<!-- Form -->
		<div class="space-y-5">

			{#each fields as field}

				<div>

					<label
						for={field.key}
						class="
							mb-1.5
							block
							text-xs
							font-medium
							text-zinc-400
						"
					>
						{field.label}
					</label>


					{#if field.type === "dropdown"}

						<div class="relative">

							<input
								id={field.key}
								bind:this={
									inputRefs[field.key]
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
									rounded-lg
									border
									border-zinc-700
									px-3
									py-2.5
									text-sm
									outline-none
									transition

									{viewOnly
										? 'cursor-default bg-zinc-800 text-zinc-400'
										: 'bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-600 focus:border-teal-500/60 focus:ring-2 focus:ring-teal-500/10'}
								"
							/>


							{#if dropdownOpen[field.key] && !viewOnly}

								<!-- Dropdown -->
								<div
									class="
										fixed
										z-[99999]
										max-h-48
										overflow-y-auto
										rounded-lg
										border
										border-zinc-700
										bg-zinc-900
										shadow-2xl
										shadow-black/40
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
											onmousedown={(event) => {
												event.preventDefault();

												selectOption(
													field,
													item
												);
											}}
											class="
												w-full
												px-3
												py-2.5
												text-left
												text-sm
												text-zinc-300
												transition
												hover:bg-zinc-800
												hover:text-white
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
												px-3
												py-3
												text-sm
												text-zinc-600
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
								form[field.key] ?? ""
							}
							disabled={viewOnly}
							oninput={(event) =>
								(form[field.key] =
									event.currentTarget.value)
							}
							class="
								min-h-28
								w-full
								resize-y
								rounded-lg
								border
								border-zinc-700
								px-3
								py-2.5
								text-sm
								outline-none
								transition

								{viewOnly
									? 'cursor-default bg-zinc-800 text-zinc-400'
									: 'bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-600 focus:border-teal-500/60 focus:ring-2 focus:ring-teal-500/10'}
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
								form[field.key] ?? ""
							}
							disabled={viewOnly}
							oninput={(event) =>
								(form[field.key] =
									event.currentTarget.value)
							}
							class="
								w-full
								rounded-lg
								border
								border-zinc-700
								px-3
								py-2.5
								text-sm
								outline-none
								transition

								{viewOnly
									? 'cursor-default bg-zinc-800 text-zinc-400'
									: 'bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-600 focus:border-teal-500/60 focus:ring-2 focus:ring-teal-500/10'}
							"
						/>

					{/if}

				</div>

			{/each}

		</div>


		<!-- Actions -->
		<div
			class="
				mt-7
				flex
				gap-2
				border-t
				border-zinc-800
				pt-5
			"
		>

			<button
				type="button"
				onclick={onClose}
				class="
					flex-1
					rounded-lg
					border
					border-zinc-700
					bg-zinc-800
					px-3
					py-2.5
					text-sm
					font-medium
					text-zinc-300
					transition
					hover:border-zinc-600
					hover:bg-zinc-700
					hover:text-white
				"
			>
				{viewOnly
					? "Close"
					: "Cancel"}
			</button>


			{#if !viewOnly}

				<button
					type="button"
					onclick={submit}
					disabled={saving}
					class="
						flex-1
						rounded-lg
						bg-teal-500
						px-3
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
					{#if saving}

						<span
							class="
								mr-2
								inline-block
								h-3.5
								w-3.5
								animate-spin
								rounded-full
								border-2
								border-zinc-950/30
								border-t-zinc-950
								align-[-2px]
							"
						></span>

						Saving...

					{:else}

						Save

					{/if}
				</button>

			{/if}

		</div>

	</div>


	<!-- Error Toast -->
	{#if error}

		<div
			class="
				fixed
				right-4
				top-4
				z-[100]
				flex
				max-w-sm
				items-start
				gap-3
				rounded-xl
				border
				border-red-500/20
				bg-zinc-900
				px-4
				py-3
				text-sm
				text-red-300
				shadow-2xl
				shadow-black/40
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

			<span>{error}</span>

		</div>

	{/if}

</div>


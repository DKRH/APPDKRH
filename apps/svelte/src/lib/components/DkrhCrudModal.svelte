<script lang="ts">
	import {
		apiFetch,
	} from "$lib/api";

	let {
		title,

		data,

		apiBase,

		fields,

		onClose,
	}: {
		title: string;

		data: any;

		apiBase: string;

		fields: any[];

		onClose: () => void;
	} = $props();

	let form = $state<any>({});

    $effect(() => {
        form = {
            ...data,
        };
    });
	let saving =
		$state(false);

	let error =
		$state("");

	async function submit() {
		saving = true;

		error = "";

		try {
			const isEdit =
				Boolean(form.id);

			const url =
				isEdit
					? `${apiBase}/${form.id}`
					: apiBase;

			await apiFetch(
				url,
				{
					method:
						isEdit
							? "PUT"
							: "POST",

					headers: {
						"Content-Type":
							"application/json",
					},

					body:
						JSON.stringify(
							form
						),
				}
			);

			onClose();
		}
		catch (err: any) {
			error =
				err.message ??
				"Failed to save.";
		}
		finally {
			saving = false;
		}
	}
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
			bg-zinc-900
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
			{form.id
				? `Edit ${title}`
				: `Add ${title}`}
		</h2>

		<div
			class="
				space-y-4
			"
		>
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

					{#if field.type === "textarea"}

						<textarea
                            id={field.key}
							value={
								form[
									field.key
								] ?? ""
							}

							oninput={(event) =>
								form[
									field.key
								] =
									event
										.currentTarget
										.value
							}

							class="
								w-full
								bg-zinc-950
								border
								border-zinc-700
								rounded
								p-3
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

							oninput={(event) =>
								form[
									field.key
								] =
									event
										.currentTarget
										.value
							}

							class="
								w-full
								bg-zinc-950
								border
								border-zinc-700
								rounded
								p-3
							"
						/>

					{/if}

				</div>

			{/each}
		</div>

		{#if error}

			<div
				class="
					mt-4
					text-red-400
				"
			>
				{error}
			</div>

		{/if}

		<div
			class="
				flex
				justify-end
				gap-2
				mt-6
			"
		>
			<button
				onclick={onClose}

				class="
					bg-zinc-700
					px-4
					py-2
					rounded
				"
			>
				Cancel
			</button>

			<button
				onclick={submit}

				disabled={saving}

				class="
					bg-blue-600
					px-4
					py-2
					rounded
					disabled:opacity-50
				"
			>
				{saving
					? "Saving..."
					: "Save"}
			</button>
		</div>
	</div>
</div>
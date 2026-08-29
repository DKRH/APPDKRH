<script lang="ts">
	import DkrhCrudPage
		from "$lib/components/DkrhCrudPage.svelte";

	const columns = [
		{
			key: "entryTitle",

			label:
				"Entry Title",
		},

		{
			key: "statusPublication",

			label:
				"Publication",
		},

		{
			key: "statusDl",

			label:
				"Download",
		},
	];

	const fields = [
		{
			key: "entryTitle",

			label:
				"Entry Title",

			type:
				"text",
		},

		{
			key:
				"statusPublication",

			label:
				"Publication Status",

			type:
				"text",
		},

		{
			key:
				"statusDl",

			label:
				"Download Status",

			type:
				"text",
		},
	];
</script>

<DkrhCrudPage
	title="Entertainment Tracker"

	apiBase="/api/h-entertainment-tracker"

	searchPlaceholder="Search entertainment..."

	{columns}

	{fields}

	deleteLabelColumn="entryTitle"
/>
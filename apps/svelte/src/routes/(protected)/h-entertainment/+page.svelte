<script lang="ts">
	import DkrhCrudPage from "$lib/components/DkrhCrudPage.svelte";

	const columns = [

		{
			key: "typeId",
			label: "Type",
			show: "name",
		},

		{
			key: "entryTitle",
			label: "Title",
		},

		{
			key: "lastMark",
			label: "Last Read",
		},

		{
			key: "linkDL",
			label: "Link DL",
		},

		{
			key: "statusDL",
			label: "Last DL",
		},

	];

	const fields = [

		{
			key: "typeId",
			label: "Type",
			type: "dropdown",
			api: "/api/h-entertainment-tracker-type",
			valueField: "id",
			labelField: "name",
		},

		{
			key: "entryTitle",
			label: "Title",
		},

		{
			key: "lastMark",
			label: "Last Read",
		},

		{
			key: "linkDL",
			label: "Link DL",
		},

		{
			key: "statusDL",
			label: "Last DL",
		},

	];
</script>

<DkrhCrudPage
	title="Entertainment"
	apiBase="/api/h-entertainment-tracker"
	searchPlaceholder="Search entertainment..."
	deleteLabelColumn="entryTitle"
	{columns}
	{fields}
/>
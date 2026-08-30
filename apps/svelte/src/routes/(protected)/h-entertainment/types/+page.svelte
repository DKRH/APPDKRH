<script lang="ts">
	import DkrhCrudPage from "$lib/components/DkrhCrudPage.svelte";

	const columns = [
		{
			key: "name",
			label: "Name"
		},
		{
			key: "desc",
			label: "Description"
		},
	];

	const fields = [
		{
			key: "name",
			label: "Name"
		},
		{
			key: "desc",
			label: "Description"
		},
	];
</script>

<DkrhCrudPage
	title="Entertainment Types"
	apiBase="/api/h-entertainment-tracker-type"
	searchPlaceholder="Search entertainment types..."
	deleteLabelColumn="name"
	{columns}
	{fields}
/>
<script lang="ts">
	import DkrhCrudPage from "$lib/components/DkrhCrudPage.svelte";

	const columns = [
		{
			key: "name",
			label: "Name",
		},
		{
			key: "desc",
			label: "Desc",
		},
	];

	const fields = [
		{
			key: "name",
			label: "Name",
		},
		{
			key: "desc",
			label: "Desc",
		},
	];
</script>

<DkrhCrudPage
	title="Universes"
	apiBase="/api/k-universe"
	searchPlaceholder="Search..."
	deleteLabelColumn="name"
	{columns}
	{fields}
/>
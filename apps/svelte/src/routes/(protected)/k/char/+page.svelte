<script lang="ts">
	import DkrhCrudPage from "$lib/components/DkrhCrudPage.svelte";

	const columns = [
		{
			key: "name",
			label: "Name",
		},
		{
			key: "weapon",
			label: "Weapon",
		},
		{
			key: "releaseVersion",
			label: "Release Version",
		},
		{
			key: "universeId",
			label: "Universe",
			show: "name",
		},
		{
			key: "attributeId",
			label: "Attribute",
			show: "name",
		},

	];

	const fields = [
		{
			key: "name",
			label: "Name",
		},
		{
			key: "weapon",
			label: "Weapon",
		},
		{
			key: "releaseVersion",
			label: "Release Version",
		},
		{
			key: "universeId",
			label: "Universe",
			type: "dropdown",
			api: "/api/k-universe",
			valueField: "id",
			labelField: "name",
		},
		{
			key: "attributeId",
			label: "Attribute",
			type: "dropdown",
			api: "/api/k-attribute",
			valueField: "id",
			labelField: "name",
		},

	];
</script>

<DkrhCrudPage
	title="Character Database"
	apiBase="/api/k-char"
	searchPlaceholder="Search..."
	deleteLabelColumn="name"
	{columns}
	{fields}
/>
<script lang="ts">
	import DkrhCrudPage from "$lib/components/DkrhCrudPage.svelte";

	const columns = [
		{
			key: "title",
			label: "Title",
		},
		{
			key: "username",
			label: "Username",
		},
		{
			key: "password",
			label: "Password",
		},
	];

	const fields = [
		{
			key: "title",
			label: "Title",
			type: "text",
		},
		{
			key: "username",
			label: "Username",
			type: "text",
		},
		{
			key: "password",
			label: "Password",
			type: "text",
		},
	];
</script>

<DkrhCrudPage
	title="Passbank"

	apiBase="/api/b-passbank"

	searchPlaceholder="Search..."

	{columns}

	{fields}

	deleteLabelColumn="title"
/>
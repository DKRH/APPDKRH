<script lang="ts">
	import { pageTitle } from "$lib/stores/pageTitle";
	import DkrhCrudPage from "$lib/components/DkrhCrudPage.svelte";

	pageTitle.set("PassBank");
	const columns = [
		{
			key: "title",
			label: "Title",
		},
		{
			key: "username",
			label: "Username",
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
		{
			key: "note",
			label: "Note",
			type: "textarea",
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
import { DkrhCrudPage } from "@/components/dkrhCrudPage";

export default function PassbankPage() {

	return (
		<DkrhCrudPage
			title="Passbank"
			apiBase="/api/b-passbank"
			searchPlaceholder="Search passwords..."
			deleteLabelColumn="title"
			columns={[
				{
					key: "title",
					label: "Title"
				},
				{
					key: "username",
					label: "Username"
				},
				{
					key: "note",
					label: "Note"
				},
			]}
			fields={[
				{
					key: "title",
					label: "Title"
				},
				{
					key: "username",
					label: "Username"
				},
				{
					key: "password",
					label: "Password"
				},
				{
					key: "note",
					label: "Note"
				},
				{
					key: "age",
					label: "Age",
					type: "number",
				},
				{
					key: "birthday",
					label: "Birthday",
					type: "date",
				},
				{
					key: "status",
					label: "Status",
					type: "dropdown",
					options: [
						{ label: "Active", value: "active" },
						{ label: "Inactive", value: "inactive" },
					],
				},
			]}
		/>
	);
}
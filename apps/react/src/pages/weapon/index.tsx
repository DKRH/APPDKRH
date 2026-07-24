import { DkrhCrudPage } from "@/components/dkrhCrudPage";

export default function Weapons() {

	return (
		<DkrhCrudPage
			title="Weapons"
			apiBase="/api/weapons"
			searchPlaceholder="Search weapon..."
			deleteLabelColumn="printname"
			columns={[
				{
					key: "printname",
					label: "Print Name"
				},
				{
					key: "classname",
					label: "Class Name"
				},
				{
					key: "group",
					label: "Group"
				},
			]}
			fields={[
				{
					key: "printname",
					label: "Print Name"
				},
				{
					key: "classname",
					label: "Class Name"
				},
				{
					key: "group",
					label: "Group"
				},
			]}
		/>
	);

	
}

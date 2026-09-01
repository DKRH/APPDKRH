import { DkrhCrudPage } from "@/components/dkrhCrudPage";

export default function App() {

    return (
        <DkrhCrudPage
            title="I-Weapon"
            apiBase="/api/i-weapon"
            searchPlaceholder="Search weapon"
            deleteLabelColumn="name"
            columns={[
                {
                    key: "classId",
                    label: "Class",
                    show: "name",
                },
                {
                    key: "caliberId",
                    label: "Caliber",
                    show: "name",
                },
                {
                    key: "originId",
                    label: "Origin",
                    show: "name",
                },
                {
                    key: "name",
                    label: "Name"
                },
                {
                    key: "desc",
                    label: "Desc"
                },
            ]}
            fields={[
				{
					key: "classId",
					label: "Class",
					type: "dropdown",
                    api: "/api/i-weapon-class",
                    valueField: "id",
                    labelField: "name",
				},
				{
					key: "caliberId",
					label: "Caliber",
					type: "dropdown",
                    api: "/api/i-weapon-caliber",
                    valueField: "id",
                    labelField: "name",
				},
				{
					key: "originId",
					label: "Origin",
					type: "dropdown",
                    api: "/api/i-weapon-origin",
                    valueField: "id",
                    labelField: "name",
				},
                {
                    key: "name",
                    label: "Name"
                },
                {
                    key: "desc",
                    label: "Desc"
                },
            ]}
        />
    );
}
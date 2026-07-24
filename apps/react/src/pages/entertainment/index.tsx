import { DkrhCrudPage } from "@/components/dkrhCrudPage";

export default function EntertainmentPage() {

    return (
        <DkrhCrudPage
            title="Entertainment"
            apiBase="/api/entertainment"
            searchPlaceholder="Search entertainment..."
            deleteLabelColumn="entryTitle"
            columns={[
                {
                    key: "typeId",
                    label: "Type",
                    show: "name",
                },
                {
                    key: "entryTitle",
                    label: "Title"
                },
                {
                    key: "lastMark",
                    label: "Last Read"
                },
            ]}
            fields={[
				{
					key: "typeId",
					label: "Type",
					type: "dropdown",
                    api: "/api/entertainment-types",
                    valueField: "id",
                    labelField: "name",
				},
                {
                    key: "entryTitle",
                    label: "Title"
                },
                {
                    key: "lastMark",
                    label: "Last Read"
                },
            ]}
        />
    );
}
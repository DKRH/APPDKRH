import { DkrhCrudPage } from "@/components/dkrhCrudPage";

export default function EntertainmentTypePage() {

    return (
        <DkrhCrudPage
            title="Entertainment Types"
            apiBase="/api/h-entertainment-tracker-type"
            searchPlaceholder="Search entertainment types..."
            deleteLabelColumn="name"
            columns={[
                {
                    key: "name",
                    label: "Name"
                },
                {
                    key: "desc",
                    label: "Description"
                },
            ]}
            fields={[
                {
                    key: "name",
                    label: "Name"
                },
                {
                    key: "desc",
                    label: "Description"
                },
            ]}
        />
    );
}
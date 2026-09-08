import { DkrhCrudPage } from "@/components/dkrhCrudPage";

export default function App() {

    return (
        <DkrhCrudPage
            title="I-Weapon Class"
            apiBase="/api/i-weapon-class"
            searchPlaceholder="Search..."
            deleteLabelColumn="name"
            columns={[
                {
                    key: "type",
                    label: "Type"
                },
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
                    key: "type",
                    label: "Type"
                },
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
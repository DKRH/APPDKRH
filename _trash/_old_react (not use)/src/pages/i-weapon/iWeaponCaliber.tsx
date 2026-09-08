import { DkrhCrudPage } from "@/components/dkrhCrudPage";

export default function App() {

    return (
        <DkrhCrudPage
            title="I-Weapon Caliber"
            apiBase="/api/i-weapon-caliber"
            searchPlaceholder="Search..."
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
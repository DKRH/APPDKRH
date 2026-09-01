import { DkrhCrudPage } from "@/components/dkrhCrudPage";

export default function App() {

    return (
        <DkrhCrudPage
            title="K-Characters"
            apiBase="/api/k-character"
            searchPlaceholder="Search..."
            deleteLabelColumn="name"
            columns={[
                {
                    key: "name",
                    label: "Name",
                },
                {
                    key: "weapon",
                    label: "Weapon",
                },
                {
                    key: "attribute",
                    label: "Attribute"
                },
                {
                    key: "universe",
                    label: "Universe",
                    show: "universe",
                },
                {
                    key: "releaseversion",
                    label: "Release Version"
                },
            ]}
            fields={[
                {
                    key: "attribute",
                    label: "Attribute",
                    type: "dropdown",
                    api: "/api/k-attribute",
                    valueField: "id",
                    labelField: "name",
                },
                {
                    key: "universe",
                    label: "Universe",
                    type: "dropdown",
                    api: "/api/k-universe",
                    valueField: "id",
                    labelField: "name",
                },
                {
                    key: "releaseversion",
                    label: "Release Version"
                },
                {
                    key: "name",
                    label: "Name",
                },
                {
                    key: "weapon",
                    label: "Weapon",
                },
            ]}
        />
    );
}
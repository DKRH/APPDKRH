import { useEffect, useState } from "react";
import { apiFetch, getAPIURL } from "@/components/const";

type Item = {
    id: string;
    code: string;
    barcode: string;
    name: string;
    category: string;
    stock: number;
};

export default function FinishedGoodsPage() {

    const [items, setItems] = useState<Item[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadItems();
    }, []);

    async function loadItems() {
        setLoading(true);

        const res = await apiFetch( getAPIURL("/inventory/items?type=finished_good") );
        const data = await res.json();

        setItems(data);
        setLoading(false);
    }

    const filtered = items.filter(i => {

        const q = search.toLowerCase();

        return (
            i.code.toLowerCase().includes(q) ||
            i.name.toLowerCase().includes(q) ||
            i.barcode.toLowerCase().includes(q)
        );

    });

    return (
        <div className="p-6">

            <div className="flex items-center justify-between mb-6">

                <h1 className="text-2xl font-bold">
                    Finished Goods
                </h1>

                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="border rounded-lg px-4 py-2 w-80"
                />

            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">

                <table className="min-w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="text-left p-3">
                                Code
                            </th>

                            <th className="text-left p-3">
                                Barcode
                            </th>

                            <th className="text-left p-3">
                                Name
                            </th>

                            <th className="text-left p-3">
                                Category
                            </th>

                            <th className="text-right p-3">
                                Stock
                            </th>

                            <th className="text-center p-3">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {loading && (

                            <tr>

                                <td
                                    colSpan={6}
                                    className="text-center p-10"
                                >
                                    Loading...
                                </td>

                            </tr>

                        )}

                        {!loading && filtered.length === 0 && (

                            <tr>

                                <td
                                    colSpan={6}
                                    className="text-center p-10 text-gray-500"
                                >
                                    No finished goods found.
                                </td>

                            </tr>

                        )}

                        {!loading && filtered.map(item => (

                            <tr
                                key={item.id}
                                className="border-t hover:bg-gray-50"
                            >

                                <td className="p-3">
                                    {item.code}
                                </td>

                                <td className="p-3">
                                    {item.barcode}
                                </td>

                                <td className="p-3 font-medium">
                                    {item.name}
                                </td>

                                <td className="p-3">
                                    {item.category}
                                </td>

                                <td className="p-3 text-right">
                                    {item.stock}
                                </td>

                                <td className="p-3 text-center">

                                    <button
                                        onClick={() => {
                                            location.href =
                                                `/inventory/items/${item.id}`;
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                    >
                                        View
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}
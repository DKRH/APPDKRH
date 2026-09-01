import { Link } from "react-router-dom";
import { appPages } from "./list";

export default function Dashboard() {
    return (
        <div className="bg-zinc-950 h-full
            flex
            flex-col
            overflow-hidden"
        >
            <h1 className="mb-8 text-3xl font-bold text-white">
                Dashboard
            </h1>

            <div className="flex-1 min-h-0 overflow-auto p-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-6 lg:grid-cols-6">
                    {appPages.map((page) => {
                        const Icon = page.icon;

                        return (
                            <Link
                                key={page.to}
                                to={page.to}
                                className="
                                    group
                                    aspect-square
                                    rounded-xl
                                    border border-zinc-800
                                    bg-zinc-900
                                    hover:bg-zinc-800
                                    hover:border-blue-500
                                    transition
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    gap-4
                                "
                            >
                                <Icon
                                    size={40}
                                    className="text-blue-400 group-hover:scale-110 transition"
                                />

                                <span className="text-center text-sm font-medium text-white">
                                    {page.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
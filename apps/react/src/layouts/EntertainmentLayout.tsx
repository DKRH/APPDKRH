import { Link, Outlet } from "react-router-dom";

export default function EntertainmentLayout() {
    return (
        <>
            <div
                className="
                    h-12
                    bg-zinc-900
                    border-b
                    border-zinc-800
                    flex
                    items-center
                    gap-6
                    px-4
                "
            >
                <Link to="/entertainment" className="hover:text-blue-400 transition">
                    Entertainment
                </Link>

                <Link to="/entertainment-types" className="hover:text-blue-400 transition">
                    Types
                </Link>
            </div>

            <div className="p-4">
                <Outlet />
            </div>
        </>
    );
}
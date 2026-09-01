import { Link, Outlet } from "react-router-dom";

type MenuItem = {
    label: string;
    to: string;
};

type EntertainmentLayoutProps = {
    menus?: MenuItem[];
};

const defaultMenus: MenuItem[] = [
    {
        label: "Entertainment",
        to: "/entertainment",
    },
    {
        label: "Types",
        to: "/entertainment-types",
    },
];

export default function App({
    menus = defaultMenus,
}: EntertainmentLayoutProps) {
    return (
        <>
            <div
                className="
                    bg-zinc-900
                    border-b
                    border-white-800
                    flex
                    items-center
                    flex-wrap
                    gap-2
                    py-2
                "
            >
                {menus.map((menu, index) => (
                    <div
                        key={menu.to}
                        className="flex items-center flex-shrink-0"
                    >
                        <Link
                            to={menu.to}
                            className="
                                px-3
                                hover:text-blue-400
                                transition
                            "
                        >
                            {menu.label}
                        </Link>

                        {index < menus.length - 1 && (
                            <span className="text-zinc-600 select-none">|</span>
                        )}
                    </div>
                ))}
            </div>

            <Outlet />
        </>
    );
}
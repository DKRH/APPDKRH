import { Outlet, Link, useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth";

export default function AppLayout() {
  const navigate = useNavigate();
  const logout = async () => {
    await authClient.signOut();

    navigate("/", {
      replace: true,
    });
  };

  return (
    <div className="
      h-screen
      flex
      flex-col
      bg-zinc-950
      text-white
      overflow-hidden
    ">
      {/* Navbar */}
      <nav className="
        h-10
        bg-zinc-900
        border-b
        border-zinc-800

        flex
        items-center
        justify-between

        px-4
      ">
        <div className="flex gap-4">
          <Link to="/dashboard" className="hover:text-blue-400 transition">
            Dashboard
          </Link>
        </div>

        <button
          onClick={logout}
          className="
            px-3
            py-1
            bg-red-700
            rounded
            cursor-pointer
          "
        >
          Logout
        </button>
      </nav>

      {/* Page Content */}
      <main className="
        flex-1
        flex
        flex-col
        overflow-hidden
        p-4
        min-h-0
      ">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="
        h-10
        bg-zinc-900
        border-t
        border-zinc-800

        flex
        items-center
        justify-center

        text-sm
      ">
        DKRH © 2026
      </footer>
    </div>
  );
}
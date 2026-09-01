import { Navigate, Outlet } from "react-router-dom";
import { authClient } from "@/lib/auth";

export default function GuestRoute() {
  const { data: session, isPending } =
    authClient.useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (session) {
    return <Navigate to="/servers" replace />;
  }

  return <Outlet />;
}
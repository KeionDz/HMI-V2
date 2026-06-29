import { useGetUserByIdQuery } from "@/client/queries/user-queries";
import DashboardPage from "@/components/pages/dashboard";
import { getStoredAuthUserId } from "@/lib/auth-storage";
import { Navigate } from "react-router-dom";

export function HomeRoute() {
  const userId = getStoredAuthUserId();
  const { data: user, isLoading } = useGetUserByIdQuery(userId);

  if (!userId) {
    return <DashboardPage />;
  }

  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        Loading dashboard...
      </main>
    );
  }

  if (user?.role?.toLowerCase() === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <DashboardPage />;
}

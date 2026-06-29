import { useEffect } from "react";
import { useGetUserByIdQuery } from "@/client/queries/user-queries";
import {
  clearStoredAuthUserId,
  getStoredAuthUserId,
} from "@/lib/auth-storage";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RouteProtection = () => {
  const location = useLocation();
  const userId = getStoredAuthUserId();
  const { data: user, error, isLoading } = useGetUserByIdQuery(userId);

  useEffect(() => {
    if (error) {
      clearStoredAuthUserId();
    }
  }, [error]);

  if (!userId) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        Checking access...
      </main>
    );
  }

  if (error) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role?.toLowerCase() !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default RouteProtection;

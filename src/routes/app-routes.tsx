import { Navigate, createBrowserRouter } from "react-router-dom";
import DashboardPage from "@/components/pages/dashboard";
import LoginPage from "@/components/pages/login-page";
import PhotoStitchingPage from "@/components/pages/photostitching";
import { RootLayout } from "@/components/layout/root-layout";
import AdminPage from "@/components/pages/admin-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "photo-stitching",
        element: <PhotoStitchingPage />,
      },
      {
        path: "admin",
        element: <AdminPage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

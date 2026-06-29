import { Navigate, createBrowserRouter } from "react-router-dom";
import DashboardPage from "@/components/pages/dashboard";
import LoginPage from "@/components/pages/login-page";
import PhotoStitchingPage from "@/components/pages/photostitching";
import { RootLayout } from "@/components/layout/root-layout";
import AdminPage from "@/components/pages/admin-page";
import CameraManagementPage from "@/components/pages/camera-management-page";
import RouteProtection from "@/lib/route-protection";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: "home",
        element: <DashboardPage />,
      },
      {
        path: "dashboard",
        element: <Navigate to="/home" replace />,
      },
      {
        path: "photo-stitching",
        element: <PhotoStitchingPage />,
      },
      {
        element: <RouteProtection />,
        children: [
          {
            path: "admin",
            element: <AdminPage />,
          },
          {
            path: "camera-management",
            element: <CameraManagementPage />,
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/home" replace />,
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

import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/layout/root-layout";
import Home from "@/components/pages/home";
import LoginPage from "@/components/pages/login-page";
import AdminPage from "@/components/pages/admin-page";

export const router = createBrowserRouter([
 {
  element: <RootLayout />,
  children: [
    { path: "/", element: <Home /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/admin", element: <AdminPage /> },
  ],
}
]);




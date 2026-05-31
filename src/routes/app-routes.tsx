import { createBrowserRouter } from "react-router-dom";

import Home from "@/components/pages/home";
import LoginPage from "@/components/pages/login-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
]);

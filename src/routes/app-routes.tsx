import { createBrowserRouter } from "react-router-dom";

import Home from "@/components/pages/home";
import LoginPage from "@/components/pages/login-page";
import PhotoStitchingPage from "@/components/pages/photostitching";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "/photo-stitching", 
    element: <PhotoStitchingPage />,
  },
]);

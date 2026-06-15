import { createBrowserRouter } from "react-router-dom";
import Home from "@/components/pages/home";
import LoginPage from "@/components/pages/login-page";
import PhotoStitchingPage from "@/components/pages/photostitching";
import { RootLayout } from "@/components/layout/root-layout"; 

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, 
    children: [
      {
        path: "", 
        element: <Home />,
      },
      {
        path: "photo-stitching", 
        element: <PhotoStitchingPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
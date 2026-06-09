import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { Separator } from "@/components/ui/separator";

export function RootLayout() {
  return (
    <div className="flex flex-col h-screen w-full bg-background">
      <Navbar />
      <Separator className="opacity-30" />
      <div className="flex flex-1 min-h-0">
        <Outlet />
      </div>
    </div>
  );
}
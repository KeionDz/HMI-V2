import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Link, useLocation } from "react-router-dom"
import { Camera, Home, Key, ImageIcon, LogOut } from "lucide-react"

export function Navbar() {
  const { pathname } = useLocation();

  //Check if user is logged in as admin
  const isAdminPage = pathname === "/admin"
  const navBaseClass =
    "flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 font-medium text-sm transition-colors";
  const navActiveClass =
    "bg-blue-600 border-blue-500 text-white hover:bg-blue-700";
  const navInactiveClass =
    "bg-transparent text-foreground hover:bg-zinc-900 hover:text-white";

  return (
    <header className="flex w-full items-center justify-between px-10 py-6 bg-background">
      <div className="font-bold text-2xl">
        EASTWORKS HMI
      </div>
      
      <NavigationMenu>
        <NavigationMenuList className="flex items-center gap-4">

          <NavigationMenuItem>
            <Link
              to="/photo-stitching"
              className={`${navBaseClass} ${
                pathname === "/photo-stitching" ? navActiveClass : navInactiveClass
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Photo Stitching
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link
              to="/camera-management"
              className={`${navBaseClass} ${
                pathname === "/camera-management" ? navActiveClass : navInactiveClass
              }`}
            >
              <Camera className="w-4 h-4" />
              Cameras
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link
              to="/"
              className={`${navBaseClass} ${
                pathname === "/" || pathname === "/dashboard"
                  ? navActiveClass
                  : navInactiveClass
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
          </NavigationMenuItem>
          
          {/* Dynamic button to check if user is on admin page, if not show admin button, if yes show logout button */}
          <NavigationMenuItem>
            <Link
              // Route to home or login page on logout, otherwise route to login
              to={isAdminPage ? "/" : "/login"}
              className={`${navBaseClass} ${
                pathname === "/login" || isAdminPage
                  ? navActiveClass
                  : navInactiveClass
              }`}
            >
              {isAdminPage ? (
                <>
                  <LogOut className="w-4 h-4" />
                  Logout
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  Admin
                </>
              )}
            </Link>
          </NavigationMenuItem>
          
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}

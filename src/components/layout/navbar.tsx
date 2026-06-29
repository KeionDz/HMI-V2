import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { useGetUserByIdQuery } from "@/client/queries/user-queries"
import {
  clearStoredAuthUserId,
  getStoredAuthUserId,
} from "@/lib/auth-storage"
import { Link, useLocation } from "react-router-dom"
import { Camera, Home, Key, ImageIcon, LogOut } from "lucide-react"

export function Navbar() {
  const { pathname } = useLocation();
  const userId = getStoredAuthUserId();
  const { data: user } = useGetUserByIdQuery(userId);

  //Check if user is logged in as admin
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const isAdminPage = pathname === "/admin"
  const isCameraManagementPage = pathname === "/camera-management"
  const isProtectedAdminPage = isAdminPage || isCameraManagementPage;
  const homePath = isAdmin ? "/admin" : "/home";
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

          {isAdmin && (
            <NavigationMenuItem>
              <Link
                to="/camera-management"
                className={`${navBaseClass} ${
                  isCameraManagementPage ? navActiveClass : navInactiveClass
                }`}
              >
                <Camera className="w-4 h-4" />
                Cameras
              </Link>
            </NavigationMenuItem>
          )}

          <NavigationMenuItem>
            <Link
              to={homePath}
              className={`${navBaseClass} ${
                pathname === "/" || pathname === "/home" || pathname === "/dashboard" || isAdminPage
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
              to={isProtectedAdminPage ? "/home" : isAdmin ? "/admin" : "/login"}
              onClick={isProtectedAdminPage ? clearStoredAuthUserId : undefined}
              className={`${navBaseClass} ${
                pathname === "/login" || isAdminPage
                  ? navActiveClass
                  : navInactiveClass
              }`}
            >
              {isProtectedAdminPage ? (
                <>
                  <LogOut className="w-4 h-4" />
                  Logout
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  {isAdmin ? "Dashboard" : "Admin"}
                </>
              )}
            </Link>
          </NavigationMenuItem>
          
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}

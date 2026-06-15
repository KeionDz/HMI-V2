import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Link, useLocation } from "react-router-dom"
import { Home, Key, ImageIcon, LogOut } from "lucide-react"

export function Navbar() {
  const { pathname } = useLocation();

  //Check if user is logged in as admin
  const isAdminPage = pathname === "/admin"

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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 font-medium text-sm transition-colors
                ${pathname === "/photo-stitching" ? "bg-muted text-foreground" : "bg-transparent text-foreground hover:bg-muted/50"}`}
            >
              <ImageIcon className="w-4 h-4" />
              Photo Stitching
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 font-medium text-sm transition-colors
                ${pathname === "/" ? "bg-chart-5 text-foreground" : "bg-transparent text-foreground hover:bg-muted/50"}`}
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 font-medium text-sm transition-colors
                ${pathname === "/login" || isAdminPage 
                  ? "bg-foreground text-background hover:bg-foreground/80" 
                  : "bg-transparent text-foreground hover:bg-muted/50 border-border/50"
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
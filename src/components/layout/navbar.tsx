import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import { Home, Key, ImageIcon } from "lucide-react"

export function Navbar() {
  return (
    <header className="flex w-full items-center justify-between px-10 py-6 bg-background">
      <div className="font-bold text-2xl">
        EASTWORKS HMI
      </div>
      
      <NavigationMenu>
        <NavigationMenuList className="flex items-center gap-4">

          <NavigationMenuItem>
             <a 
              href="/photo-stitching" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 bg-transparent text-foreground hover:bg-muted/50 font-medium text-sm transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
              Photo Stitching
            </a>
          </NavigationMenuItem>

          <NavigationMenuItem>
             <a 
              href="/" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 bg-chart-5 text-foreground hover:bg-muted/50 font-medium text-sm transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </a>
          </NavigationMenuItem>

          <NavigationMenuItem>
             <a 
              href="/login" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 bg-foreground text-background hover:bg-muted/50 font-medium text-sm transition-colors"
            >
              <Key className="w-4 h-4" />
              Admin
            </a>
          </NavigationMenuItem>
          
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}
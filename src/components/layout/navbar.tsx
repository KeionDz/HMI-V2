import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function Navbar() {
  return (
    <header className="flex w-full items-center justify-between px-6 py-4 border-b bg-background">
      <div className="font-bold text-xl">
        Eastworks HMI
      </div>
      
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <a href="/" className={navigationMenuTriggerStyle()}>
              Home
            </a>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
             <a href="/login" className={navigationMenuTriggerStyle()}>
              Admin
            </a>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Wallet,
  Settings,
  Crown,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: Receipt },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Budget", href: "/budget", icon: Wallet },
  { name: "Settings", href: "/settings", icon: Settings },
  // { name: "Premium", href: "/premium", icon: Crown },
]

export function Sidebar() {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      <div className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 transform bg-card border-r transition-transform duration-200 ease-in-out",
        "md:translate-x-0 md:sticky md:z-30",
        isCollapsed ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex h-16 items-center px-6 border-b">
          <h2 className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
            MoneyMind🧠
          </h2>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setIsCollapsed(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Mobile overlay */}
      {isCollapsed && (
        <div 
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsCollapsed(false)}
        />
      )}
    </>
  )
}
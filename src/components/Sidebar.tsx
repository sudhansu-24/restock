import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  BarChart3, 
  Lightbulb, 
  Settings,
  TrendingDown,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Inventory",
    href: "/inventory", 
    icon: Package,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "AI Insights",
    href: "/insights",
    icon: Brain,
  },
  {
    name: "Dead Stock",
    href: "/deadstock",
    icon: TrendingDown,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-gradient-dashboard">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary-light flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary-dark" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-dashboard-nav-foreground">
              SmartStock
            </h1>
            <p className="text-xs text-dashboard-nav-foreground/70">
              AI Dead Stock Manager
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-dashboard-nav-foreground/80 hover:text-dashboard-nav-foreground hover:bg-dashboard-nav-foreground/10"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 transition-colors",
                  isActive ? "text-primary-foreground" : "text-dashboard-nav-foreground/60"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-4">
        <div className="rounded-lg bg-dashboard-nav-foreground/10 p-3">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center">
              <span className="text-xs font-medium text-primary-dark">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-dashboard-nav-foreground truncate">
                Admin User
              </p>
              <p className="text-xs text-dashboard-nav-foreground/70 truncate">
                admin@smartstock.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
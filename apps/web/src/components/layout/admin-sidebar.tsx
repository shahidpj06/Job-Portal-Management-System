import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/utils/paths";
import { APP_CONFIG } from "@/utils/global-config";
import { useState } from "react";

const ADMIN_NAV = [
  { label: "Dashboard", href: PATHS.ADMIN.DASHBOARD, icon: LayoutDashboard },
  { label: "Jobs", href: PATHS.ADMIN.JOBS, icon: Briefcase },
  { label: "Profile", href: PATHS.ADMIN.PROFILE, icon: User },
];

export function AdminSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-border bg-surface transition-[width] duration-200",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <Link to={PATHS.HOME} className="flex items-center gap-2 text-lg font-bold text-primary">
            <Briefcase className="h-5 w-5 shrink-0" />
            {APP_CONFIG.name}
          </Link>
        )}
        {collapsed && (
          <Link to={PATHS.HOME} className="mx-auto">
            <Briefcase className="h-5 w-5 text-primary" />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-7 w-7 shrink-0", collapsed && "mx-auto")}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {ADMIN_NAV.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

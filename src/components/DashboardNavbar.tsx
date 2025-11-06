import { Bell, Search, User, LogOut, ChevronDown, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getRoleDisplayName } from "@/contexts/RoleContext";

interface DashboardNavbarProps {
  user: any;
  role: "pondok" | "super";
  pondokName?: string;
  onRoleSwitch?: () => void;
  onLogout?: () => void;
  isRoleSwitchEnabled?: boolean;
  onMenuClick?: () => void;
  showMobileMenuButton?: boolean;
}

export const DashboardNavbar = ({ user, role, pondokName = "Pondok Pesantren Al-Hikmah", onRoleSwitch, onLogout, isRoleSwitchEnabled = false, onMenuClick, showMobileMenuButton = false }: DashboardNavbarProps) => {
  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 sm:px-6 shadow-card sticky top-0 z-30">
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Menu Button */}
        {showMobileMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}

        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">
            {role === "pondok" ? pondokName : "Portal Pesantren Indonesia"}
          </h1>
          <span className="hidden sm:inline-flex px-3 py-1 text-xs font-medium bg-gradient-primary text-white rounded-full whitespace-nowrap">
            {role === "pondok" ? "Admin Pondok" : "Super Admin"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        {/* Search - Hidden on mobile, visible on md+ */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari..."
            className="pl-10 pr-4 py-2 w-48 lg:w-64 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Notification Button */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-10 px-2">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium hidden sm:block truncate">
                {user?.name || getRoleDisplayName(user?.role, role)}
              </span>
              <ChevronDown className="w-4 h-4 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Pengaturan
            </DropdownMenuItem>
            {isRoleSwitchEnabled && onRoleSwitch && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onRoleSwitch}>
                  Switch to {role === "pondok" ? "Super Admin View" : "Pondok Admin View"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs text-muted-foreground">
                  Current: {getRoleDisplayName(user?.role, role)}
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
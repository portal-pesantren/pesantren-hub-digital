import { Bell, Search, User, LogOut, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardNavbarProps {
  role: "pondok" | "super";
  pondokName?: string;
  onRoleSwitch?: () => void;
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

export const DashboardNavbar = ({ role, pondokName = "Pondok Pesantren Al-Hikmah", onRoleSwitch, onMenuToggle, showMenuButton = false }: DashboardNavbarProps) => {
  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-3 sm:px-4 md:px-6 shadow-card relative z-50">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        {/* Hamburger Menu Button for Mobile & Tablet */}
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden flex-shrink-0"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}

        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-elegant flex-shrink-0">
            <span className="text-white font-bold text-xs sm:text-sm">PP</span>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-foreground truncate">
              <span className="hidden sm:inline">Portal Pondok Pesantren</span>
              <span className="sm:hidden">Portal Pesantren</span>
            </h1>
            <p className="text-xs text-muted-foreground hidden md:block truncate">
              {role === "pondok" ? "Dashboard Pondok" : "Dashboard Super Admin"}
            </p>
          </div>
        </div>

        {role === "pondok" && (
          <span className="hidden sm:flex px-2 sm:px-3 py-1 text-xs font-medium bg-gradient-primary text-white rounded-full flex-shrink-0">
            <span className="hidden md:inline">Terverifikasi</span>
            <span className="md:hidden">✓</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
        {/* Search Bar - Hidden on mobile, visible on tablet+ */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari..."
            className="pl-7 sm:pl-10 pr-2 sm:pr-4 py-1.5 sm:py-2 w-32 sm:w-48 md:w-64 rounded-lg border bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Mobile Search Icon */}
        <Button variant="ghost" size="icon" className="sm:hidden">
          <Search className="w-4 h-4" />
          <span className="sr-only">Search</span>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative flex-shrink-0">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 h-8 sm:h-10 flex-shrink-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-medium hidden md:block truncate max-w-20">
                {role === "pondok" ? "Admin" : "Super Admin"}
              </span>
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 sm:w-56">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profil
            </DropdownMenuItem>
            {onRoleSwitch && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onRoleSwitch}>
                  Switch to {role === "pondok" ? "Super Admin" : "Pondok Admin"}
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

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
    <header className="h-14 sm:h-16 border-b bg-card flex items-center justify-between px-3 sm:px-4 md:px-6 shadow-card relative z-50">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        {/* Hamburger Menu Button for Mobile & Tablet - Touch Friendly */}
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden flex-shrink-0 touch-target"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}

        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-elegant flex-shrink-0">
            <span className="text-white font-bold text-xs sm:text-sm md:text-base">PP</span>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-responsive-sm sm:text-responsive-base md:text-responsive-lg font-bold text-foreground truncate">
              <span className="hidden xs:inline">Portal Pondok Pesantren</span>
              <span className="xs:hidden">Portal Pesantren</span>
            </h1>
            <p className="text-responsive-xs text-muted-foreground hidden md:block truncate">
              {role === "pondok" ? "Dashboard Pondok" : "Dashboard Super Admin"}
            </p>
          </div>
        </div>

        {role === "pondok" && (
          <span className="hidden sm:flex px-2 sm:px-3 py-1 text-responsive-xs font-medium bg-gradient-primary text-white rounded-full flex-shrink-0">
            <span className="hidden md:inline">Terverifikasi</span>
            <span className="md:hidden">✓</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
        {/* Search Bar - Hidden on mobile, visible on tablet+ */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari..."
            className="pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 w-32 sm:w-40 md:w-48 lg:w-64 rounded-lg border bg-background text-responsive-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Mobile Search Icon - Touch Friendly */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden touch-target-sm"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </Button>

        {/* Notifications - Touch Friendly */}
        <Button
          variant="ghost"
          size="icon"
          className="relative flex-shrink-0 touch-target-sm"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
        </Button>

        {/* User Menu - Touch Friendly */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3 h-10 sm:h-12 flex-shrink-0 touch-target"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-primary flex items-center justify-center">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-responsive-sm font-medium hidden md:block truncate max-w-24">
                {role === "pondok" ? "Admin" : "Super Admin"}
              </span>
              <ChevronDown className="w-4 h-4 hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 sm:w-56">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="touch-target">
              <User className="w-4 h-4 mr-2" />
              Profil
            </DropdownMenuItem>
            {onRoleSwitch && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onRoleSwitch} className="touch-target">
                  Switch to {role === "pondok" ? "Super Admin" : "Pondok Admin"}
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive touch-target">
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

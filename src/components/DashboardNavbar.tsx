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
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-6 shadow-card">
      <div className="flex items-center gap-4">
        {/* Hamburger Menu Button for Mobile */}
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-elegant">
            <span className="text-white font-bold text-sm">PP</span>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-foreground">
              Portal Pondok Pesantren
            </h1>
            <p className="text-xs text-muted-foreground hidden md:block">
              {role === "pondok" ? "Dashboard Pondok" : "Dashboard Super Admin"}
            </p>
          </div>
        </div>

        {role === "pondok" && (
          <span className="hidden sm:flex px-3 py-1 text-xs font-medium bg-gradient-primary text-white rounded-full">
            Terverifikasi
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari..."
            className="pl-10 pr-4 py-2 w-64 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium hidden md:block">
                {role === "pondok" ? "Admin Pondok" : "Super Admin"}
              </span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
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

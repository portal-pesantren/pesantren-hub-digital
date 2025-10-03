import { Bell, Search, User, LogOut, ChevronDown } from "lucide-react";
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
}

export const DashboardNavbar = ({ role, pondokName = "Pondok Pesantren Al-Hikmah", onRoleSwitch }: DashboardNavbarProps) => {
  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 shadow-card">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-foreground">
          {role === "pondok" ? pondokName : "Portal Pesantren Indonesia"}
        </h1>
        {role === "pondok" && (
          <span className="px-3 py-1 text-xs font-medium bg-gradient-primary text-white rounded-full">
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

import { 
  LayoutDashboard, 
  School, 
  Users, 
  Calendar, 
  FileText, 
  Image, 
  BarChart3,
  Settings,
  Shield,
  CheckCircle,
  Bell,
  Database
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  role: "pondok" | "super";
  currentPath?: string;
}

export const DashboardSidebar = ({ role, currentPath = "/" }: DashboardSidebarProps) => {
  const pondokMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: School, label: "Profile Pondok", path: "/profile" },
    { icon: Users, label: "Santri & Ustadz", path: "/people" },
    { icon: Calendar, label: "Kegiatan & Event", path: "/events" },
    { icon: FileText, label: "Berita & Artikel", path: "/news" },
    { icon: Image, label: "Galeri", path: "/gallery" },
    { icon: BarChart3, label: "Statistik", path: "/stats" },
    { icon: Settings, label: "Pengaturan", path: "/settings" },
  ];

  const superMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard Global", path: "/" },
    { icon: School, label: "Kelola Pondok", path: "/manage-pondok" },
    { icon: CheckCircle, label: "Verifikasi", path: "/verification" },
    { icon: Bell, label: "Notifikasi", path: "/notifications" },
    { icon: Shield, label: "Moderasi", path: "/moderation" },
    { icon: Database, label: "Backup & Restore", path: "/backup" },
    { icon: BarChart3, label: "Insight Global", path: "/global-insights" },
    { icon: Settings, label: "Konfigurasi Portal", path: "/portal-settings" },
  ];

  const menuItems = role === "pondok" ? pondokMenuItems : superMenuItems;

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-elegant">
            <School className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-sidebar-foreground">
              {role === "pondok" ? "Pondok Portal" : "Super Admin"}
            </h2>
            <p className="text-xs text-sidebar-foreground/70">
              {role === "pondok" ? "Admin Dashboard" : "Global Control"}
            </p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm"
                    : "text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavigationItem } from "@/types/navigation";

interface DashboardSidebarProps {
  navigation: NavigationItem[];
  currentPath?: string;
  role?: "pondok" | "super";
  onClose?: () => void; // For mobile drawer close functionality
}

export const DashboardSidebar = ({ navigation, currentPath = "/", onClose, role }: DashboardSidebarProps) => {
  const navigate = useNavigate();
  const isMobileDrawer = !!onClose;

  // Group navigation items by category
  const groupedNavigation = navigation.reduce((acc, item) => {
    const category = item.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobileDrawer) {
      onClose();
    }
  };

  // Category labels in Indonesian
  const categoryLabels: Record<string, string> = {
    main: 'Menu Utama',
    management: 'Manajemen',
    content: 'Konten',
    communication: 'Komunikasi',
    analytics: 'Analitik',
    system: 'Sistem',
    other: 'Lainnya'
  };

  const NavigationItemComponent = ({ item }: { item: NavigationItem }) => {
    if (item.isSeparator) {
      return <div className="my-2 border-t border-sidebar-border" />;
    }

    const Icon = item.icon;
    const isActive = currentPath === item.path;

    return (
      <button
        key={item.id}
        onClick={() => handleNavigation(item.path)}
        disabled={item.isDisabled}
        className={cn(
          "w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-lg transition-all duration-200 text-left touch-target relative",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm"
            : item.isDisabled
            ? "text-sidebar-foreground/50 cursor-not-allowed"
            : "text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm truncate">{item.label}</span>

        {item.badge && (
          <Badge
            variant={
              item.badge.color === 'error' ? 'destructive' :
              item.badge.color === 'warning' ? 'secondary' :
              item.badge.color === 'success' ? 'default' :
              'outline'
            }
            className="ml-auto text-xs px-2 py-0.5"
          >
            {item.badge.count}
          </Badge>
        )}
      </button>
    );
  };

  return (
    <aside className={cn(
      "w-64 bg-sidebar border-r border-sidebar-border flex flex-col",
      "h-screen lg:h-auto",
      isMobileDrawer && "fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out shadow-xl"
    )}>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Logo/Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-sidebar-foreground text-sm">
                Portal Pesantren
              </h1>
              <p className="text-xs text-sidebar-foreground/60">
                {role === 'super' ? 'Super Admin' : 'Admin Pondok'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {Object.entries(groupedNavigation).map(([category, items]) => {
            if (items.length === 0) return null;

            return (
              <div key={category} className="space-y-1">
                <h3 className="text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wide px-3">
                  {categoryLabels[category] || category}
                </h3>
                <div className="space-y-1">
                  {items.map((item) => (
                    <NavigationItemComponent key={item.id} item={item} />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="space-y-2">
            <div className="text-xs text-sidebar-foreground/50 text-center">
              © 2025 Portal Pondok Pesantren
            </div>
            <div className="flex items-center justify-center gap-1 text-xs text-sidebar-foreground/40">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
          </div>

          {/* Mobile close button */}
          {isMobileDrawer && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="w-full mt-2"
            >
              Tutup Menu
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
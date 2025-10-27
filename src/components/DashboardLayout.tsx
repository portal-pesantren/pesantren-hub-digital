import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardNavbar } from "@/components/DashboardNavbar";
import { useRole } from "@/contexts/RoleContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { role, switchRole } = useRole();
  const location = useLocation();
  const navigate = useNavigate();
  const [key, setKey] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Force re-render when role changes to ensure desktop layout updates
  useEffect(() => {
    setKey(prev => prev + 1);

    // Redirect to appropriate page when role changes
    if (role === "pondok") {
      // If switching to pondok role and on a super admin route, redirect to pondok dashboard
      const superAdminRoutes = [
        "/manage-pondok", "/verification", "/notifications",
        "/moderation", "/backup", "/global-insights",
        "/portal-settings", "/branding", "/activity-logs"
      ];
      if (superAdminRoutes.some(route => location.pathname.startsWith(route))) {
        navigate("/");
      }
    } else {
      // If switching to super admin role and on a pondok route, redirect to super admin dashboard
      const pondokRoutes = [
        "/profile", "/people", "/events", "/news",
        "/gallery", "/stats", "/settings"
      ];
      if (pondokRoutes.some(route => location.pathname.startsWith(route))) {
        navigate("/");
      }
    }
  }, [role, location.pathname, navigate]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div key={key} className="min-h-screen bg-background flex w-full">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <DashboardSidebar role={role} currentPath={location.pathname} />
      </div>

      {/* Mobile Sidebar - Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm border shadow-md"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar">
          <DashboardSidebar
            role={role}
            currentPath={location.pathname}
            onClose={() => setMobileMenuOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardNavbar
          role={role}
          onRoleSwitch={switchRole}
        />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardNavbar } from "@/components/DashboardNavbar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SidebarSkeleton, LoadingOverlay } from "@/components/LoadingStates";
import { PageTransition, FadeTransition } from "@/components/PageTransition";
import { RouteLoader } from "@/components/RouteLoader";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import { useRouteLoading } from "@/hooks/useRouteLoading";
import { getNavigationConfig } from "@/types/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const { role, switchRole, isRoleSwitchEnabled } = useRole();
  const location = useLocation();
  const navigate = useNavigate();
  const [key, setKey] = useState(0);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { LoadingOverlay: RouteLoadingOverlay, isLoading: isRouteLoading } = useRouteLoading({
    minLoadingTime: 400
  });

  // Get navigation configuration based on user role and UI role
  const navigation = user ? getNavigationConfig(user.role, role) : [];

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

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div key={key} className="min-h-screen bg-background flex w-full relative">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar - Desktop: Fixed width, Mobile: Slide-in drawer */}
      <div className={`
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 fixed lg:relative lg:block w-64 flex-shrink-0
        z-50 transition-transform duration-200 ease-in-out
      `}>
        <DashboardSidebar
          navigation={navigation}
          currentPath={location.pathname}
          role={role}
          onClose={closeMobileSidebar}
        />
      </div>

      {/* Main Content - Takes remaining space beside sidebar */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <DashboardNavbar
          user={user}
          role={role}
          onRoleSwitch={switchRole}
          onLogout={logout}
          isRoleSwitchEnabled={isRoleSwitchEnabled}
          onMenuClick={toggleMobileSidebar}
          showMobileMenuButton={true}
        />
        <RouteLoader isLoading={isRouteLoading} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {/* Breadcrumb */}
          <div className="mb-4">
            <Breadcrumb showHome={true} maxItems={4} />
          </div>

          {/* Page Content with proper width constraints */}
          <div className="w-full">
            <div className="max-w-none lg:max-w-6xl xl:max-w-7xl">
              <PageTransition location={location.pathname}>
                <RouteLoadingOverlay />
                {children}
              </PageTransition>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
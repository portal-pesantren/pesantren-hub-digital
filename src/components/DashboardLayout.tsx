import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardNavbar } from "@/components/DashboardNavbar";
import { useRole } from "@/contexts/RoleContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { role, switchRole } = useRole();
  const location = useLocation();
  const navigate = useNavigate();
  const [key, setKey] = useState(0);

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

  return (
    <div key={key} className="min-h-screen bg-background flex w-full">
      <DashboardSidebar role={role} currentPath={location.pathname} />
      <div className="flex-1 flex flex-col">
        <DashboardNavbar
          role={role}
          onRoleSwitch={switchRole}
        />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

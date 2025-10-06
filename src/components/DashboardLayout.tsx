import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardNavbar } from "@/components/DashboardNavbar";
import { useRole } from "@/contexts/RoleContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { role, switchRole } = useRole();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex w-full">
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

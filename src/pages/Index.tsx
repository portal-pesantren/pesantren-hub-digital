import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardNavbar } from "@/components/DashboardNavbar";
import { PondokDashboard } from "@/components/PondokDashboard";
import { SuperAdminDashboard } from "@/components/SuperAdminDashboard";

const Index = () => {
  const [role, setRole] = useState<"pondok" | "super">("pondok");

  const handleRoleSwitch = () => {
    setRole(prev => prev === "pondok" ? "super" : "pondok");
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar role={role} />
      <div className="flex-1 flex flex-col">
        <DashboardNavbar 
          role={role} 
          onRoleSwitch={handleRoleSwitch}
        />
        <main className="flex-1 p-6 overflow-y-auto">
          {role === "pondok" ? <PondokDashboard /> : <SuperAdminDashboard />}
        </main>
      </div>
    </div>
  );
};

export default Index;

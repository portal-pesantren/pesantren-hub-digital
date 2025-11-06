import { PondokDashboard } from "@/components/PondokDashboard";
import { SuperAdminDashboard } from "@/components/SuperAdminDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";

const Index = () => {
  const { user } = useAuth();
  const { role } = useRole();

  // Determine dashboard content based on user role and UI role
  const getDashboardContent = () => {
    // Super admin user with UI role 'super' - show Super Admin Dashboard
    if (user?.role === 'admin' && role === 'super') {
      return <SuperAdminDashboard />;
    }

    // All other cases show Pondok Dashboard:
    // - Super admin user with UI role 'pondok'
    // - Pondok admin users
    // - Parent users
    return <PondokDashboard />;
  };

  return (
    <div>
      {getDashboardContent()}
    </div>
  );
};

export default Index;

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

type Role = "pondok" | "super";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  switchRole: () => void;
  isRoleSwitchEnabled: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const ROLE_STORAGE_KEY = 'pesantren-hub-role';

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [role, setRoleState] = useState<Role>(() => {
    // Get role from localStorage on initial load
    const storedRole = localStorage.getItem(ROLE_STORAGE_KEY);
    return (storedRole as Role) || 'pondok';
  });

  // Determine if role switching is enabled based on user role
  const isRoleSwitchEnabled = user?.role === 'admin'; // Only super admins can switch roles

  // Auto-set role based on user role
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        // Admin can switch between 'super' and 'pondok' views
        // Keep current role or default to 'super'
        if (!localStorage.getItem(ROLE_STORAGE_KEY)) {
          setRoleState('super');
        }
      } else if (user.role === 'pesantren_admin') {
        // Pondok admin only gets 'pondok' view
        setRoleState('pondok');
      } else {
        // Parent role gets 'pondok' view
        setRoleState('pondok');
      }
    }
  }, [user]);

  const setRole = (newRole: Role) => {
    // Only allow role switching if enabled
    if (!isRoleSwitchEnabled) {
      console.warn('Role switching is not enabled for this user');
      return;
    }

    setRoleState(newRole);
    localStorage.setItem(ROLE_STORAGE_KEY, newRole);
  };

  const switchRole = () => {
    if (!isRoleSwitchEnabled) {
      console.warn('Role switching is not enabled for this user');
      return;
    }

    const newRole = role === 'pondok' ? 'super' : 'pondok';
    setRole(newRole);

    // Add visual feedback for role switching
    console.log(`Switching UI role from ${role} to ${newRole}`);

    // Trigger custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('roleChanged', {
      detail: { oldRole: role, newRole, userRole: user?.role }
    }));
  };

  useEffect(() => {
    // Sync localStorage when role changes (only if role switching is enabled)
    if (isRoleSwitchEnabled) {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
    }
  }, [role, isRoleSwitchEnabled]);

  return (
    <RoleContext.Provider value={{ role, setRole, switchRole, isRoleSwitchEnabled }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

// Helper function to get role display name
export const getRoleDisplayName = (userRole?: string, uiRole?: string): string => {
  if (!userRole) return 'Guest';

  switch (userRole) {
    case 'admin':
      return uiRole === 'super' ? 'Super Admin' : 'Admin Pondok';
    case 'pesantren_admin':
      return 'Admin Pondok';
    case 'parent':
      return 'Orang Tua';
    default:
      return 'User';
  }
};
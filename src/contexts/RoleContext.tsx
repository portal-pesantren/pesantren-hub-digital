import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Role = "pondok" | "super";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  switchRole: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const ROLE_STORAGE_KEY = 'pesantren-hub-role';

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [role, setRoleState] = useState<Role>(() => {
    // Get role from localStorage on initial load
    const storedRole = localStorage.getItem(ROLE_STORAGE_KEY);
    return (storedRole as Role) || 'pondok';
  });

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem(ROLE_STORAGE_KEY, newRole);
  };

  const switchRole = () => {
    const newRole = role === 'pondok' ? 'super' : 'pondok';
    setRole(newRole);

    // Add visual feedback for role switching
    console.log(`Switching role from ${role} to ${newRole}`);

    // Trigger custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('roleChanged', {
      detail: { oldRole: role, newRole }
    }));
  };

  useEffect(() => {
    // Sync localStorage when role changes
    localStorage.setItem(ROLE_STORAGE_KEY, role);
  }, [role]);

  return (
    <RoleContext.Provider value={{ role, setRole, switchRole }}>
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
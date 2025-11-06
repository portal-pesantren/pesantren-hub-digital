import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation } from '@tanstack/react-query';

// Types
export interface User {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone?: string;
  role: 'parent' | 'admin' | 'pesantren_admin';
  profile_picture?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
  occupation?: string;
  is_active: boolean;
  is_verified: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  last_login?: string;
  login_count: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  role?: 'parent' | 'pesantren_admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage key
const USER_KEY = 'pesantren_hub_user';

// Mock API functions
const authAPI = {
  login: async (credentials: LoginCredentials) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (credentials.email === 'admin@pesantren.id' && credentials.password === 'admin123') {
      return {
        success: true,
        data: {
          user: {
            id: '1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            name: 'Super Admin',
            email: 'admin@pesantren.id',
            role: 'admin' as const,
            is_active: true,
            is_verified: true,
            email_verified: true,
            phone_verified: false,
            login_count: 1
          }
        }
      };
    }

    if (credentials.email === 'pondok@pesantren.id' && credentials.password === 'pondok123') {
      return {
        success: true,
        data: {
          user: {
            id: '2',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            name: 'Admin Pondok',
            email: 'pondok@pesantren.id',
            role: 'pesantren_admin' as const,
            is_active: true,
            is_verified: true,
            email_verified: true,
            phone_verified: false,
            login_count: 1
          }
        }
      };
    }

    throw new Error('Email atau password salah');
  },

  register: async (userData: RegisterData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (userData.password !== userData.confirmPassword) {
      throw new Error('Password tidak cocok');
    }

    return {
      success: true,
      data: {
        user: {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role || 'parent' as const,
          is_active: true,
          is_verified: false,
          email_verified: false,
          phone_verified: false,
          login_count: 0
        }
      }
    };
  },

  getCurrentUser: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        return {
          success: true,
          data: userData
        };
      } catch (parseError) {
        console.warn('Failed to parse stored user data:', parseError);
      }
    }

    throw new Error('No user found');
  },

  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem(USER_KEY);
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);

            // Verify user in background
            const response = await authAPI.getCurrentUser();
            if (response.success) {
              setUser(response.data);
              localStorage.setItem(USER_KEY, JSON.stringify(response.data));
            }
          } catch (parseError) {
            console.warn('Failed to parse stored user data:', parseError);
            localStorage.removeItem(USER_KEY);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem(USER_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      if (response.success) {
        const { user } = response.data;
        setUser(user);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        console.log(`Selamat datang kembali, ${user.name}!`);
      }
    },
    onError: (error: Error) => {
      console.error('Login error:', error.message);
      throw error;
    }
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (response) => {
      if (response.success) {
        const { user } = response.data;
        setUser(user);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        console.log(`Pendaftaran berhasil! Selamat datang, ${user.name}`);
      }
    },
    onError: (error: Error) => {
      console.error('Register error:', error.message);
      throw error;
    }
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      setUser(null);
      localStorage.removeItem(USER_KEY);
    },
    onError: (error: Error) => {
      console.error('Logout failed:', error);
      // Force logout even if API call fails
      setUser(null);
      localStorage.removeItem(USER_KEY);
    }
  });

  // Auth methods
  const login = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (userData: RegisterData) => {
    await registerMutation.mutateAsync(userData);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const updateProfile = async (userData: Partial<User>) => {
    const updatedUser = { ...user, ...userData, updated_at: new Date().toISOString() } as User;
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  const changePassword = async (_currentPassword: string, _newPassword: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Password changed successfully');
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response.success) {
        setUser(response.data);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Additional hooks for role and permissions
export const useRole = () => {
  const { user } = useAuth();

  const hasRole = (role: string | string[]) => {
    if (!user) return false;

    if (Array.isArray(role)) {
      return role.includes(user.role);
    }

    return user.role === role;
  };

  const isAdmin = () => hasRole(['admin', 'pesantren_admin']);
  const isParent = () => hasRole('parent');
  const isPesantrenAdmin = () => hasRole('pesantren_admin');
  const isSuperAdmin = () => hasRole('admin');

  return {
    role: user?.role,
    hasRole,
    isAdmin,
    isParent,
    isPesantrenAdmin,
    isSuperAdmin,
  };
};

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: string | string[]) => {
    if (!user) return false;

    const rolePermissions = {
      admin: ['*'], // Admin has all permissions
      pesantren_admin: [
        'pesantren.read',
        'pesantren.update',
        'applications.read',
        'applications.update',
        'consultations.read',
        'consultations.update',
        'reviews.read',
        'reviews.moderate',
      ],
      parent: [
        'pesantren.read',
        'applications.create',
        'applications.read',
        'consultations.create',
        'consultations.read',
        'reviews.create',
        'reviews.read',
        'reviews.update',
      ],
    };

    const userPermissions = rolePermissions[user.role] || [];

    if (userPermissions.includes('*')) {
      return true;
    }

    if (Array.isArray(permission)) {
      return permission.some(p => userPermissions.includes(p));
    }

    return userPermissions.includes(permission);
  };

  return {
    hasPermission,
  };
};
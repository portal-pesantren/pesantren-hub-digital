import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { useNotification } from '@/contexts/NotificationContext';
import { SessionService, SessionConfig } from '@/services/sessionService';
import { APIClient } from '@/services/apiClient';
import { OfflineService } from '@/services/offlineService';

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

  // Enhanced session management methods
  refreshSession: () => Promise<boolean>;
  extendSession: () => void;
  getSessionState: () => any;
  isSessionValid: () => boolean;
  getSessionTimeRemaining: () => any;

  // API and offline services
  apiClient: APIClient;
  offlineService: OfflineService;

  // Session events
  onSessionEvent: (event: string, callback: Function) => () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const ACCESS_TOKEN_KEY = 'pesantren_hub_access_token';
const REFRESH_TOKEN_KEY = 'pesantren_hub_refresh_token';
const USER_KEY = 'pesantren_hub_user';

// Cache for API responses to avoid redundant requests
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache helper functions
const getCachedData = (key: string) => {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key: string, data: any) => {
  apiCache.set(key, { data, timestamp: Date.now() });
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock API functions (sesuaikan dengan API backend yang sebenarnya)
const authAPI = {
  login: async (credentials: LoginCredentials) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
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
          },
          tokens: {
            access_token: 'mock_access_token_' + Date.now(),
            refresh_token: 'mock_refresh_token_' + Date.now()
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
          },
          tokens: {
            access_token: 'mock_access_token_pondok_' + Date.now(),
            refresh_token: 'mock_refresh_token_pondok_' + Date.now()
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
        },
        tokens: {
          access_token: 'mock_access_token_new_' + Date.now(),
          refresh_token: 'mock_refresh_token_new_' + Date.now()
        }
      }
    };
  },

  refreshToken: async (refreshToken: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (refreshToken.startsWith('mock_refresh_token')) {
      return {
        success: true,
        data: {
          access_token: 'mock_access_token_refreshed_' + Date.now(),
          refresh_token: 'mock_refresh_token_refreshed_' + Date.now()
        }
      };
    }

    throw new Error('Invalid refresh token');
  },

  getCurrentUser: async (token: string) => {
    // Check cache first
    const cacheKey = `user_${token}`;
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    await new Promise(resolve => setTimeout(resolve, 300)); // Reduced delay

    if (token.startsWith('mock_access_token')) {
      // Get user data from storage or return mock data
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          const response = {
            success: true,
            data: userData
          };
          // Cache the response
          setCachedData(cacheKey, response);
          return response;
        } catch (parseError) {
          console.warn('Failed to parse stored user data:', parseError);
        }
      }
    }

    throw new Error('Invalid token');
  },

  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};

export const AuthProvider = React.memo<AuthProviderProps>(({
  children,
  sessionConfig,
  apiConfig
}: AuthProviderProps & {
  sessionConfig?: Partial<SessionConfig>;
  apiConfig?: { baseURL?: string; defaultHeaders?: Record<string, string> };
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError, handleSuccess, handleWarning } = useNotification();

  // Initialize services
  const [sessionService] = useState(() => SessionService.getInstance(sessionConfig));
  const [apiClient] = useState(() => APIClient.getInstance(apiConfig));
  const [offlineService] = useState(() => OfflineService.getInstance(apiClient));

  // Session event handlers
  useEffect(() => {
    const handleSessionInvalidated = ({ reason }: { reason: string }) => {
      console.log('Session invalidated:', reason);
      setUser(null);
      setIsLoading(false);

      if (reason === 'max_refresh_attempts' || reason === 'token_expired') {
        handleWarning('Your session has expired. Please login again.', 'Session Expired');
      }
    };

    const handleSessionInitialized = ({ userId }: { userId: string }) => {
      console.log('Session initialized for user:', userId);
    };

    const handleTokenRefreshed = () => {
      console.log('Token refreshed successfully');
    };

    const handleRefreshFailed = () => {
      console.warn('Token refresh failed');
    };

    const handleSessionTimeout = () => {
      handleWarning('Your session has timed out due to inactivity.', 'Session Timeout');
    };

    const handleSessionWarning = ({ type, message }: { type: string; message: string }) => {
      handleWarning(message, 'Session Warning');
    };

    // Register event listeners
    sessionService.on('session-invalidated', handleSessionInvalidated);
    sessionService.on('session-initialized', handleSessionInitialized);
    sessionService.on('token-refreshed', handleTokenRefreshed);
    sessionService.on('refresh-failed', handleRefreshFailed);
    sessionService.on('session-timeout', handleSessionTimeout);
    sessionService.on('session-warning', handleSessionWarning);

    return () => {
      sessionService.off('session-invalidated', handleSessionInvalidated);
      sessionService.off('session-initialized', handleSessionInitialized);
      sessionService.off('token-refreshed', handleTokenRefreshed);
      sessionService.off('refresh-failed', handleRefreshFailed);
      sessionService.off('session-timeout', handleSessionTimeout);
      sessionService.off('session-warning', handleSessionWarning);
    };
  }, [sessionService, handleWarning]);

  // Initialize auth state with enhanced session management
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if session is already valid
        const isSessionValid = sessionService.isSessionValid();
        const sessionState = sessionService.getSessionState();

        if (isSessionValid && sessionState.userId) {
          // Session is valid, try to get user data
          const tokens = sessionService.getStoredTokens();
          if (tokens) {
            try {
              setUser(JSON.parse(localStorage.getItem(USER_KEY) || '{}'));
              setIsLoading(false);

              // Verify session in background
              const response = await authAPI.getCurrentUser(tokens.accessToken);
              if (response.success) {
                setUser(response.data);
                localStorage.setItem(USER_KEY, JSON.stringify(response.data));
              } else {
                // Session invalid, invalidate it
                sessionService.invalidateSession('invalid_token');
              }
            } catch (parseError) {
              console.warn('Failed to parse stored user data:', parseError);
              sessionService.invalidateSession('parse_error');
            }
          }
        } else {
          // Session is invalid, clear everything
          sessionService.invalidateSession('init_invalid');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        sessionService.invalidateSession('init_error');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [sessionService]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Services will be cleaned up when their destroy methods are called
    };
  }, []);

  // Login mutation with enhanced session management
  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      if (response.success) {
        const { user, tokens } = response.data;
        setUser(user);
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        // Initialize session with new tokens
        sessionService.initializeSession(
          user.id,
          {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
          },
          false // rememberMe will be handled separately
        );

        handleSuccess(`Selamat datang kembali, ${user.name}!`);
      }
    },
    onError: (error: Error) => {
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes('password') || errorMessage.includes('email')) {
        handleError(error, 'Login Gagal - Periksa Kembali Data Anda');
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        handleError(new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'), 'Masalah Koneksi');
      } else {
        handleError(error, 'Login Gagal');
      }
      throw error;
    }
  });

  // Register mutation with enhanced session management
  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (response) => {
      if (response.success) {
        const { user, tokens } = response.data;
        setUser(user);
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        // Initialize session with new tokens
        sessionService.initializeSession(
          user.id,
          {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
          },
          false
        );

        handleSuccess(`Pendaftaran berhasil! Selamat datang, ${user.name}`);
      }
    },
    onError: (error: Error) => {
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes('password')) {
        handleError(error, 'Registrasi Gagal - Password Tidak Sesuai');
      } else if (errorMessage.includes('email')) {
        handleError(error, 'Registrasi Gagal - Email Sudah Digunakan');
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        handleError(new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'), 'Masalah Koneksi');
      } else {
        handleError(error, 'Registrasi Gagal');
      }
      throw error;
    }
  });

  // Logout mutation with session cleanup
  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      setUser(null);
      sessionService.invalidateSession('manual');
      offlineService.destroy();
    },
    onError: (error: Error) => {
      console.error('Logout failed:', error);
      // Force logout even if API call fails
      setUser(null);
      sessionService.invalidateSession('logout_error');
      offlineService.destroy();
    }
  });

  // Enhanced auth methods
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
    // Mock update profile with session extension
    const updatedUser = { ...user, ...userData, updated_at: new Date().toISOString() } as User;
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

    // Extend session when profile is updated
    sessionService.extendSession();
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    // Mock change password with session management
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Password changed successfully');

    // Extend session after password change
    sessionService.extendSession();
  };

  const refreshUser = async () => {
    const tokens = sessionService.getStoredTokens();
    if (tokens) {
      try {
        const response = await authAPI.getCurrentUser(tokens.accessToken);
        if (response.success) {
          setUser(response.data);
          localStorage.setItem(USER_KEY, JSON.stringify(response.data));
          sessionService.extendSession();
        }
      } catch (error) {
        console.error('Failed to refresh user:', error);
        // If user refresh fails, session might be invalid
        if (sessionService.isSessionExpired()) {
          sessionService.invalidateSession('user_refresh_failed');
        }
      }
    }
  };

  // Enhanced session management methods
  const refreshSession = useCallback(async (): Promise<boolean> => {
    return sessionService.refreshSession();
  }, [sessionService]);

  const extendSession = useCallback((): void => {
    sessionService.extendSession();
  }, [sessionService]);

  const getSessionState = useCallback(() => {
    return sessionService.getSessionState();
  }, [sessionService]);

  const isSessionValid = useCallback((): boolean => {
    return sessionService.isSessionValid();
  }, [sessionService]);

  const getSessionTimeRemaining = useCallback(() => {
    return sessionService.getSessionTimeRemaining();
  }, [sessionService]);

  const onSessionEvent = useCallback((event: string, callback: Function) => {
    sessionService.on(event, callback);
    return () => sessionService.off(event, callback);
  }, [sessionService]);

  const isAuthenticated = !!user && sessionService.isSessionValid();

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

        // Enhanced session management methods
        refreshSession,
        extendSession,
        getSessionState,
        isSessionValid,
        getSessionTimeRemaining,

        // API and offline services
        apiClient,
        offlineService,

        // Session events
        onSessionEvent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
});

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
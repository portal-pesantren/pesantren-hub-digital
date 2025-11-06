import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, useRole } from '@/contexts/AuthContext';
import { AuthLoading } from '@/components/LoadingStates';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  fallbackPath?: string;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
  requirePondokAdmin?: boolean;
  requireParent?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallbackPath = '/login',
  requireAdmin = false,
  requireSuperAdmin = false,
  requirePondokAdmin = false,
  requireParent = false,
}) => {
  const { isLoading, isAuthenticated } = useAuth();
  const { hasRole, isSuperAdmin, isAdmin, isPesantrenAdmin, isParent } = useRole();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return <AuthLoading />;
  }

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return (
      <Navigate
        to={`${fallbackPath}?returnUrl=${returnUrl}`}
        replace
        state={{ from: location }}
      />
    );
  }

  // Check specific role requirements
  if (requireSuperAdmin && !isSuperAdmin()) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{
          message: 'Anda tidak memiliki akses sebagai Super Admin',
          from: location
        }}
      />
    );
  }

  if (requireAdmin && !isAdmin()) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{
          message: 'Anda tidak memiliki akses sebagai Admin',
          from: location
        }}
      />
    );
  }

  if (requirePondokAdmin && !isPesantrenAdmin()) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{
          message: 'Anda tidak memiliki akses sebagai Admin Pondok',
          from: location
        }}
      />
    );
  }

  if (requireParent && !isParent()) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{
          message: 'Anda tidak memiliki akses sebagai Orang Tua',
          from: location
        }}
      />
    );
  }

  // Check specific role requirements
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{
          message: 'Anda tidak memiliki role yang sesuai untuk mengakses halaman ini',
          from: location
        }}
      />
    );
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};

// Hook for checking specific routes
export const useRouteAccess = (requiredRole?: string | string[]) => {
  const { isAuthenticated } = useAuth();
  const { hasRole } = useRole();

  const hasAccess = isAuthenticated && (!requiredRole || hasRole(requiredRole));

  return {
    hasAccess,
    isAuthenticated,
    hasRequiredRole: !requiredRole || hasRole(requiredRole),
  };
};

// HOC for wrapping components
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: string | string[]
) => {
  return (props: P) => (
    <ProtectedRoute requiredRole={requiredRole}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

export default ProtectedRoute;
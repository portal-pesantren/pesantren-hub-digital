import React from 'react';
import { Loader2, Shield, CheckCircle } from 'lucide-react';

// Full page loading component for authentication checks
export const AuthLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <h1 className="text-xl font-semibold text-foreground mb-2">
            Portal Pesantren
          </h1>
          <p className="text-sm text-muted-foreground">
            Sistem Manajemen Pondok Pesantren Terpadu
          </p>
        </div>

        {/* Loading indicator */}
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Memeriksa autentikasi...
            </p>
            <p className="text-xs text-muted-foreground">
              Mohon tunggu sebentar, kami sedang memverifikasi identitas Anda
            </p>
          </div>
        </div>

        {/* Loading steps */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Menghubungkan ke server...</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Memverifikasi sesi login...</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Memuat data pengguna...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact loading for inline use
export const InlineLoading: React.FC<{
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({
  message = "Memuat...",
  size = 'md',
  className = ""
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {message && (
        <span className="text-sm text-muted-foreground">{message}</span>
      )}
    </div>
  );
};

// Skeleton loading for cards
export const CardSkeleton: React.FC = () => {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
        <div className="h-3 bg-muted rounded w-1/2 animate-pulse"></div>
      </div>
      <div className="space-y-2">
        <div className="h-8 bg-muted rounded w-full animate-pulse"></div>
        <div className="h-8 bg-muted rounded w-2/3 animate-pulse"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
        <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
      </div>
    </div>
  );
};

// Skeleton loading for tables
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 6
}) => {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border bg-card p-4">
        <div className="grid gap-4">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="h-4 bg-muted rounded animate-pulse"
                  style={{
                    width: colIndex === 0 ? '2rem' : colIndex === columns - 1 ? '4rem' : '100%'
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Skeleton loading for sidebar navigation
export const SidebarSkeleton: React.FC = () => {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-muted rounded-lg animate-pulse"></div>
          <div className="space-y-1">
            <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
            <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-6">
        <div className="space-y-1">
          <div className="h-4 bg-muted rounded w-20 animate-pulse mb-3"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
              <div className="w-5 h-5 bg-muted rounded animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
};

// Loading overlay for modals and content areas
export const LoadingOverlay: React.FC<{
  message?: string;
  isVisible: boolean;
  children?: React.ReactNode;
}> = ({ message = "Memuat...", isVisible, children }) => {
  if (!isVisible) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {children && (
        <div className="opacity-30 pointer-events-none">
          {children}
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg">
        <div className="text-center p-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
};

// Success animation for completed operations
export const SuccessAnimation: React.FC<{ message?: string; onComplete?: () => void }> = ({
  message = "Berhasil!",
  onComplete
}) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex items-center justify-center p-4">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <p className="text-sm font-medium text-foreground">{message}</p>
      </div>
    </div>
  );
};
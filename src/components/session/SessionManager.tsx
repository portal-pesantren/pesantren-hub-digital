/**
 * Session Manager Component
 * Main component that orchestrates all session management UI
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from '@/hooks/useSession';
import { useSessionHealth } from '@/hooks/useSession';
import SessionWarningDialog from './SessionWarningDialog';
import SessionExpiredDialog from './SessionExpiredDialog';
import SessionStatusIndicator from './SessionStatusIndicator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SessionManagerProps {
  showWarning?: boolean;
  showStatus?: boolean;
  statusPosition?: 'header' | 'sidebar';
  warningTime?: number;
  statusCompact?: boolean;
}

export const SessionManager: React.FC<SessionManagerProps> = ({
  showWarning = true,
  showStatus = true,
  statusPosition = 'header',
  warningTime = 5 * 60 * 1000, // 5 minutes
  statusCompact = false,
}) => {
  const { isAuthenticated } = useAuth();
  const { isValid, isExpired, refreshSession } = useSession();
  const { healthStatus, performHealthCheck } = useSessionHealth({
    enabled: isAuthenticated,
    interval: 60000, // Check every minute
    onHealthy: () => {
      console.log('Session health check passed');
    },
    onUnhealthy: (reason) => {
      console.warn('Session health check failed:', reason);
      toast.error('Session health issue detected', {
        description: reason,
        action: {
          label: 'Check',
          onClick: performHealthCheck,
        },
      });
    },
  });

  const [sessionExpiredDialog, setSessionExpiredDialog] = useState<{
    open: boolean;
    reason?: 'timeout' | 'token_expired' | 'manual' | 'max_refresh_attempts';
  }>({ open: false });

  // Listen to session events
  const { onSessionEvent } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const cleanupFunctions = [
      onSessionEvent('session-expired', ({ reason }: { reason: string }) => {
        setSessionExpiredDialog({
          open: true,
          reason: reason as any,
        });
      }),

      onSessionEvent('session-timeout', () => {
        setSessionExpiredDialog({
          open: true,
          reason: 'timeout',
        });
      }),

      onSessionEvent('session-invalidated', ({ reason }: { reason: string }) => {
        if (reason === 'max_refresh_attempts' || reason === 'token_expired') {
          setSessionExpiredDialog({
            open: true,
            reason: reason as any,
          });
        }
      }),

      onSessionEvent('refresh-failed', ({ attempts, maxAttempts }: { attempts: number; maxAttempts: number }) => {
        if (attempts >= maxAttempts) {
          toast.error('Session refresh failed', {
            description: 'Maximum refresh attempts reached. Please login again.',
          });
        } else {
          toast.warning('Session refresh failed', {
            description: `Attempt ${attempts}/${maxAttempts}. Retrying...`,
          });
        }
      }),

      onSessionEvent('token-refreshed', () => {
        // Optional: Show subtle notification that session was refreshed
        console.log('Session token refreshed successfully');
      }),

      onSessionEvent('session-warning', ({ type, message }: { type: string; message: string }) => {
        if (type === 'timeout') {
          toast.warning('Session warning', {
            description: message,
          });
        }
      }),
    ];

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [isAuthenticated, onSessionEvent]);

  // Handle session expiration dialog close
  const handleExpiredDialogClose = () => {
    setSessionExpiredDialog({ open: false });
  };

  // Handle session extension
  const handleSessionExtend = async () => {
    try {
      const success = await refreshSession();
      if (success) {
        toast.success('Session extended', {
          description: 'Your session has been extended successfully.',
        });
      } else {
        toast.error('Failed to extend session', {
          description: 'Please try again or login again.',
        });
      }
    } catch (error) {
      console.error('Failed to extend session:', error);
      toast.error('Failed to extend session', {
        description: 'An unexpected error occurred.',
      });
    }
  };

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Session Status Indicator */}
      {showStatus && (
        <SessionStatusIndicator
          position={statusPosition}
          compact={statusCompact}
          showDetails={true}
        />
      )}

      {/* Session Warning Dialog */}
      {showWarning && (
        <SessionWarningDialog
          warningTime={warningTime}
          enabled={!isExpired}
          onExtend={handleSessionExtend}
          onLogout={() => {
            setSessionExpiredDialog({ open: true, reason: 'manual' });
          }}
        />
      )}

      {/* Session Expired Dialog */}
      <SessionExpiredDialog
        open={sessionExpiredDialog.open}
        reason={sessionExpiredDialog.reason}
        onRelogin={handleExpiredDialogClose}
        onLogout={handleExpiredDialogClose}
      />

      {/* Session Health Indicator (for development/debug) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-background border rounded-lg p-2 text-xs space-y-1">
            <div className="flex items-center gap-2">
              <div className={cn(
                'w-2 h-2 rounded-full',
                healthStatus === 'healthy' ? 'bg-green-500' :
                healthStatus === 'unhealthy' ? 'bg-red-500' :
                'bg-yellow-500'
              )} />
              <span>Health: {healthStatus}</span>
            </div>
            <div>Valid: {isValid ? 'Yes' : 'No'}</div>
            <div>Expired: {isExpired ? 'Yes' : 'No'}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionManager;
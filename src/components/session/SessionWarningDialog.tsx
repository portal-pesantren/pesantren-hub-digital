/**
 * Session Warning Dialog Component
 * Shows warnings when session is about to expire due to inactivity
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, RefreshCw, LogOut, AlertTriangle } from 'lucide-react';
import { useSessionTimeout } from '@/hooks/useSession';
import { useAuth } from '@/contexts/AuthContext';

interface SessionWarningDialogProps {
  warningTime?: number; // milliseconds before timeout
  enabled?: boolean;
  onExtend?: () => void;
  onLogout?: () => void;
}

export const SessionWarningDialog: React.FC<SessionWarningDialogProps> = ({
  warningTime = 5 * 60 * 1000, // 5 minutes
  enabled = true,
  onExtend,
  onLogout,
}) => {
  const { timeRemaining, isWarning, extend, dismissWarning } = useSessionTimeout({
    warningTime,
    onWarning: (time) => {
      console.log('Session warning triggered:', time);
    },
    onTimeout: () => {
      console.log('Session timeout occurred');
      handleLogout();
    },
    enabled,
  });

  const { logout } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isExtending, setIsExtending] = useState(false);

  // Calculate remaining time in seconds
  const remainingSeconds = Math.max(0, Math.floor(timeRemaining.activity / 1000));
  const remainingMinutes = Math.floor(remainingSeconds / 60);
  const remainingSecondsDisplay = remainingSeconds % 60;

  // Format time display
  const formatTime = (seconds: number): string => {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  };

  // Handle dialog open/close
  useEffect(() => {
    if (isWarning && remainingSeconds > 0) {
      setIsDialogOpen(true);
    } else {
      setIsDialogOpen(false);
    }
  }, [isWarning, remainingSeconds]);

  // Update progress bar
  useEffect(() => {
    const totalTime = warningTime / 1000;
    const currentProgress = (remainingSeconds / totalTime) * 100;
    setProgress(Math.max(0, Math.min(100, currentProgress)));
  }, [remainingSeconds, warningTime]);

  // Handle session extension
  const handleExtend = async () => {
    setIsExtending(true);
    try {
      extend();
      onExtend?.();
      dismissWarning();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to extend session:', error);
    } finally {
      setIsExtending(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      onLogout?.();
      await logout();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  // Auto-dismiss if session is extended from elsewhere
  useEffect(() => {
    if (!isWarning) {
      setIsDialogOpen(false);
    }
  }, [isWarning]);

  if (!enabled) {
    return null;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Session Timeout Warning
          </DialogTitle>
          <DialogDescription>
            Your session will expire due to inactivity. Please extend your session or logout to continue.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Time remaining display */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {formatTime(remainingSeconds)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {remainingMinutes > 0 ? `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}` : ''}{' '}
              {remainingSecondsDisplay > 0 ? `${remainingSecondsDisplay} second${remainingSecondsDisplay !== 1 ? 's' : ''}` : ''}
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Time remaining</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress
              value={progress}
              className={`h-2 ${progress < 20 ? '[&>div]:bg-red-500' : progress < 50 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}`}
            />
          </div>

          {/* Warning message */}
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              {remainingMinutes > 2
                ? "Your session will expire soon. Click 'Extend Session' to continue working."
                : "Your session is about to expire! Extend now or you will be logged out."
              }
            </AlertDescription>
          </Alert>

          {/* Action buttons */}
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full sm:w-auto"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout Now
            </Button>
            <Button
              onClick={handleExtend}
              disabled={isExtending}
              className="w-full sm:w-auto"
            >
              {isExtending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Extending...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Extend Session
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionWarningDialog;
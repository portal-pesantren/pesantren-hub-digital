/**
 * Session Expired Dialog Component
 * Shows when session has expired and user needs to re-login
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SessionExpiredDialogProps {
  open: boolean;
  reason?: 'timeout' | 'token_expired' | 'manual' | 'max_refresh_attempts';
  onRelogin?: () => void;
  onLogout?: () => void;
}

export const SessionExpiredDialog: React.FC<SessionExpiredDialogProps> = ({
  open,
  reason = 'timeout',
  onRelogin,
  onLogout,
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get appropriate messages based on reason
  const getDialogContent = () => {
    switch (reason) {
      case 'timeout':
        return {
          title: 'Session Timed Out',
          description: 'Your session has expired due to inactivity. For your security, please login again.',
          message: 'You were automatically logged out after a period of inactivity.',
        };
      case 'token_expired':
        return {
          title: 'Session Expired',
          description: 'Your authentication session has expired. Please login again to continue.',
          message: 'Your session token has expired and could not be refreshed automatically.',
        };
      case 'max_refresh_attempts':
        return {
          title: 'Session Expired',
          description: 'Unable to refresh your session. Please login again to continue.',
          message: 'Multiple attempts to refresh your session failed. Please login again.',
        };
      default:
        return {
          title: 'Session Ended',
          description: 'Your session has ended. Please login again to continue.',
          message: 'Your session has been terminated for security reasons.',
        };
    }
  };

  const { title, description, message } = getDialogContent();

  const handleRelogin = () => {
    onRelogin?.();
    navigate('/login');
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      onLogout?.();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
      // Navigate to login even if logout fails
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => { /* Prevent closing */ }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Additional message */}
          <Alert variant="default">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>

          {/* Security reminder */}
          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Security Reminder
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              This automatic logout helps protect your account when you're away from your device.
            </p>
          </div>

          {/* Action buttons */}
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full sm:w-auto"
            >
              {isLoggingOut ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Logging Out...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Go to Login
                </>
              )}
            </Button>
            <Button
              onClick={handleRelogin}
              className="w-full sm:w-auto"
            >
              Login Again
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionExpiredDialog;
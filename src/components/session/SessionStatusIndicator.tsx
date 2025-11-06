/**
 * Session Status Indicator Component
 * Shows real-time session status and provides quick actions
 */

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Clock,
  Wifi,
  WifiOff,
  RefreshCw,
  Activity,
  LogOut,
  Shield,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface SessionStatusIndicatorProps {
  showDetails?: boolean;
  position?: 'header' | 'sidebar';
  compact?: boolean;
}

export const SessionStatusIndicator: React.FC<SessionStatusIndicatorProps> = ({
  showDetails = true,
  position = 'header',
  compact = false,
}) => {
  const { session, isValid, isExpired, timeRemaining, isRefreshing } = useSession();
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate status
  const getStatus = () => {
    if (!isValid || isExpired) {
      return {
        variant: 'destructive' as const,
        label: 'Expired',
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-100 dark:bg-red-900/20',
      };
    }

    if (isRefreshing) {
      return {
        variant: 'secondary' as const,
        label: 'Refreshing',
        icon: RefreshCw,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      };
    }

    if (timeRemaining.activity < 5 * 60 * 1000) { // Less than 5 minutes
      return {
        variant: 'outline' as const,
        label: 'Warning',
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      };
    }

    return {
      variant: 'default' as const,
      label: 'Active',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    };
  };

  const status = getStatus();
  const remainingMinutes = Math.floor(timeRemaining.activity / 60000);
  const remainingSeconds = Math.floor((timeRemaining.activity % 60000) / 1000);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRefresh = async () => {
    // Session refresh is handled automatically by the session service
    console.log('Manual session refresh requested');
  };

  const handleLogout = async () => {
    await logout();
  };

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn(
              'flex items-center gap-2 px-2 py-1 rounded-full text-xs',
              status.bgColor,
              status.color
            )}>
              <status.icon className="h-3 w-3" />
              <span>{formatTime(timeRemaining.activity)}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Session: {status.label}</p>
            <p>Time remaining: {formatTime(timeRemaining.activity)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={cn(
      'flex items-center gap-2',
      position === 'header' ? 'h-8' : 'w-full'
    )}>
      {/* Status badge */}
      <Badge
        variant={status.variant}
        className={cn(
          'flex items-center gap-1',
          status.color,
          status.bgColor
        )}
      >
        <status.icon className="h-3 w-3" />
        {showDetails && <span>{status.label}</span>}
      </Badge>

      {/* Time remaining */}
      {showDetails && isValid && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{formatTime(timeRemaining.activity)}</span>
        </div>
      )}

      {/* Actions dropdown */}
      {showDetails && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Activity className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {/* User info */}
            {user && (
              <>
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user.name}
                </div>
                <div className="px-2 py-1 text-xs text-muted-foreground">
                  {user.email}
                </div>
                <DropdownMenuSeparator />
              </>
            )}

            {/* Session info */}
            <div className="px-2 py-1.5 text-sm">
              <div className="flex items-center justify-between">
                <span>Status:</span>
                <Badge variant={status.variant} className="scale-75">
                  {status.label}
                </Badge>
              </div>
            </div>

            <div className="px-2 py-1.5 text-sm">
              <div className="flex items-center justify-between">
                <span>Time remaining:</span>
                <span className="font-mono">{formatTime(timeRemaining.activity)}</span>
              </div>
            </div>

            <div className="px-2 py-1.5 text-sm">
              <div className="flex items-center justify-between">
                <span>Device:</span>
                <span className="text-xs text-muted-foreground font-mono">
                  {session.deviceFingerprint.slice(0, 8)}...
                </span>
              </div>
            </div>

            <DropdownMenuSeparator />

            {/* Session statistics */}
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              <div>Session started: {new Date(session.sessionStart).toLocaleTimeString()}</div>
              <div>Activity events: {session.refreshAttempts}</div>
            </div>

            <DropdownMenuSeparator />

            {/* Actions */}
            <DropdownMenuItem onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
              Refresh Session
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Security info */}
            <DropdownMenuItem disabled>
              <Shield className="h-4 w-4 mr-2" />
              <span className="text-xs">Session secured</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default SessionStatusIndicator;
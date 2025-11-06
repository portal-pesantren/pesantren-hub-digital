/**
 * React hooks for session management and monitoring
 * Provides easy integration with SessionService for React components
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { SessionService, SessionState, ActivityEvent } from '@/services/sessionService';

// Hook options
interface UseSessionOptions {
  listenToEvents?: boolean;
  autoRefresh?: boolean;
  showWarnings?: boolean;
  checkInterval?: number;
}

// Session monitoring hook return type
interface UseSessionReturn {
  session: SessionState;
  isValid: boolean;
  isExpired: boolean;
  timeRemaining: {
    total: number;
    activity: number;
    token: number;
  };
  isRefreshing: boolean;
  analytics: {
    sessionDuration: number;
    activityEvents: number;
    pageViews: number;
    lastActivity: number;
    deviceFingerprint: string;
  };
  refresh: () => Promise<boolean>;
  extend: () => void;
  invalidate: (reason?: string) => void;
  activities: ActivityEvent[];
}

/**
 * Main session monitoring hook
 */
export const useSession = (options: UseSessionOptions = {}): UseSessionReturn => {
  const {
    listenToEvents = true,
    autoRefresh = false,
    showWarnings = true,
    checkInterval = 1000,
  } = options;

  const sessionService = SessionService.getInstance();
  const [session, setSession] = useState<SessionState>(sessionService.getSessionState());
  const [isValid, setIsValid] = useState(sessionService.isSessionValid());
  const [isExpired, setIsExpired] = useState(sessionService.isSessionExpired());
  const [timeRemaining, setTimeRemaining] = useState(sessionService.getSessionTimeRemaining());
  const [isRefreshing, setIsRefreshing] = useState(sessionService.getSessionState().isRefreshing);
  const [analytics, setAnalytics] = useState(sessionService.getSessionAnalytics());

  // Refs to prevent stale closures
  const sessionServiceRef = useRef(sessionService);
  const optionsRef = useRef(options);

  // Update refs when values change
  useEffect(() => {
    sessionServiceRef.current = sessionService;
    optionsRef.current = options;
  }, [sessionService, options]);

  // Update session state
  const updateSessionState = useCallback(() => {
    const currentSession = sessionServiceRef.current.getSessionState();
    const currentIsValid = sessionServiceRef.current.isSessionValid();
    const currentIsExpired = sessionServiceRef.current.isSessionExpired();
    const currentTimeRemaining = sessionServiceRef.current.getSessionTimeRemaining();
    const currentAnalytics = sessionServiceRef.current.getSessionAnalytics();

    setSession(currentSession);
    setIsValid(currentIsValid);
    setIsExpired(currentIsExpired);
    setTimeRemaining(currentTimeRemaining);
    setIsRefreshing(currentSession.isRefreshing);
    setAnalytics(currentAnalytics);
  }, []);

  // Refresh session
  const refresh = useCallback(async (): Promise<boolean> => {
    const success = await sessionServiceRef.current.refreshSession();
    updateSessionState();
    return success;
  }, [updateSessionState]);

  // Extend session
  const extend = useCallback(() => {
    sessionServiceRef.current.extendSession();
    updateSessionState();
  }, [updateSessionState]);

  // Invalidate session
  const invalidate = useCallback((reason?: string) => {
    sessionServiceRef.current.invalidateSession(reason);
    updateSessionState();
  }, [updateSessionState]);

  // Get activities (mock implementation - in real app would come from SessionService)
  const activities: ActivityEvent[] = [];

  // Setup event listeners
  useEffect(() => {
    if (!listenToEvents) return;

    const handleSessionEvent = () => {
      updateSessionState();
    };

    const events = [
      'session-initialized',
      'session-invalidated',
      'session-expired',
      'session-timeout',
      'session-extended',
      'token-refreshed',
      'refresh-failed',
      'session-warning',
    ];

    events.forEach(event => {
      sessionService.on(event, handleSessionEvent);
    });

    return () => {
      events.forEach(event => {
        sessionService.off(event, handleSessionEvent);
      });
    };
  }, [listenToEvents, sessionService, updateSessionState]);

  // Periodic session state check
  useEffect(() => {
    if (!autoRefresh || checkInterval <= 0) return;

    const interval = setInterval(() => {
      updateSessionState();
    }, checkInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, checkInterval, updateSessionState]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateSessionState();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [updateSessionState]);

  // Initial state update
  useEffect(() => {
    updateSessionState();
  }, [updateSessionState]);

  return {
    session,
    isValid,
    isExpired,
    timeRemaining,
    isRefreshing,
    analytics,
    refresh,
    extend,
    invalidate,
    activities,
  };
};

// Session timeout warning hook
interface UseSessionTimeoutOptions {
  warningTime?: number; // milliseconds before timeout
  onWarning?: (timeRemaining: number) => void;
  onTimeout?: () => void;
  enabled?: boolean;
}

export const useSessionTimeout = (options: UseSessionTimeoutOptions = {}) => {
  const { warningTime = 5 * 60 * 1000, onWarning, onTimeout, enabled = true } = options;
  const { timeRemaining, isValid, extend } = useSession({ checkInterval: 5000 });
  const warningShown = useRef(false);
  const timeoutHandled = useRef(false);

  useEffect(() => {
    if (!enabled || !isValid) return;

    // Reset flags when session becomes valid
    warningShown.current = false;
    timeoutHandled.current = false;
  }, [isValid, enabled]);

  useEffect(() => {
    if (!enabled || !isValid) return;

    // Check for timeout warning
    if (timeRemaining.activity <= warningTime && !warningShown.current) {
      warningShown.current = true;
      onWarning?.(timeRemaining.activity);
    }

    // Check for timeout
    if (timeRemaining.activity <= 0 && !timeoutHandled.current) {
      timeoutHandled.current = true;
      onTimeout?.();
    }
  }, [timeRemaining, isValid, warningTime, onWarning, onTimeout, enabled]);

  const dismissWarning = useCallback(() => {
    warningShown.current = false;
  }, []);

  return {
    timeRemaining,
    isWarning: timeRemaining.activity <= warningTime && timeRemaining.activity > 0,
    isTimeout: timeRemaining.activity <= 0,
    extend,
    dismissWarning,
  };
};

// Session activity hook
interface UseActivityTrackingOptions {
  trackPageViews?: boolean;
  trackClicks?: boolean;
  trackScrolls?: boolean;
  debounceTime?: number;
}

export const useActivityTracking = (options: UseActivityTrackingOptions = {}) => {
  const {
    trackPageViews = true,
    trackClicks = true,
    trackScrolls = false,
    debounceTime = 1000,
  } = options;

  const sessionService = SessionService.getInstance();
  const [activityCount, setActivityCount] = useState(0);
  const lastActivityRef = useRef(Date.now());
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  const recordActivity = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;

    // Debounce activity updates
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setActivityCount(prev => prev + 1);
    }, debounceTime);

    // Record in session service
    sessionService.extendSession();
  }, [sessionService, debounceTime]);

  useEffect(() => {
    if (!trackClicks) return;

    const handleClick = () => recordActivity();
    const handleKeyPress = () => recordActivity();

    document.addEventListener('click', handleClick, { passive: true });
    document.addEventListener('keypress', handleKeyPress, { passive: true });

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keypress', handleKeyPress);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [trackClicks, recordActivity]);

  useEffect(() => {
    if (!trackScrolls) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => recordActivity(), 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [trackScrolls, recordActivity]);

  // Track page views
  useEffect(() => {
    if (!trackPageViews) return;

    recordActivity();
  }, [trackPageViews, recordActivity]);

  return {
    activityCount,
    lastActivity: lastActivityRef.current,
    recordActivity,
  };
};

// Session health check hook
interface UseSessionHealthOptions {
  interval?: number; // milliseconds
  onHealthy?: () => void;
    onUnhealthy?: (reason: string) => void;
  enabled?: boolean;
}

export const useSessionHealth = (options: UseSessionHealthOptions = {}) => {
  const { interval = 30000, onHealthy, onUnhealthy, enabled = true } = options;
  const { isValid, isExpired, refresh } = useSession();
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'unhealthy' | 'checking'>('healthy');
  const [lastCheck, setLastCheck] = useState(Date.now());
  const [issues, setIssues] = useState<string[]>([]);

  const performHealthCheck = useCallback(async () => {
    if (!enabled) return;

    setHealthStatus('checking');
    const newIssues: string[] = [];

    // Check session validity
    if (!isValid) {
      newIssues.push('Session is invalid');
    }

    // Check expiration
    if (isExpired) {
      newIssues.push('Session has expired');
    }

    // Check token refresh capability
    try {
      const refreshSuccess = await refresh();
      if (!refreshSuccess) {
        newIssues.push('Token refresh failed');
      }
    } catch (error) {
      newIssues.push('Token refresh error');
    }

    // Check local storage availability
    try {
      localStorage.setItem('health_check', 'test');
      localStorage.removeItem('health_check');
    } catch (error) {
      newIssues.push('Local storage unavailable');
    }

    setIssues(newIssues);
    setLastCheck(Date.now());

    if (newIssues.length === 0) {
      setHealthStatus('healthy');
      onHealthy?.();
    } else {
      setHealthStatus('unhealthy');
      onUnhealthy?.(newIssues.join(', '));
    }
  }, [enabled, isValid, isExpired, refresh, onHealthy, onUnhealthy]);

  useEffect(() => {
    if (!enabled) return;

    // Initial health check
    performHealthCheck();

    // Periodic health checks
    const checkInterval = setInterval(performHealthCheck, interval);

    return () => clearInterval(checkInterval);
  }, [enabled, interval, performHealthCheck]);

  return {
    healthStatus,
    lastCheck,
    issues,
    performHealthCheck,
  };
};

// Session persistence hook for multi-tab synchronization
export const useSessionSync = () => {
  const sessionService = SessionService.getInstance();
  const { isValid, session } = useSession();

  useEffect(() => {
    // Listen for storage events from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'pesantren_hub_session_state') {
        // Session state changed in another tab
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Broadcast session events to other tabs
  const broadcastEvent = useCallback((eventType: string, data?: any) => {
    const event = new CustomEvent('session-event', {
      detail: { eventType, data, timestamp: Date.now() }
    });
    window.dispatchEvent(event);

    // Also use localStorage for cross-tab communication
    localStorage.setItem('session_event', JSON.stringify({
      eventType,
      data,
      timestamp: Date.now()
    }));
  }, []);

  useEffect(() => {
    // Listen for session events from other tabs
    const handleSessionEvent = (event: CustomEvent) => {
      console.log('Session event from another tab:', event.detail);
    };

    window.addEventListener('session-event', handleSessionEvent as EventListener);
    return () => window.removeEventListener('session-event', handleSessionEvent as EventListener);
  }, []);

  return {
    isValid,
    session,
    broadcastEvent,
  };
};

// Session recovery hook for offline/online scenarios
export const useSessionRecovery = () => {
  const { isValid, refresh } = useSession();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [recoveryAttempts, setRecoveryAttempts] = useState(0);
  const [lastRecovery, setLastRecovery] = useState<Date | null>(null);

  const attemptRecovery = useCallback(async () => {
    if (!isOnline) return false;

    setRecoveryAttempts(prev => prev + 1);

    try {
      // Attempt to refresh the session
      const success = await refresh();
      if (success) {
        setLastRecovery(new Date());
        setRecoveryAttempts(0);
        return true;
      }
    } catch (error) {
      console.error('Session recovery failed:', error);
    }

    return false;
  }, [isOnline, refresh]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Attempt recovery when coming back online
      if (!isValid) {
        attemptRecovery();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isValid, attemptRecovery]);

  return {
    isOnline,
    isValid,
    recoveryAttempts,
    lastRecovery,
    attemptRecovery,
  };
};

export default useSession;
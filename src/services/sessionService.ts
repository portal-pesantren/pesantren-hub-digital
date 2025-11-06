/**
 * Comprehensive Session Management Service
 * Handles token refresh, session state, security, and user experience features
 */

// Types
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface SessionState {
  isAuthenticated: boolean;
  userId: string | null;
  lastActivity: number;
  sessionStart: number;
  expiresAt: number | null;
  warningsShown: boolean[];
  isActive: boolean;
  isRefreshing: boolean;
  refreshAttempts: number;
  deviceFingerprint: string;
}

export interface SessionConfig {
  // Token timing (in milliseconds)
  accessTokenLifetime: number; // 15 minutes
  refreshTokenLifetime: number; // 7 days
  refreshBuffer: number; // 5 minutes before expiry
  sessionTimeout: number; // 30 minutes of inactivity
  warningTime: number; // 5 minutes before session timeout

  // Security settings
  maxRefreshAttempts: number;
  refreshCooldown: number; // 30 seconds between failed attempts
  csrfProtection: boolean;
  rateLimitEnabled: boolean;

  // User experience
  showWarnings: boolean;
  autoLogout: boolean;
  rememberMeDuration: number; // 30 days
}

export interface QueuedRequest {
  id: string;
  execute: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (reason: any) => void;
  timestamp: number;
  retryCount: number;
}

export interface ActivityEvent {
  type: 'mouse' | 'keyboard' | 'touch' | 'scroll' | 'focus' | 'click';
  timestamp: number;
  page: string;
}

// Default configuration
const DEFAULT_CONFIG: SessionConfig = {
  accessTokenLifetime: 15 * 60 * 1000, // 15 minutes
  refreshTokenLifetime: 7 * 24 * 60 * 60 * 1000, // 7 days
  refreshBuffer: 5 * 60 * 1000, // 5 minutes
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  warningTime: 5 * 60 * 1000, // 5 minutes
  maxRefreshAttempts: 3,
  refreshCooldown: 30 * 1000, // 30 seconds
  csrfProtection: true,
  rateLimitEnabled: true,
  showWarnings: true,
  autoLogout: true,
  rememberMeDuration: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'pesantren_hub_access_token',
  REFRESH_TOKEN: 'pesantren_hub_refresh_token',
  SESSION_STATE: 'pesantren_hub_session_state',
  DEVICE_FINGERPRINT: 'pesantren_hub_device_fp',
  ACTIVITY_LOG: 'pesantren_hub_activity',
  REMEMBER_ME: 'pesantren_hub_remember',
} as const;

export class SessionService {
  private static instance: SessionService;
  private config: SessionConfig;
  private state: SessionState;
  private refreshPromise: Promise<boolean> | null = null;
  private requestQueue: QueuedRequest[] = [];
  private refreshTimer: NodeJS.Timeout | null = null;
  private activityTimer: NodeJS.Timeout | null = null;
  private warningTimer: NodeJS.Timeout | null = null;
  private lastRefreshAttempt: number = 0;
  private eventListeners: Map<string, Function[]> = new Map();
  private activityEvents: ActivityEvent[] = [];
  private rateLimitMap = new Map<string, { count: number; resetTime: number }>();

  private constructor(config: Partial<SessionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.state = this.initializeState();
    this.setupActivityMonitoring();
    this.startSessionTimers();
  }

  public static getInstance(config?: Partial<SessionConfig>): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService(config);
    }
    return SessionService.instance;
  }

  /**
   * Initialize session state from storage or create new session
   */
  private initializeState(): SessionState {
    try {
      const storedState = localStorage.getItem(STORAGE_KEYS.SESSION_STATE);
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        // Validate and restore state
        if (this.isValidSessionState(parsedState)) {
          return {
            ...parsedState,
            isActive: true,
            isRefreshing: false,
            warningsShown: [],
          };
        }
      }
    } catch (error) {
      console.warn('Failed to restore session state:', error);
      this.clearStorage();
    }

    // Create new session state
    return {
      isAuthenticated: false,
      userId: null,
      lastActivity: Date.now(),
      sessionStart: Date.now(),
      expiresAt: null,
      warningsShown: [],
      isActive: false,
      isRefreshing: false,
      refreshAttempts: 0,
      deviceFingerprint: this.generateDeviceFingerprint(),
    };
  }

  /**
   * Generate a unique device fingerprint for security
   */
  private generateDeviceFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }

    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas?.toDataURL() || '',
      !!window.sessionStorage,
      !!window.localStorage,
    ].join('|');

    return btoa(fingerprint).slice(0, 32);
  }

  /**
   * Validate session state structure
   */
  private isValidSessionState(state: any): boolean {
    return (
      typeof state === 'object' &&
      typeof state.isAuthenticated === 'boolean' &&
      typeof state.lastActivity === 'number' &&
      typeof state.sessionStart === 'number' &&
      typeof state.refreshAttempts === 'number' &&
      typeof state.deviceFingerprint === 'string'
    );
  }

  /**
   * Setup activity monitoring for session timeout detection
   */
  private setupActivityMonitoring(): void {
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    const handleActivity = (event: Event) => {
      this.recordActivity(event.type as ActivityEvent['type']);
    };

    activityEvents.forEach(eventType => {
      document.addEventListener(eventType, handleActivity, { passive: true });
    });

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.recordActivity('focus');
      }
    });
  }

  /**
   * Record user activity and update session state
   */
  private recordActivity(type: ActivityEvent['type']): void {
    const now = Date.now();
    this.state.lastActivity = now;

    // Add to activity log (keep last 100 events)
    this.activityEvents.push({
      type,
      timestamp: now,
      page: window.location.pathname,
    });

    if (this.activityEvents.length > 100) {
      this.activityEvents = this.activityEvents.slice(-100);
    }

    // Save activity log to storage for persistence across tabs
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOG, JSON.stringify(this.activityEvents));
    } catch (error) {
      console.warn('Failed to save activity log:', error);
    }

    this.saveState();
    this.resetActivityTimer();
  }

  /**
   * Start session management timers
   */
  private startSessionTimers(): void {
    // Token refresh timer
    this.scheduleNextRefresh();

    // Activity timeout timer
    this.resetActivityTimer();

    // Session warning timer
    this.scheduleWarningCheck();
  }

  /**
   * Schedule next token refresh
   */
  private scheduleNextRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const tokens = this.getStoredTokens();
    if (!tokens?.accessToken) {
      return;
    }

    try {
      // Parse JWT payload to get expiry (mock implementation)
      const payload = this.parseTokenPayload(tokens.accessToken);
      const expiresAt = payload.exp * 1000; // Convert to milliseconds
      const refreshAt = expiresAt - this.config.refreshBuffer;
      const delay = Math.max(0, refreshAt - Date.now());

      this.refreshTimer = setTimeout(() => {
        this.performTokenRefresh();
      }, delay);
    } catch (error) {
      console.warn('Failed to schedule token refresh:', error);
      // Fallback: refresh every 10 minutes
      this.refreshTimer = setTimeout(() => {
        this.performTokenRefresh();
      }, 10 * 60 * 1000);
    }
  }

  /**
   * Reset activity timeout timer
   */
  private resetActivityTimer(): void {
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
    }

    if (!this.state.isAuthenticated) {
      return;
    }

    this.activityTimer = setTimeout(() => {
      this.handleSessionTimeout();
    }, this.config.sessionTimeout);
  }

  /**
   * Schedule session expiration warning
   */
  private scheduleWarningCheck(): void {
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
    }

    if (!this.config.showWarnings || !this.state.isAuthenticated) {
      return;
    }

    const warningAt = this.state.lastActivity + this.config.sessionTimeout - this.config.warningTime;
    const delay = Math.max(0, warningAt - Date.now());

    this.warningTimer = setTimeout(() => {
      this.showSessionWarning();
    }, delay);
  }

  /**
   * Parse JWT token payload (mock implementation)
   */
  private parseTokenPayload(token: string): any {
    try {
      // In a real implementation, you'd use a proper JWT library
      // This is a mock implementation for demonstration
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        return payload;
      }
    } catch (error) {
      console.warn('Failed to parse token payload:', error);
    }

    // Fallback: assume token expires in 15 minutes from now
    return {
      exp: Math.floor(Date.now() / 1000) + (15 * 60),
      iat: Math.floor(Date.now() / 1000),
    };
  }

  /**
   * Perform automatic token refresh
   */
  private async performTokenRefresh(): Promise<boolean> {
    // Prevent concurrent refresh attempts
    if (this.state.isRefreshing) {
      return this.refreshPromise || false;
    }

    // Rate limiting check
    const now = Date.now();
    if (now - this.lastRefreshAttempt < this.config.refreshCooldown) {
      console.warn('Token refresh rate limited');
      return false;
    }

    // Check refresh attempts
    if (this.state.refreshAttempts >= this.config.maxRefreshAttempts) {
      console.error('Max refresh attempts reached');
      this.handleMaxRefreshAttemptsReached();
      return false;
    }

    this.state.isRefreshing = true;
    this.state.refreshAttempts++;
    this.lastRefreshAttempt = now;
    this.saveState();

    this.refreshPromise = this.doTokenRefresh();

    try {
      const success = await this.refreshPromise;

      if (success) {
        this.state.refreshAttempts = 0;
        this.processQueuedRequests();
        this.emit('token-refreshed', { timestamp: now });
      } else {
        this.handleRefreshFailure();
      }

      return success;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.handleRefreshFailure();
      return false;
    } finally {
      this.state.isRefreshing = false;
      this.refreshPromise = null;
      this.saveState();
      this.scheduleNextRefresh();
    }
  }

  /**
   * Execute the actual token refresh API call
   */
  private async doTokenRefresh(): Promise<boolean> {
    const tokens = this.getStoredTokens();
    if (!tokens?.refreshToken) {
      console.error('No refresh token available');
      return false;
    }

    try {
      // In a real implementation, this would be an actual API call
      const response = await this.mockRefreshAPI(tokens.refreshToken);

      if (response.success) {
        const newTokens = response.data;
        this.storeTokens(newTokens);
        this.state.expiresAt = Date.now() + this.config.accessTokenLifetime;
        this.saveState();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Refresh API call failed:', error);
      return false;
    }
  }

  /**
   * Mock refresh API (replace with actual API implementation)
   */
  private async mockRefreshAPI(refreshToken: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (refreshToken.startsWith('mock_refresh_token')) {
      return {
        success: true,
        data: {
          accessToken: 'mock_access_token_refreshed_' + Date.now(),
          refreshToken: 'mock_refresh_token_refreshed_' + Date.now(),
        },
      };
    }

    return { success: false, error: 'Invalid refresh token' };
  }

  /**
   * Handle token refresh failure
   */
  private handleRefreshFailure(): void {
    this.emit('refresh-failed', {
      attempts: this.state.refreshAttempts,
      maxAttempts: this.config.maxRefreshAttempts
    });

    if (this.state.refreshAttempts >= this.config.maxRefreshAttempts) {
      this.handleMaxRefreshAttemptsReached();
    }
  }

  /**
   * Handle maximum refresh attempts reached
   */
  private handleMaxRefreshAttemptsReached(): void {
    console.error('Maximum refresh attempts reached, logging out');
    this.emit('session-expired', { reason: 'max_refresh_attempts' });
    this.invalidateSession('max_refresh_attempts');
  }

  /**
   * Process queued requests after successful token refresh
   */
  private processQueuedRequests(): void {
    const queue = this.requestQueue.splice(0);

    queue.forEach(request => {
      try {
        request.execute()
          .then(request.resolve)
          .catch(request.reject);
      } catch (error) {
        request.reject(error);
      }
    });
  }

  /**
   * Handle session timeout due to inactivity
   */
  private handleSessionTimeout(): void {
    console.log('Session timed out due to inactivity');
    this.emit('session-timeout', {
      lastActivity: this.state.lastActivity,
      timeoutDuration: this.config.sessionTimeout
    });

    if (this.config.autoLogout) {
      this.invalidateSession('inactivity');
    }
  }

  /**
   * Show session expiration warning
   */
  private showSessionWarning(): void {
    if (!this.config.showWarnings || this.state.warningsShown.includes('timeout')) {
      return;
    }

    this.state.warningsShown.push('timeout');
    this.saveState();

    this.emit('session-warning', {
      type: 'timeout',
      timeRemaining: this.config.warningTime,
      message: 'Session will expire due to inactivity',
    });
  }

  /**
   * Rate limiting check for API calls
   */
  private checkRateLimit(endpoint: string): boolean {
    if (!this.config.rateLimitEnabled) {
      return true;
    }

    const key = endpoint;
    const now = Date.now();
    const windowStart = now - 60000; // 1-minute window
    const limit = 60; // 60 requests per minute

    const current = this.rateLimitMap.get(key);
    if (!current || now > current.resetTime) {
      this.rateLimitMap.set(key, { count: 1, resetTime: now + 60000 });
      return true;
    }

    if (current.count >= limit) {
      return false;
    }

    current.count++;
    return true;
  }

  /**
   * Store tokens securely
   */
  public storeTokens(tokens: TokenPair): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      localStorage.setItem(STORAGE_KEYS.DEVICE_FINGERPRINT, this.state.deviceFingerprint);
    } catch (error) {
      console.error('Failed to store tokens:', error);
      throw new Error('Token storage failed');
    }
  }

  /**
   * Get stored tokens
   */
  public getStoredTokens(): TokenPair | null {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (accessToken && refreshToken) {
        return { accessToken, refreshToken };
      }
    } catch (error) {
      console.warn('Failed to retrieve tokens:', error);
    }

    return null;
  }

  /**
   * Clear all stored tokens and session data
   */
  public clearStorage(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  }

  /**
   * Save session state to storage
   */
  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSION_STATE, JSON.stringify(this.state));
    } catch (error) {
      console.warn('Failed to save session state:', error);
    }
  }

  /**
   * Queue a request during token refresh
   */
  public queueRequest<T>(executeFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const request: QueuedRequest = {
        id: Date.now().toString() + Math.random(),
        execute: executeFn,
        resolve,
        reject,
        timestamp: Date.now(),
        retryCount: 0,
      };

      this.requestQueue.push(request);

      // Remove old requests (older than 30 seconds)
      const cutoff = Date.now() - 30000;
      this.requestQueue = this.requestQueue.filter(r => r.timestamp > cutoff);
    });
  }

  /**
   * Initialize session with user data
   */
  public initializeSession(userId: string, tokens: TokenPair, rememberMe: boolean = false): void {
    const now = Date.now();

    this.state = {
      isAuthenticated: true,
      userId,
      lastActivity: now,
      sessionStart: now,
      expiresAt: now + this.config.accessTokenLifetime,
      warningsShown: [],
      isActive: true,
      isRefreshing: false,
      refreshAttempts: 0,
      deviceFingerprint: this.state.deviceFingerprint,
    };

    this.storeTokens(tokens);
    this.saveState();
    this.startSessionTimers();

    // Set remember me flag
    try {
      if (rememberMe) {
        localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
        localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, new Date(now + this.config.rememberMeDuration).toISOString());
      } else {
        localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
      }
    } catch (error) {
      console.warn('Failed to set remember me:', error);
    }

    this.emit('session-initialized', { userId, timestamp: now });
  }

  /**
   * Invalidate current session
   */
  public invalidateSession(reason: string = 'manual'): void {
    this.emit('session-invalidated', { reason, timestamp: Date.now() });

    // Clear timers
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    if (this.activityTimer) clearTimeout(this.activityTimer);
    if (this.warningTimer) clearTimeout(this.warningTimer);

    // Clear state and storage
    this.state = this.initializeState();
    this.clearStorage();

    // Reject queued requests
    this.requestQueue.forEach(request => {
      request.reject(new Error('Session invalidated'));
    });
    this.requestQueue = [];
  }

  /**
   * Refresh session manually
   */
  public async refreshSession(): Promise<boolean> {
    return this.performTokenRefresh();
  }

  /**
   * Extend session (reset activity timer)
   */
  public extendSession(): void {
    this.recordActivity('focus');
    this.emit('session-extended', { timestamp: Date.now() });
  }

  /**
   * Get current session state
   */
  public getSessionState(): SessionState {
    return { ...this.state };
  }

  /**
   * Check if session is valid
   */
  public isSessionValid(): boolean {
    return (
      this.state.isAuthenticated &&
      this.state.isActive &&
      this.getStoredTokens() !== null &&
      !this.isSessionExpired()
    );
  }

  /**
   * Check if session has expired
   */
  public isSessionExpired(): boolean {
    const now = Date.now();
    const inactiveTime = now - this.state.lastActivity;

    // Check activity timeout
    if (inactiveTime > this.config.sessionTimeout) {
      return true;
    }

    // Check token expiry (mock implementation)
    const tokens = this.getStoredTokens();
    if (tokens) {
      try {
        const payload = this.parseTokenPayload(tokens.accessToken);
        return payload.exp * 1000 < now;
      } catch (error) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get session time remaining
   */
  public getSessionTimeRemaining(): {
    total: number;
    activity: number;
    token: number;
  } {
    const now = Date.now();

    return {
      total: this.state.sessionStart ? (this.state.sessionStart + 24 * 60 * 60 * 1000) - now : 0, // 24 hours total
      activity: this.config.sessionTimeout - (now - this.state.lastActivity),
      token: this.state.expiresAt ? this.state.expiresAt - now : 0,
    };
  }

  /**
   * Event management
   */
  public on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  public off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in session event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    if (this.activityTimer) clearTimeout(this.activityTimer);
    if (this.warningTimer) clearTimeout(this.warningTimer);

    this.eventListeners.clear();
    this.requestQueue = [];
    this.rateLimitMap.clear();
  }

  /**
   * Get session analytics
   */
  public getSessionAnalytics(): {
    sessionDuration: number;
    activityEvents: number;
    pageViews: number;
    lastActivity: number;
    deviceFingerprint: string;
  } {
    const now = Date.now();
    const sessionDuration = now - this.state.sessionStart;

    const pageViews = this.activityEvents.filter(e => e.type === 'focus').length;

    return {
      sessionDuration,
      activityEvents: this.activityEvents.length,
      pageViews,
      lastActivity: this.state.lastActivity,
      deviceFingerprint: this.state.deviceFingerprint,
    };
  }
}

export default SessionService;
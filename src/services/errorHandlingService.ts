/**
 * Comprehensive Error Handling and Logging Service
 * Provides centralized error handling, logging, and reporting capabilities
 */

// Types
export interface ErrorLogEntry {
  id: string;
  timestamp: number;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  category: 'auth' | 'session' | 'api' | 'ui' | 'network' | 'storage' | 'general';
  message: string;
  details?: any;
  stack?: string;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  fingerprint?: string;
  context?: Record<string, any>;
  resolved?: boolean;
  reported?: boolean;
}

export interface ErrorHandlingConfig {
  enableLogging: boolean;
  enableReporting: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  maxLogEntries: number;
  reportInterval: number;
  reportEndpoint?: string;
  enableUserFeedback: boolean;
  enableRetry: boolean;
  maxRetries: number;
  retryDelay: number;
}

export interface ErrorCategory {
  name: string;
  color: string;
  icon: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class ErrorHandlingService {
  private static instance: ErrorHandlingService;
  private config: ErrorHandlingConfig;
  private logs: ErrorLogEntry[] = [];
  private errorCategories: Map<string, ErrorCategory> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();
  private reportTimer: NodeJS.Timeout | null = null;
  private retryMap = new Map<string, { count: number; lastAttempt: number }>();

  private constructor(config: Partial<ErrorHandlingConfig> = {}) {
    this.config = {
      enableLogging: true,
      enableReporting: false,
      logLevel: 'info',
      maxLogEntries: 1000,
      reportInterval: 5 * 60 * 1000, // 5 minutes
      enableUserFeedback: true,
      enableRetry: true,
      maxRetries: 3,
      retryDelay: 1000,
      ...config,
    };

    this.initializeErrorCategories();
    this.setupGlobalErrorHandlers();
    this.startPeriodicReporting();
    this.loadPersistedLogs();
  }

  public static getInstance(config?: Partial<ErrorHandlingConfig>): ErrorHandlingService {
    if (!ErrorHandlingService.instance) {
      ErrorHandlingService.instance = new ErrorHandlingService(config);
    }
    return ErrorHandlingService.instance;
  }

  /**
   * Initialize error categories
   */
  private initializeErrorCategories(): void {
    const categories: ErrorCategory[] = [
      { name: 'auth', color: '#ef4444', icon: '🔐', severity: 'high' },
      { name: 'session', color: '#f59e0b', icon: '⏰', severity: 'high' },
      { name: 'api', color: '#8b5cf6', icon: '🌐', severity: 'medium' },
      { name: 'ui', color: '#06b6d4', icon: '🎨', severity: 'low' },
      { name: 'network', color: '#10b981', icon: '📡', severity: 'medium' },
      { name: 'storage', color: '#f97316', icon: '💾', severity: 'medium' },
      { name: 'general', color: '#6b7280', icon: '⚙️', severity: 'low' },
    ];

    categories.forEach(category => {
      this.errorCategories.set(category.name, category);
    });
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalErrorHandlers(): void {
    // Handle unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.log('error', 'general', event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.log('error', 'general', 'Unhandled promise rejection', {
        reason: event.reason,
        stack: event.reason?.stack,
      });
    });

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        const target = event.target as HTMLElement;
        this.log('warn', 'ui', 'Resource loading error', {
          tagName: target.tagName,
          src: (target as any).src || (target as any).href,
          type: (target as any).type,
        });
      }
    }, true);
  }

  /**
   * Start periodic error reporting
   */
  private startPeriodicReporting(): void {
    if (!this.config.enableReporting || !this.config.reportInterval) {
      return;
    }

    this.reportTimer = setInterval(() => {
      this.reportErrors();
    }, this.config.reportInterval);
  }

  /**
   * Load persisted logs from localStorage
   */
  private loadPersistedLogs(): void {
    try {
      const stored = localStorage.getItem('pesantren_hub_error_logs');
      if (stored) {
        const logs = JSON.parse(stored);
        this.logs = logs.filter((log: ErrorLogEntry) => {
          // Keep logs from the last 24 hours
          const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
          return log.timestamp > twentyFourHoursAgo;
        });
      }
    } catch (error) {
      console.warn('Failed to load persisted error logs:', error);
    }
  }

  /**
   * Persist logs to localStorage
   */
  private persistLogs(): void {
    try {
      localStorage.setItem('pesantren_hub_error_logs', JSON.stringify(this.logs));
    } catch (error) {
      console.warn('Failed to persist error logs:', error);
    }
  }

  /**
   * Generate unique log ID
   */
  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate device fingerprint
   */
  private generateFingerprint(): string {
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      !!window.sessionStorage,
      !!window.localStorage,
    ].join('|');

    return btoa(fingerprint).slice(0, 16);
  }

  /**
   * Log an error
   */
  public log(
    level: ErrorLogEntry['level'],
    category: ErrorLogEntry['category'],
    message: string,
    details?: any,
    context?: Record<string, any>
  ): string {
    if (!this.config.enableLogging) {
      return '';
    }

    // Check log level
    const levelOrder = ['debug', 'info', 'warn', 'error', 'fatal'];
    const currentLevelIndex = levelOrder.indexOf(this.config.logLevel);
    const logLevelIndex = levelOrder.indexOf(level);

    if (logLevelIndex < currentLevelIndex) {
      return '';
    }

    const logEntry: ErrorLogEntry = {
      id: this.generateLogId(),
      timestamp: Date.now(),
      level,
      category,
      message,
      details,
      stack: details?.stack || (details instanceof Error ? details.stack : undefined),
      url: window.location.href,
      userAgent: navigator.userAgent,
      fingerprint: this.generateFingerprint(),
      context,
      resolved: false,
      reported: false,
    };

    // Add to logs
    this.logs.push(logEntry);

    // Maintain log limit
    if (this.logs.length > this.config.maxLogEntries) {
      this.logs = this.logs.slice(-this.config.maxLogEntries);
    }

    // Persist logs
    this.persistLogs();

    // Emit event
    this.emit('error-logged', logEntry);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      const categoryInfo = this.errorCategories.get(category);
      const icon = categoryInfo?.icon || '❓';
      const color = categoryInfo?.color || '#666';

      console.log(
        `%c${icon} [${level.toUpperCase()}] ${category}: ${message}`,
        `color: ${color}; font-weight: bold;`,
        details
      );
    }

    return logEntry.id;
  }

  /**
   * Convenience methods for different error types
   */
  public debug(message: string, details?: any, context?: Record<string, any>): string {
    return this.log('debug', 'general', message, details, context);
  }

  public info(message: string, details?: any, context?: Record<string, any>): string {
    return this.log('info', 'general', message, details, context);
  }

  public warn(message: string, details?: any, context?: Record<string, any>): string {
    return this.log('warn', 'general', message, details, context);
  }

  public error(message: string, details?: any, context?: Record<string, any>): string {
    return this.log('error', 'general', message, details, context);
  }

  public fatal(message: string, details?: any, context?: Record<string, any>): string {
    return this.log('fatal', 'general', message, details, context);
  }

  /**
   * Category-specific logging methods
   */
  public auth(message: string, level: ErrorLogEntry['level'] = 'error', details?: any): string {
    return this.log(level, 'auth', message, details);
  }

  public session(message: string, level: ErrorLogEntry['level'] = 'error', details?: any): string {
    return this.log(level, 'session', message, details);
  }

  public api(message: string, level: ErrorLogEntry['level'] = 'error', details?: any): string {
    return this.log(level, 'api', message, details);
  }

  public network(message: string, level: ErrorLogEntry['level'] = 'warn', details?: any): string {
    return this.log(level, 'network', message, details);
  }

  public storage(message: string, level: ErrorLogEntry['level'] = 'warn', details?: any): string {
    return this.log(level, 'storage', message, details);
  }

  public ui(message: string, level: ErrorLogEntry['level'] = 'warn', details?: any): string {
    return this.log(level, 'ui', message, details);
  }

  /**
   * Handle error with retry logic
   */
  public async withRetry<T>(
    operation: () => Promise<T>,
    operationId: string,
    category: ErrorLogEntry['category'] = 'general',
    maxRetries?: number
  ): Promise<T> {
    const retryLimit = maxRetries || this.config.maxRetries;
    const retryInfo = this.retryMap.get(operationId) || { count: 0, lastAttempt: 0 };

    if (retryInfo.count >= retryLimit) {
      const error = new Error(`Maximum retries exceeded for operation: ${operationId}`);
      this.log('error', category, error.message, { operationId, retryCount: retryInfo.count });
      throw error;
    }

    try {
      const result = await operation();

      // Success - clear retry info
      this.retryMap.delete(operationId);

      return result;
    } catch (error) {
      retryInfo.count++;
      retryInfo.lastAttempt = Date.now();
      this.retryMap.set(operationId, retryInfo);

      this.log(
        'warn',
        category,
        `Operation failed, attempt ${retryInfo.count}/${retryLimit}`,
        { operationId, error: error instanceof Error ? error.message : error }
      );

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * retryInfo.count));

      // Retry the operation
      return this.withRetry(operation, operationId, category, maxRetries);
    }
  }

  /**
   * Get logs with filtering options
   */
  public getLogs(options: {
    level?: ErrorLogEntry['level'];
    category?: ErrorLogEntry['category'];
    limit?: number;
    since?: number;
    resolved?: boolean;
  } = {}): ErrorLogEntry[] {
    let filteredLogs = [...this.logs];

    if (options.level) {
      filteredLogs = filteredLogs.filter(log => log.level === options.level);
    }

    if (options.category) {
      filteredLogs = filteredLogs.filter(log => log.category === options.category);
    }

    if (options.since) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= options.since!);
    }

    if (options.resolved !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.resolved === options.resolved);
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => b.timestamp - a.timestamp);

    // Apply limit
    if (options.limit) {
      filteredLogs = filteredLogs.slice(0, options.limit);
    }

    return filteredLogs;
  }

  /**
   * Resolve an error log entry
   */
  public resolveLog(logId: string, resolution?: string): void {
    const logIndex = this.logs.findIndex(log => log.id === logId);
    if (logIndex > -1) {
      this.logs[logIndex].resolved = true;
      this.logs[logIndex].context = {
        ...this.logs[logIndex].context,
        resolution,
        resolvedAt: Date.now(),
      };
      this.persistLogs();
      this.emit('error-resolved', this.logs[logIndex]);
    }
  }

  /**
   * Get error statistics
   */
  public getStatistics(): {
    total: number;
    byLevel: Record<ErrorLogEntry['level'], number>;
    byCategory: Record<ErrorLogEntry['category'], number>;
    resolved: number;
    unresolved: number;
    recent: number; // Last hour
  } {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);

    const stats = {
      total: this.logs.length,
      byLevel: {} as Record<ErrorLogEntry['level'], number>,
      byCategory: {} as Record<ErrorLogEntry['category'], number>,
      resolved: 0,
      unresolved: 0,
      recent: 0,
    };

    this.logs.forEach(log => {
      // Count by level
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;

      // Count by category
      stats.byCategory[log.category] = (stats.byCategory[log.category] || 0) + 1;

      // Count resolved/unresolved
      if (log.resolved) {
        stats.resolved++;
      } else {
        stats.unresolved++;
      }

      // Count recent
      if (log.timestamp > oneHourAgo) {
        stats.recent++;
      }
    });

    return stats;
  }

  /**
   * Report errors to external service
   */
  private async reportErrors(): Promise<void> {
    if (!this.config.enableReporting || !this.config.reportEndpoint) {
      return;
    }

    const unreportedErrors = this.logs.filter(log => !log.reported && log.level !== 'debug');

    if (unreportedErrors.length === 0) {
      return;
    }

    try {
      const response = await fetch(this.config.reportEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          errors: unreportedErrors,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      });

      if (response.ok) {
        // Mark errors as reported
        unreportedErrors.forEach(log => {
          log.reported = true;
        });
        this.persistLogs();
        this.emit('errors-reported', { count: unreportedErrors.length });
      }
    } catch (error) {
      console.error('Failed to report errors:', error);
      this.log('error', 'general', 'Failed to report errors to external service', { error });
    }
  }

  /**
   * Clear all logs
   */
  public clearLogs(): void {
    this.logs = [];
    this.persistLogs();
    this.emit('logs-cleared');
  }

  /**
   * Export logs as JSON
   */
  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Get error category info
   */
  public getCategoryInfo(category: string): ErrorCategory | undefined {
    return this.errorCategories.get(category);
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
          console.error(`Error in error handling event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    if (this.reportTimer) {
      clearInterval(this.reportTimer);
    }

    this.eventListeners.clear();
    this.retryMap.clear();
  }
}

export default ErrorHandlingService;
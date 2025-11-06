/**
 * Session Management Services Export
 * Centralized exports for all session management services and utilities
 */

// Core Services
export { default as SessionService } from './sessionService';
export { default as APIClient } from './apiClient';
export { default as OfflineService } from './offlineService';
export { default as ErrorHandlingService } from './errorHandlingService';

// Types
export type {
  TokenPair,
  SessionState,
  SessionConfig,
  QueuedRequest,
  ActivityEvent,
} from './sessionService';

export type {
  APIRequestConfig,
  APIResponse,
  APIError,
} from './apiClient';

export type {
  OfflineRequest,
  SyncResult,
  OfflineStorage,
} from './offlineService';

export type {
  ErrorLogEntry,
  ErrorHandlingConfig,
  ErrorCategory,
} from './errorHandlingService';

// Utility functions
export const createSessionServices = (config?: {
  session?: Partial<SessionConfig>;
  api?: { baseURL?: string; defaultHeaders?: Record<string, string> };
  errorHandling?: Partial<ErrorHandlingConfig>;
}) => {
  const sessionService = SessionService.getInstance(config?.session);
  const apiClient = APIClient.getInstance(config?.api);
  const offlineService = OfflineService.getInstance(apiClient);
  const errorHandlingService = ErrorHandlingService.getInstance(config?.errorHandling);

  return {
    sessionService,
    apiClient,
    offlineService,
    errorHandlingService,
  };
};

// Default configuration exports
export const DEFAULT_SESSION_CONFIG = {
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

export const DEFAULT_ERROR_HANDLING_CONFIG = {
  enableLogging: true,
  enableReporting: false,
  logLevel: 'info' as const,
  maxLogEntries: 1000,
  reportInterval: 5 * 60 * 1000, // 5 minutes
  enableUserFeedback: true,
  enableRetry: true,
  maxRetries: 3,
  retryDelay: 1000,
};
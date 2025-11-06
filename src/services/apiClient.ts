/**
 * API Client with Automatic Token Refresh and Security Features
 * Integrates with SessionService for comprehensive session management
 */

import { SessionService } from './sessionService';

// Types
export interface APIRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  skipAuth?: boolean;
  skipRefresh?: boolean;
  cache?: boolean;
  cacheTTL?: number;
}

export interface APIResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  success: boolean;
  error?: string;
  metadata?: {
    requestId: string;
    timestamp: number;
    cached: boolean;
    retryCount: number;
  };
}

export interface APIError extends Error {
  status?: number;
  statusText?: string;
  code?: string;
  details?: any;
  requestId?: string;
  retryable?: boolean;
}

// Cache entry
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  etag?: string;
}

export class APIClient {
  private static instance: APIClient;
  private sessionService: SessionService;
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private cache: Map<string, CacheEntry<any>>;
  private requestInterceptors: Array<(config: APIRequestConfig) => APIRequestConfig> = [];
  private responseInterceptors: Array<(response: APIResponse) => APIResponse> = [];
  private errorInterceptors: Array<(error: APIError) => Promise<APIError | APIResponse>> = [];
  private ongoingRequests: Map<string, Promise<any>> = new Map();

  private constructor(config: { baseURL?: string; defaultHeaders?: Record<string, string> } = {}) {
    this.sessionService = SessionService.getInstance();
    this.baseURL = config.baseURL || this.getBaseURL();
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...config.defaultHeaders,
    };
    this.cache = new Map();

    this.setupSessionEventListeners();
    this.startCacheCleanup();
  }

  public static getInstance(config?: { baseURL?: string; defaultHeaders?: Record<string, string> }): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient(config);
    }
    return APIClient.instance;
  }

  /**
   * Get base URL from environment or use default
   */
  private getBaseURL(): string {
    // In a real implementation, this would come from environment variables
    return import.meta.env?.VITE_API_BASE_URL || '/api';
  }

  /**
   * Setup session event listeners
   */
  private setupSessionEventListeners(): void {
    this.sessionService.on('session-invalidated', () => {
      this.clearCache();
      this.cancelOngoingRequests();
    });

    this.sessionService.on('token-refreshed', () => {
      // Retry queued requests will be handled by SessionService
    });

    // Listen for tab visibility changes to handle stale cache
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.cleanupExpiredCache();
      }
    });
  }

  /**
   * Start periodic cache cleanup
   */
  private startCacheCleanup(): void {
    setInterval(() => {
      this.cleanupExpiredCache();
    }, 5 * 60 * 1000); // Clean every 5 minutes
  }

  /**
   * Clean up expired cache entries
   */
  private cleanupExpiredCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear entire cache
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Cancel all ongoing requests
   */
  private cancelOngoingRequests(): void {
    this.ongoingRequests.clear();
  }

  /**
   * Generate cache key for request
   */
  private getCacheKey(url: string, config: APIRequestConfig): string {
    const method = config.method || 'GET';
    const body = config.body ? JSON.stringify(config.body) : '';
    return `${method}:${url}:${body}`;
  }

  /**
   * Get cached response if available and not expired
   */
  private getCachedResponse<T>(key: string): APIResponse<T> | null {
    const entry = this.cache.get(key);
    if (entry && Date.now() < entry.expiresAt) {
      return {
        data: entry.data,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        metadata: {
          requestId: this.generateRequestId(),
          timestamp: entry.timestamp,
          cached: true,
          retryCount: 0,
        },
      };
    }
    return null;
  }

  /**
   * Store response in cache
   */
  private setCachedResponse<T>(key: string, response: APIResponse<T>, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data: response.data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    });
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Apply request interceptors
   */
  private applyRequestInterceptors(config: APIRequestConfig): APIRequestConfig {
    return this.requestInterceptors.reduce((acc, interceptor) => interceptor(acc), config);
  }

  /**
   * Apply response interceptors
   */
  private applyResponseInterceptors(response: APIResponse): APIResponse {
    return this.responseInterceptors.reduce((acc, interceptor) => interceptor(acc), response);
  }

  /**
   * Apply error interceptors
   */
  private async applyErrorInterceptors(error: APIError): Promise<APIError | APIResponse> {
    for (const interceptor of this.errorInterceptors) {
      try {
        const result = await interceptor(error);
        if (result) {
          return result;
        }
      } catch (e) {
        console.error('Error interceptor failed:', e);
      }
    }
    throw error;
  }

  /**
   * Create API error object
   */
  private createAPIError(
    message: string,
    status?: number,
    statusText?: string,
    details?: any,
    requestId?: string
  ): APIError {
    const error = new Error(message) as APIError;
    error.status = status;
    error.statusText = statusText;
    error.details = details;
    error.requestId = requestId;
    error.retryable = this.isRetryableError(status);
    return error;
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(status?: number): boolean {
    if (!status) return true;
    return status >= 500 || status === 408 || status === 429;
  }

  /**
   * Add authentication headers
   */
  private addAuthHeaders(config: APIRequestConfig): APIRequestConfig {
    if (config.skipAuth) {
      return config;
    }

    const tokens = this.sessionService.getStoredTokens();
    if (tokens?.accessToken) {
      return {
        ...config,
        headers: {
          ...config.headers,
          'Authorization': `Bearer ${tokens.accessToken}`,
          'X-Device-Fingerprint': this.sessionService.getSessionState().deviceFingerprint,
        },
      };
    }

    return config;
  }

  /**
   * Handle 401 Unauthorized - attempt token refresh
   */
  private async handleUnauthorized(
    originalRequest: () => Promise<APIResponse>,
    config: APIRequestConfig
  ): Promise<APIResponse> {
    if (config.skipRefresh) {
      throw this.createAPIError('Authentication failed', 401, 'Unauthorized');
    }

    // Queue the request for retry after token refresh
    return this.sessionService.queueRequest(originalRequest);
  }

  /**
   * Make HTTP request with full session management
   */
  private async makeRequest<T>(
    url: string,
    config: APIRequestConfig = {}
  ): Promise<APIResponse<T>> {
    // Apply request interceptors
    config = this.applyRequestInterceptors(config);

    // Add authentication headers
    config = this.addAuthHeaders(config);

    // Merge headers
    const headers = {
      ...this.defaultHeaders,
      ...config.headers,
    };

    // Add CSRF token if enabled and using state-changing methods
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(config.method || 'GET')) {
      const csrfToken = this.getCSRFToken();
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }
    }

    const fullUrl = this.buildURL(url);
    const cacheKey = this.getCacheKey(fullUrl, config);
    const requestId = this.generateRequestId();

    // Check cache for GET requests
    if ((config.method || 'GET') === 'GET' && config.cache !== false) {
      const cached = this.getCachedResponse<T>(cacheKey);
      if (cached) {
        return this.applyResponseInterceptors(cached);
      }
    }

    // Check for identical ongoing requests
    if (this.ongoingRequests.has(cacheKey)) {
      return this.ongoingRequests.get(cacheKey);
    }

    // Create request promise
    const requestPromise = this.executeRequest<T>(fullUrl, {
      ...config,
      headers,
      requestId,
    });

    // Store ongoing request
    this.ongoingRequests.set(cacheKey, requestPromise);

    try {
      const response = await requestPromise;

      // Cache GET requests
      if ((config.method || 'GET') === 'GET' && config.cache !== false && response.success) {
        this.setCachedResponse(
          cacheKey,
          response,
          config.cacheTTL || 5 * 60 * 1000
        );
      }

      // Apply response interceptors
      return this.applyResponseInterceptors(response);
    } catch (error) {
      // Apply error interceptors
      return this.applyErrorInterceptors(error as APIError) as Promise<APIResponse<T>>;
    } finally {
      // Clean up ongoing request
      this.ongoingRequests.delete(cacheKey);
    }
  }

  /**
   * Execute the actual HTTP request
   */
  private async executeRequest<T>(
    url: string,
    config: APIRequestConfig & { requestId: string }
  ): Promise<APIResponse<T>> {
    const {
      method = 'GET',
      body,
      timeout = 30000,
      retries = 3,
      retryDelay = 1000,
      requestId,
    } = config;

    let lastError: APIError | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Validate session before request
        if (!config.skipAuth && !this.sessionService.isSessionValid()) {
          throw this.createAPIError('Session invalid', 401, 'Unauthorized', undefined, requestId);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const fetchOptions: RequestInit = {
          method,
          headers: config.headers,
          signal: controller.signal,
        };

        if (body && method !== 'GET') {
          if (typeof body === 'object') {
            fetchOptions.body = JSON.stringify(body);
          } else {
            fetchOptions.body = body;
          }
        }

        const response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);

        // Build headers object
        const responseHeaders: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });

        let responseData: any;
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
          responseData = await response.json();
        } else if (contentType?.includes('text/')) {
          responseData = await response.text();
        } else {
          responseData = await response.blob();
        }

        const apiResponse: APIResponse<T> = {
          data: responseData,
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
          success: response.ok,
          metadata: {
            requestId,
            timestamp: Date.now(),
            cached: false,
            retryCount: attempt,
          },
        };

        // Handle authentication errors
        if (response.status === 401) {
          return this.handleUnauthorized(
            () => this.makeRequest<T>(url, config),
            config
          );
        }

        // Handle other HTTP errors
        if (!response.ok) {
          const error = this.createAPIError(
            responseData?.message || `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            response.statusText,
            responseData,
            requestId
          );

          // Don't retry client errors (4xx) except 408, 429
          if (error.status && error.status >= 400 && error.status < 500 &&
              error.status !== 408 && error.status !== 429) {
            throw error;
          }

          lastError = error;

          // Don't retry on last attempt
          if (attempt === retries) {
            throw error;
          }

          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
          continue;
        }

        return apiResponse;

      } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            lastError = this.createAPIError('Request timeout', 408, 'Request Timeout', undefined, requestId);
          } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
            lastError = this.createAPIError('Network error', 0, 'Network Error', error.message, requestId);
          } else {
            lastError = error as APIError;
          }
        } else {
          lastError = this.createAPIError('Unknown error', 0, 'Unknown Error', error, requestId);
        }

        // Don't retry on last attempt
        if (attempt === retries) {
          break;
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
      }
    }

    throw lastError;
  }

  /**
   * Build full URL
   */
  private buildURL(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${this.baseURL}${url}`;
  }

  /**
   * Get CSRF token (mock implementation)
   */
  private getCSRFToken(): string | null {
    // In a real implementation, this would get the token from cookies or meta tags
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || null;
  }

  /**
   * HTTP method helpers
   */
  public async get<T>(url: string, config: APIRequestConfig = {}): Promise<APIResponse<T>> {
    return this.makeRequest<T>(url, { ...config, method: 'GET' });
  }

  public async post<T>(url: string, data?: any, config: APIRequestConfig = {}): Promise<APIResponse<T>> {
    return this.makeRequest<T>(url, { ...config, method: 'POST', body: data });
  }

  public async put<T>(url: string, data?: any, config: APIRequestConfig = {}): Promise<APIResponse<T>> {
    return this.makeRequest<T>(url, { ...config, method: 'PUT', body: data });
  }

  public async patch<T>(url: string, data?: any, config: APIRequestConfig = {}): Promise<APIResponse<T>> {
    return this.makeRequest<T>(url, { ...config, method: 'PATCH', body: data });
  }

  public async delete<T>(url: string, config: APIRequestConfig = {}): Promise<APIResponse<T>> {
    return this.makeRequest<T>(url, { ...config, method: 'DELETE' });
  }

  /**
   * File upload helper
   */
  public async upload<T>(
    url: string,
    file: File,
    config: APIRequestConfig & { onProgress?: (progress: number) => void } = {}
  ): Promise<APIResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    // Add additional data if provided
    if (config.body && typeof config.body === 'object') {
      Object.entries(config.body).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
    }

    return this.makeRequest<T>(url, {
      ...config,
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData - browser will set it with boundary
        ...Object.fromEntries(
          Object.entries(config.headers || {}).filter(([key]) => key.toLowerCase() !== 'content-type')
        ),
      },
    });
  }

  /**
   * Multiple concurrent requests
   */
  public async all<T extends readonly unknown[] | []>(
    requests: [...{ [K in keyof T]: Promise<APIResponse<T[K]>> }]
  ): Promise<{ [K in keyof T]: APIResponse<T[K]> }> {
    return Promise.all(requests);
  }

  /**
   * Batch requests
   */
  public async batch<T>(
    requests: Array<{ url: string; config?: APIRequestConfig }>
  ): Promise<APIResponse<T>[]> {
    const promises = requests.map(({ url, config }) => this.makeRequest<T>(url, config));
    return Promise.all(promises);
  }

  /**
   * Add request interceptor
   */
  public addRequestInterceptor(interceptor: (config: APIRequestConfig) => APIRequestConfig): () => void {
    this.requestInterceptors.push(interceptor);
    return () => {
      const index = this.requestInterceptors.indexOf(interceptor);
      if (index > -1) {
        this.requestInterceptors.splice(index, 1);
      }
    };
  }

  /**
   * Add response interceptor
   */
  public addResponseInterceptor(interceptor: (response: APIResponse) => APIResponse): () => void {
    this.responseInterceptors.push(interceptor);
    return () => {
      const index = this.responseInterceptors.indexOf(interceptor);
      if (index > -1) {
        this.responseInterceptors.splice(index, 1);
      }
    };
  }

  /**
   * Add error interceptor
   */
  public addErrorInterceptor(interceptor: (error: APIError) => Promise<APIError | APIResponse>): () => void {
    this.errorInterceptors.push(interceptor);
    return () => {
      const index = this.errorInterceptors.indexOf(interceptor);
      if (index > -1) {
        this.errorInterceptors.splice(index, 1);
      }
    };
  }

  /**
   * Get request statistics
   */
  public getStatistics(): {
    cacheSize: number;
    ongoingRequests: number;
    interceptors: {
      request: number;
      response: number;
      error: number;
    };
  } {
    return {
      cacheSize: this.cache.size,
      ongoingRequests: this.ongoingRequests.size,
      interceptors: {
        request: this.requestInterceptors.length,
        response: this.responseInterceptors.length,
        error: this.errorInterceptors.length,
      },
    };
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    this.clearCache();
    this.cancelOngoingRequests();
    this.requestInterceptors = [];
    this.responseInterceptors = [];
    this.errorInterceptors = [];
  }
}

export default APIClient;
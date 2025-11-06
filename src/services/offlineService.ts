/**
 * Offline Support Service
 * Provides offline capabilities, caching, and sync functionality
 */

import { APIClient, APIRequestConfig } from './apiClient';

// Types
export interface OfflineRequest {
  id: string;
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
  timestamp: number;
  retries: number;
  priority: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
}

export interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  errors: Array<{
    id: string;
    error: string;
  }>;
}

export interface OfflineStorage {
  requests: OfflineRequest[];
  cache: Record<string, {
    data: any;
    timestamp: number;
    expiresAt: number;
    etag?: string;
  }>;
  settings: {
    maxStorageSize: number;
    maxRequests: number;
    syncInterval: number;
    autoSync: boolean;
  };
}

export class OfflineService {
  private static instance: OfflineService;
  private apiClient: APIClient;
  private isOnline: boolean;
  private storage: OfflineStorage;
  private syncTimer: NodeJS.Timeout | null = null;
  private eventListeners: Map<string, Function[]> = new Map();
  private isSyncing: boolean = false;
  private indexedDB: IDBDatabase | null = null;

  private constructor(apiClient: APIClient) {
    this.apiClient = apiClient;
    this.isOnline = navigator.onLine;
    this.storage = this.loadStorage();
    this.initializeIndexedDB();
    this.setupEventListeners();
    this.startAutoSync();
  }

  public static getInstance(apiClient?: APIClient): OfflineService {
    if (!OfflineService.instance) {
      if (!apiClient) {
        throw new Error('APIClient is required for first initialization');
      }
      OfflineService.instance = new OfflineService(apiClient);
    }
    return OfflineService.instance;
  }

  /**
   * Initialize IndexedDB for offline storage
   */
  private async initializeIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('PesantrenHubOffline', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.indexedDB = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('requests')) {
          db.createObjectStore('requests', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  /**
   * Setup event listeners for online/offline status
   */
  private setupEventListeners(): void {
    const handleOnline = () => {
      this.isOnline = true;
      this.emit('online');
      this.syncRequests();
    };

    const handleOffline = () => {
      this.isOnline = false;
      this.emit('offline');
    };

    const handleBeforeUnload = () => {
      this.saveStorage();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Listen for page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline) {
        this.syncRequests();
      }
    });
  }

  /**
   * Load storage from localStorage
   */
  private loadStorage(): OfflineStorage {
    try {
      const stored = localStorage.getItem('pesantren_hub_offline');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load offline storage:', error);
    }

    return {
      requests: [],
      cache: {},
      settings: {
        maxStorageSize: 50 * 1024 * 1024, // 50MB
        maxRequests: 1000,
        syncInterval: 30000, // 30 seconds
        autoSync: true,
      },
    };
  }

  /**
   * Save storage to localStorage
   */
  private saveStorage(): void {
    try {
      localStorage.setItem('pesantren_hub_offline', JSON.stringify(this.storage));
    } catch (error) {
      console.warn('Failed to save offline storage:', error);
      this.cleanupStorage(); // Clean up if storage is full
    }
  }

  /**
   * Clean up storage to free space
   */
  private cleanupStorage(): void {
    // Remove old cache entries
    const now = Date.now();
    Object.keys(this.storage.cache).forEach(key => {
      const entry = this.storage.cache[key];
      if (now > entry.expiresAt) {
        delete this.storage.cache[key];
      }
    });

    // Limit number of requests
    if (this.storage.requests.length > this.storage.settings.maxRequests) {
      this.storage.requests = this.storage.requests
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, this.storage.settings.maxRequests);
    }

    this.saveStorage();
  }

  /**
   * Start automatic sync
   */
  private startAutoSync(): void {
    if (!this.storage.settings.autoSync) return;

    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    this.syncTimer = setInterval(() => {
      if (this.isOnline && !this.isSyncing) {
        this.syncRequests();
      }
    }, this.storage.settings.syncInterval);
  }

  /**
   * Queue a request for offline execution
   */
  public queueRequest(
    url: string,
    config: APIRequestConfig,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ): string {
    const id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const request: OfflineRequest = {
      id,
      url,
      method: config.method || 'GET',
      headers: config.headers,
      body: config.body,
      timestamp: Date.now(),
      retries: 0,
      priority,
      metadata: config,
    };

    this.storage.requests.push(request);
    this.saveStorage();

    this.emit('request-queued', { request });

    return id;
  }

  /**
   * Store data in offline cache
   */
  public setCache(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.storage.cache[key] = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    };
    this.saveStorage();

    // Also store in IndexedDB for larger data
    if (this.indexedDB && this.getStorageSize() > this.storage.settings.maxStorageSize * 0.8) {
      this.storeInIndexedDB('cache', key, {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
      });
    }
  }

  /**
   * Get data from offline cache
   */
  public getCache<T = any>(key: string): T | null {
    const entry = this.storage.cache[key];
    if (entry && Date.now() < entry.expiresAt) {
      return entry.data;
    }

    // Try IndexedDB if not in memory cache
    if (this.indexedDB) {
      return this.getFromIndexedDB('cache', key);
    }

    return null;
  }

  /**
   * Remove data from cache
   */
  public removeCache(key: string): void {
    delete this.storage.cache[key];
    this.saveStorage();

    if (this.indexedDB) {
      this.removeFromIndexedDB('cache', key);
    }
  }

  /**
   * Clear all cache
   */
  public clearCache(): void {
    this.storage.cache = {};
    this.saveStorage();

    if (this.indexedDB) {
      this.clearIndexedDBStore('cache');
    }
  }

  /**
   * Sync queued requests
   */
  public async syncRequests(): Promise<SyncResult> {
    if (!this.isOnline || this.isSyncing || this.storage.requests.length === 0) {
      return {
        success: true,
        synced: 0,
        failed: 0,
        errors: [],
      };
    }

    this.isSyncing = true;
    this.emit('sync-started');

    const result: SyncResult = {
      success: true,
      synced: 0,
      failed: 0,
      errors: [],
    };

    // Sort requests by priority and timestamp
    const requests = [...this.storage.requests].sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority] || a.timestamp - b.timestamp;
    });

    for (const request of requests) {
      try {
        await this.executeRequest(request);
        this.removeRequest(request.id);
        result.synced++;
      } catch (error) {
        console.error(`Failed to sync request ${request.id}:`, error);
        request.retries++;

        if (request.retries >= 3) {
          result.errors.push({
            id: request.id,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          result.failed++;
          this.removeRequest(request.id);
        } else {
          // Update retry count
          const index = this.storage.requests.findIndex(r => r.id === request.id);
          if (index > -1) {
            this.storage.requests[index].retries = request.retries;
          }
        }
      }
    }

    this.saveStorage();
    this.isSyncing = false;

    this.emit('sync-completed', result);

    return result;
  }

  /**
   * Execute a queued request
   */
  private async executeRequest(request: OfflineRequest): Promise<any> {
    const config: APIRequestConfig = {
      method: request.method as any,
      headers: request.headers,
      body: request.body,
      skipAuth: false,
      ...request.metadata,
    };

    let response;
    switch (request.method.toUpperCase()) {
      case 'GET':
        response = await this.apiClient.get(request.url, config);
        break;
      case 'POST':
        response = await this.apiClient.post(request.url, request.body, config);
        break;
      case 'PUT':
        response = await this.apiClient.put(request.url, request.body, config);
        break;
      case 'PATCH':
        response = await this.apiClient.patch(request.url, request.body, config);
        break;
      case 'DELETE':
        response = await this.apiClient.delete(request.url, config);
        break;
      default:
        throw new Error(`Unsupported method: ${request.method}`);
    }

    return response.data;
  }

  /**
   * Remove a request from queue
   */
  private removeRequest(id: string): void {
    this.storage.requests = this.storage.requests.filter(r => r.id !== id);
  }

  /**
   * IndexedDB operations
   */
  private async storeInIndexedDB(store: string, key: string, data: any): Promise<void> {
    if (!this.indexedDB) return;

    return new Promise((resolve, reject) => {
      const transaction = this.indexedDB!.transaction(store, 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.put({ key, ...data });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  private async getFromIndexedDB<T>(store: string, key: string): Promise<T | null> {
    if (!this.indexedDB) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.indexedDB!.transaction(store, 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        if (result && Date.now() < result.expiresAt) {
          resolve(result.data);
        } else {
          resolve(null);
        }
      };
    });
  }

  private async removeFromIndexedDB(store: string, key: string): Promise<void> {
    if (!this.indexedDB) return;

    return new Promise((resolve, reject) => {
      const transaction = this.indexedDB!.transaction(store, 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  private async clearIndexedDBStore(store: string): Promise<void> {
    if (!this.indexedDB) return;

    return new Promise((resolve, reject) => {
      const transaction = this.indexedDB!.transaction(store, 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Get storage size
   */
  private getStorageSize(): number {
    const data = JSON.stringify(this.storage);
    return new Blob([data]).size;
  }

  /**
   * Get offline statistics
   */
  public getStatistics(): {
    isOnline: boolean;
    queuedRequests: number;
    cacheSize: number;
    storageSize: number;
    lastSync?: Date;
    isSyncing: boolean;
  } {
    return {
      isOnline: this.isOnline,
      queuedRequests: this.storage.requests.length,
      cacheSize: Object.keys(this.storage.cache).length,
      storageSize: this.getStorageSize(),
      isSyncing: this.isSyncing,
    };
  }

  /**
   * Update settings
   */
  public updateSettings(settings: Partial<OfflineStorage['settings']>): void {
    this.storage.settings = { ...this.storage.settings, ...settings };
    this.saveStorage();
    this.startAutoSync(); // Restart sync with new settings
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
          console.error(`Error in offline event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    this.saveStorage();
    this.eventListeners.clear();
  }
}

export default OfflineService;
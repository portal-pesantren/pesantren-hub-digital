import { useState, useCallback } from 'react';

export type ErrorType = 'error' | 'success' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: ErrorType;
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive';
  }>;
}

export const useErrorHandler = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? (notification.type === 'success' ? 3000 : notification.type === 'error' ? 5000 : 4000)
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification after duration (unless persistent)
    if (!newNotification.persistent && newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Helper methods for common error types
  const handleError = useCallback((error: Error | string, title?: string) => {
    const message = typeof error === 'string' ? error : error.message;
    addNotification({
      type: 'error',
      title: title || 'Error',
      message,
      persistent: false
    });
  }, [addNotification]);

  const handleSuccess = useCallback((message: string, title?: string) => {
    addNotification({
      type: 'success',
      title: title || 'Success',
      message,
      duration: 3000
    });
  }, [addNotification]);

  const handleWarning = useCallback((message: string, title?: string) => {
    addNotification({
      type: 'warning',
      title: title || 'Warning',
      message,
      duration: 4000
    });
  }, [addNotification]);

  const handleInfo = useCallback((message: string, title?: string) => {
    addNotification({
      type: 'info',
      title: title || 'Info',
      message,
      duration: 4000
    });
  }, [addNotification]);

  // Async error wrapper
  const withErrorHandling = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    errorTitle?: string
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error as Error, errorTitle);
      return null;
    }
  }, [handleError]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    handleError,
    handleSuccess,
    handleWarning,
    handleInfo,
    withErrorHandling
  };
};
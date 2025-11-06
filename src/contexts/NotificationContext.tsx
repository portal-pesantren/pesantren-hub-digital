import React, { createContext, useContext, ReactNode } from 'react';
import { useErrorHandler, Notification } from '@/hooks/useErrorHandler';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  handleError: (error: Error | string, title?: string) => void;
  handleSuccess: (message: string, title?: string) => void;
  handleWarning: (message: string, title?: string) => void;
  handleInfo: (message: string, title?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    handleError,
    handleSuccess,
    handleWarning,
    handleInfo
  } = useErrorHandler();

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAllNotifications,
        handleError,
        handleSuccess,
        handleWarning,
        handleInfo
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
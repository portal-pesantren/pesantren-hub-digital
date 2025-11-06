import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { NotificationProvider, useNotification } from '@/contexts/NotificationContext';
import { NotificationContainer } from '@/components/NotificationContainer';

interface AppWithErrorBoundaryProps {
  children: React.ReactNode;
}

const NotificationContainerWrapper: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <NotificationContainer
      notifications={notifications}
      onRemove={removeNotification}
    />
  );
};

const AppWithErrorBoundary: React.FC<AppWithErrorBoundaryProps> = ({ children }) => {
  return (
    <NotificationProvider>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
      <NotificationContainerWrapper />
    </NotificationProvider>
  );
};

export default AppWithErrorBoundary;
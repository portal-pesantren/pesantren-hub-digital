import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Notification } from '@/hooks/useErrorHandler';

interface NotificationContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onRemove
}) => {
  const getIcon = (type: 'error' | 'success' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getVariant = (type: 'error' | 'success' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return 'destructive';
      case 'success':
        return 'default';
      case 'warning':
        return 'default';
      case 'info':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md w-full">
      {notifications.map((notification) => (
        <Alert
          key={notification.id}
          variant={getVariant(notification.type)}
          className="relative animate-in slide-in-from-right-full duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              {notification.title && (
                <h4 className="font-medium text-sm leading-none mb-1">
                  {notification.title}
                </h4>
              )}
              <AlertDescription className="text-sm">
                {notification.message}
              </AlertDescription>
              {notification.actions && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {notification.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className={`text-xs px-2 py-1 rounded border transition-colors ${
                        action.variant === 'destructive'
                          ? 'border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground'
                          : 'border-border hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => onRemove(notification.id)}
              className="flex-shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 p-1"
            >
              <XCircle className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </Alert>
      ))}
    </div>
  );
};
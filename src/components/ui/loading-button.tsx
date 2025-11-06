import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';

interface LoadingButtonProps extends Omit<ButtonProps, 'disabled'> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  loadingText,
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <Button
      disabled={disabled || isLoading}
      className={cn('relative', className)}
      {...props}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {isLoading ? loadingText || children : children}
    </Button>
  );
};

// Specialized loading buttons for common use cases
export const LoadingButtonPrimary: React.FC<LoadingButtonProps> = (props) => (
  <LoadingButton variant="default" {...props} />
);

export const LoadingButtonOutline: React.FC<LoadingButtonProps> = (props) => (
  <LoadingButton variant="outline" {...props} />
);

export const LoadingButtonDestructive: React.FC<LoadingButtonProps> = (props) => (
  <LoadingButton variant="destructive" {...props} />
);

export const LoadingButtonSuccess: React.FC<LoadingButtonProps> = (props) => (
  <LoadingButton variant="success" {...props} />
);

// Icon loading button for actions without text
export const LoadingIconButton: React.FC<
  Omit<ButtonProps, 'children'> & {
    isLoading?: boolean;
    icon: React.ReactNode;
    tooltip?: string;
  }
> = ({ isLoading, icon, tooltip, className, ...props }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={isLoading}
      className={cn('relative', className)}
      title={tooltip}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        icon
      )}
    </Button>
  );
};

// Responsive loading button for mobile-first design
export const LoadingButtonResponsive: React.FC<LoadingButtonProps> = ({
  isLoading,
  loadingText,
  children,
  className,
  ...props
}) => (
  <LoadingButton
    isLoading={isLoading}
    loadingText={loadingText}
    className={cn('w-full sm:w-auto', className)}
    {...props}
  >
    {children}
  </LoadingButton>
);
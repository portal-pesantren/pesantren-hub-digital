import React from 'react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';

interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  gap?: 'sm' | 'default' | 'lg';
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  size = 'default',
  className,
  gap = 'default'
}) => {
  const gapClasses = {
    sm: 'gap-1',
    default: 'gap-2',
    lg: 'gap-3'
  };

  const orientationClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col'
  };

  return (
    <div
      className={cn(
        'flex',
        orientationClasses[orientation],
        gapClasses[gap],
        className
      )}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type === Button) {
          return React.cloneElement(child as React.ReactElement<ButtonProps>, {
            key: index,
            size,
            className: cn(
              orientation === 'vertical' && 'w-full',
              child.props.className
            )
          });
        }
        return child;
      })}
    </div>
  );
};

// Convenience components for common button patterns
export const ButtonGroupActions: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <ButtonGroup
    orientation="horizontal"
    size="sm"
    gap="default"
    className={className}
  >
    {children}
  </ButtonGroup>
);

export const ButtonGroupVertical: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <ButtonGroup
    orientation="vertical"
    size="default"
    gap="sm"
    className={className}
  >
    {children}
  </ButtonGroup>
);

// Responsive button group for mobile
export const ButtonGroupResponsive: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn('flex flex-col sm:flex-row gap-2 sm:gap-3', className)}>
    {React.Children.map(children, (child, index) => {
      if (React.isValidElement(child) && child.type === Button) {
        return React.cloneElement(child as React.ReactElement<ButtonProps>, {
          key: index,
          className: cn(
            'w-full sm:w-auto',
            child.props.className
          )
        });
      }
      return child;
    })}
  </div>
);
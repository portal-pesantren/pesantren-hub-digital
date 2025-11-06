import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';

interface AccessibleButtonProps extends ButtonProps {
  /** Screen reader label for icon-only buttons */
  ariaLabel?: string;
  /** Tooltip text for additional context */
  title?: string;
  /** Description for screen readers */
  ariaDescription?: string;
  /** Whether this button expands or controls a dropdown */
  ariaHasPopup?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  /** ID of the element this button controls */
  ariaControls?: string;
  /** Current state of the controlled element */
  ariaExpanded?: boolean;
  /** Whether the button is currently pressed */
  ariaPressed?: boolean;
  /** Keyboard shortcut for this action */
  accessKey?: string;
}

/**
 * Accessible Button component with built-in ARIA support
 * Use this for icon-only buttons or buttons that need enhanced accessibility
 */
export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  ariaLabel,
  title,
  ariaDescription,
  ariaHasPopup,
  ariaControls,
  ariaExpanded,
  ariaPressed,
  accessKey,
  ...props
}) => {
  // Auto-generate ariaLabel for icon-only buttons if not provided
  const autoAriaLabel = React.useMemo(() => {
    if (ariaLabel) return ariaLabel;

    // Try to extract text content from children
    if (typeof children === 'string') {
      return children;
    }

    // For React elements, try to get text content
    if (React.isValidElement(children)) {
      const childElement = children as React.ReactElement;
      if (childElement.props.children && typeof childElement.props.children === 'string') {
        return childElement.props.children;
      }
    }

    return undefined;
  }, [ariaLabel, children]);

  const buttonProps: AccessibleButtonProps = {
    ...props,
    // ARIA attributes
    'aria-label': autoAriaLabel,
    'aria-description': ariaDescription,
    'aria-haspopup': ariaHasPopup,
    'aria-controls': ariaControls,
    'aria-expanded': ariaExpanded,
    'aria-pressed': ariaPressed,
    'accessKey': accessKey,
    // Tooltip
    title: title || autoAriaLabel,
  };

  return (
    <Button {...buttonProps}>
      {children}
    </Button>
  );
};

// Icon button helper for common icon-only actions
export const IconButton: React.FC<
  Omit<AccessibleButtonProps, 'children'> & {
    icon: React.ReactNode;
    size?: 'icon' | 'icon-sm' | 'icon-lg';
    variant?: 'ghost' | 'outline' | 'secondary';
  }
> = ({
  icon,
  size = 'icon',
  variant = 'ghost',
  ariaLabel,
  ...props
}) => {
  return (
    <AccessibleButton
      size={size}
      variant={variant}
      ariaLabel={ariaLabel}
      {...props}
    >
      {icon}
    </AccessibleButton>
  );
};

// Action button helper for common CRUD operations
export const ActionButton: React.FC<{
  action: 'create' | 'edit' | 'delete' | 'view' | 'download' | 'upload' | 'refresh';
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  className?: string;
}> = ({
  action,
  label,
  onClick,
  disabled = false,
  variant = 'ghost',
  size = 'sm',
  className
}) => {
  const actionConfig = {
    create: {
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>,
      defaultLabel: 'Create',
      variant: 'default' as const
    },
    edit: {
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>,
      defaultLabel: 'Edit',
      variant: 'outline' as const
    },
    delete: {
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 011-1h2a1 1 0 011 1v3M4 7h16" />
      </svg>,
      defaultLabel: 'Delete',
      variant: 'destructive' as const
    },
    view: {
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>,
      defaultLabel: 'View',
      variant: 'outline' as const
    },
    download: {
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>,
      defaultLabel: 'Download',
      variant: 'outline' as const
    },
    upload: {
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>,
      defaultLabel: 'Upload',
      variant: 'outline' as const
    },
    refresh: {
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>,
      defaultLabel: 'Refresh',
      variant: 'outline' as const
    }
  };

  const config = actionConfig[action];
  const buttonVariant = variant || config.variant;
  const buttonLabel = label || config.defaultLabel;

  return (
    <AccessibleButton
      variant={buttonVariant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      ariaLabel={buttonLabel}
      title={buttonLabel}
      className={className}
    >
      {config.icon}
    </AccessibleButton>
  );
};
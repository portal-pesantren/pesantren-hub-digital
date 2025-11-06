/**
 * Session Management Components Export
 * Centralized exports for all session management UI components
 */

// Main Components
export { default as SessionManager } from './SessionManager';
export { default as SessionWarningDialog } from './SessionWarningDialog';
export { default as SessionExpiredDialog } from './SessionExpiredDialog';
export { default as SessionStatusIndicator } from './SessionStatusIndicator';

// Component types
export type { default as SessionWarningDialogProps } from './SessionWarningDialog';
export type { default as SessionExpiredDialogProps } from './SessionExpiredDialog';
export type { default as SessionStatusIndicatorProps } from './SessionStatusIndicator';
export type { default as SessionManagerProps } from './SessionManager';

// Re-export for convenience
export * from '@/hooks/useSession';
export * from '@/contexts/AuthContext';
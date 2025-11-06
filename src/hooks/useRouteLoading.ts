import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import React from 'react';
import { LoadingOverlay } from '@/components/LoadingStates';

interface UseRouteLoadingOptions {
  minLoadingTime?: number;
  maxLoadingTime?: number;
}

interface RouteLoadingState {
  isLoading: boolean;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  setLoadingMessage: (message: string) => void;
  LoadingOverlay: () => React.ReactNode;
}

export const useRouteLoading = (options: UseRouteLoadingOptions = {}): RouteLoadingState => {
  const {
    minLoadingTime = 300, // Minimum time to show loading state
    maxLoadingTime = 10000 // Maximum time before auto-hiding
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Memuat...');
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);
  const location = useLocation();

  // Auto-stop loading when route changes
  useEffect(() => {
    if (isLoading) {
      stopLoading();
    }
  }, [location.pathname]);

  const startLoading = useCallback((message = 'Memuat...') => {
    if (isLoading) return; // Prevent multiple loading states

    setLoadingMessage(message);
    setIsLoading(true);
    setLoadingStartTime(Date.now());

    // Auto-stop after maxLoadingTime
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setLoadingStartTime(null);
    }, maxLoadingTime);

    return () => clearTimeout(timeout);
  }, [isLoading, maxLoadingTime]);

  const stopLoading = useCallback(() => {
    if (!isLoading || !loadingStartTime) return;

    const elapsedTime = Date.now() - loadingStartTime;
    const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

    if (remainingTime > 0) {
      // Wait for minimum loading time to prevent flickering
      const timeout = setTimeout(() => {
        setIsLoading(false);
        setLoadingStartTime(null);
      }, remainingTime);
      return () => clearTimeout(timeout);
    } else {
      setIsLoading(false);
      setLoadingStartTime(null);
    }
  }, [isLoading, loadingStartTime, minLoadingTime]);

  const LoadingOverlayComponent = useCallback(() =>
    React.createElement(LoadingOverlay, {
      message: loadingMessage,
      isVisible: isLoading
    }), [loadingMessage, isLoading]);

  return {
    isLoading,
    startLoading,
    stopLoading,
    setLoadingMessage,
    LoadingOverlay: LoadingOverlayComponent
  };
};

// Hook for async operations with automatic loading states
export const useAsyncOperation = <T>(
  asyncFn: () => Promise<T>,
  options: UseRouteLoadingOptions = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { startLoading, stopLoading, setLoadingMessage } = useRouteLoading(options);

  const execute = useCallback(async (message = 'Memuat...') => {
    try {
      setError(null);
      startLoading(message);
      const result = await asyncFn();
      setData(result);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      stopLoading();
    }
  }, [asyncFn, startLoading, stopLoading]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    data,
    error,
    isLoading: useRouteLoading(options).isLoading,
    execute,
    reset
  };
};
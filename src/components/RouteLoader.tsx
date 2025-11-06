import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RouteLoaderProps {
  isLoading: boolean;
  progress?: number;
  message?: string;
}

export const RouteLoader: React.FC<RouteLoaderProps> = ({
  isLoading,
  progress,
  message = 'Memuat...'
}) => {
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setTimeout(() => {
        setShowProgress(true);
      }, 200); // Show progress bar after 200ms to avoid flicker for fast loads
    } else {
      setShowProgress(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b"
        >
          <div className="w-full max-w-4xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-full h-full"
                  >
                    <path
                      d="M21 12a9 9 0 11-6.219-8.56"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
                <span className="text-sm font-medium text-foreground">{message}</span>
              </div>
              {progress !== undefined && (
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              )}
            </div>

            {showProgress && (
              <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: '0%' }}
                  animate={{
                    width: progress !== undefined ? `${progress}%` : '100%'
                  }}
                  transition={{
                    duration: progress !== undefined ? 0.3 : 1,
                    ease: 'easeInOut'
                  }}
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Loading dots animation for inline use
export const LoadingDots: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const dotSize = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${dotSize[size]} bg-primary rounded-full`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
};

// Skeleton loader for cards with animation
export const AnimatedCardSkeleton: React.FC<{
  lines?: number;
  showAvatar?: boolean;
}> = ({ lines = 3, showAvatar = false }) => {
  return (
    <motion.div
      className="rounded-lg border bg-card p-6 space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {showAvatar && (
        <div className="flex items-center space-x-4">
          <motion.div
            className="w-12 h-12 bg-muted rounded-full"
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          <div className="space-y-2 flex-1">
            <motion.div
              className="h-4 bg-muted rounded w-1/4"
              animate={{
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            <motion.div
              className="h-3 bg-muted rounded w-1/6"
              animate={{
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.2
              }}
            />
          </div>
        </div>
      )}

      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          className="h-4 bg-muted rounded"
          style={{
            width: index === 0 ? '100%' : index === lines - 1 ? '60%' : '80%'
          }}
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.1
          }}
        />
      ))}
    </motion.div>
  );
};
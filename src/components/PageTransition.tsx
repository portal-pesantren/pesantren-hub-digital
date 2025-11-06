import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  location?: string;
  isVisible?: boolean;
}

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3
};

// Main page transition component
export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  location,
  isVisible = true
}) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={location || 'page'}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="w-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Fade transition for subtle effects
export const FadeTransition: React.FC<{
  children: React.ReactNode;
  isVisible?: boolean;
  duration?: number;
}> = ({ children, isVisible = true, duration = 0.2 }) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Slide transition for panels and sidebars
export const SlideTransition: React.FC<{
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  isVisible?: boolean;
}> = ({ children, direction = 'right', isVisible = true }) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'left': return { x: -100, opacity: 0 };
      case 'right': return { x: 100, opacity: 0 };
      case 'up': return { y: -100, opacity: 0 };
      case 'down': return { y: 100, opacity: 0 };
      default: return { x: 100, opacity: 0 };
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={getInitialPosition()}
          animate={{ x: 0, y: 0, opacity: 1 }}
          exit={getInitialPosition()}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Scale transition for modals and popups
export const ScaleTransition: React.FC<{
  children: React.ReactNode;
  isVisible?: boolean;
}> = ({ children, isVisible = true }) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// List item stagger transition
export const StaggerTransition: React.FC<{
  children: React.ReactNode[];
  staggerDelay?: number;
  isVisible?: boolean;
}> = ({ children, staggerDelay = 0.1, isVisible = true }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants}
        >
          {React.Children.map(children, (child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Loading spinner with animation
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32
  };

  return (
    <motion.div
      className={className}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
      style={{ width: sizeMap[size], height: sizeMap[size] }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="60"
          strokeDashoffset="15"
          initial={{ strokeDashoffset: 15 }}
          animate={{ strokeDashoffset: [15, 45, 15] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </svg>
    </motion.div>
  );
};

// Pulse animation for important elements
export const PulseAnimation: React.FC<{
  children: React.ReactNode;
  isVisible?: boolean;
}> = ({ children, isVisible = true }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [1, 0.8, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
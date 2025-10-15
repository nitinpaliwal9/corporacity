import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(100);
  const toastRef = useRef(null);

  useEffect(() => {
    // Pause auto-dismiss when hovered
    if (isHovered) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(), 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose, isHovered]);

  // Click outside to dismiss
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toastRef.current && !toastRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 dark:bg-green-600 text-white border-green-600 dark:border-green-700';
      case 'error':
        return 'bg-red-500 dark:bg-red-600 text-white border-red-600 dark:border-red-700';
      case 'warning':
        return 'bg-yellow-500 dark:bg-yellow-600 text-white border-yellow-600 dark:border-yellow-700';
      case 'info':
      default:
        return 'bg-blue-500 dark:bg-blue-600 text-white border-blue-600 dark:border-blue-700';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={toastRef}
          initial={{ opacity: 0, y: -50, scale: 0.9, x: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            x: 0,
            transition: { 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.4
            }
          }}
          exit={{ 
            opacity: 0, 
            y: -20, 
            scale: 0.95, 
            x: 20,
            transition: { 
              duration: 0.2, 
              ease: "easeIn" 
            }
          }}
          whileHover={{ 
            scale: 1.02, 
            y: -2,
            transition: { duration: 0.2 }
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`fixed top-4 right-4 z-50 max-w-sm w-full ${getToastStyles()} rounded-xl shadow-xl border backdrop-blur-sm p-4 cursor-pointer transition-all duration-200 hover:shadow-2xl`}
        >
          <div className="flex items-start space-x-3">
            <span className="text-lg flex-shrink-0">{getIcon()}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{message}</p>
            </div>
            <motion.button
              onClick={handleClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 text-white/80 hover:text-white dark:text-white/90 dark:hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toast Container Component
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (message, duration) => addToast(message, 'success', duration);
  const error = (message, duration) => addToast(message, 'error', duration);
  const warning = (message, duration) => addToast(message, 'warning', duration);
  const info = (message, duration) => addToast(message, 'info', duration);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
};

export default Toast;

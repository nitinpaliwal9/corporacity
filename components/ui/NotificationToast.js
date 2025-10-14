import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationToast = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const typeConfig = {
    success: {
      icon: '✅',
      bgColor: 'bg-green-500',
      borderColor: 'border-green-400',
      textColor: 'text-white'
    },
    error: {
      icon: '❌',
      bgColor: 'bg-red-500',
      borderColor: 'border-red-400',
      textColor: 'text-white'
    },
    warning: {
      icon: '⚠️',
      bgColor: 'bg-yellow-500',
      borderColor: 'border-yellow-400',
      textColor: 'text-white'
    },
    info: {
      icon: 'ℹ️',
      bgColor: 'bg-blue-500',
      borderColor: 'border-blue-400',
      textColor: 'text-white'
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`
            fixed z-50 max-w-sm w-full mx-4
            ${positionClasses[position]}
          `}
        >
          <div className={`
            ${config.bgColor} ${config.borderColor} ${config.textColor}
            rounded-xl shadow-lg border-2 p-4 backdrop-blur-sm
            flex items-center space-x-3
          `}>
            <div className="text-2xl flex-shrink-0">
              {config.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium break-words">
                {message}
              </p>
            </div>
            
            <button
              onClick={handleClose}
              className="flex-shrink-0 ml-2 text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toast Manager Component
export const ToastManager = ({ toasts, onRemove }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map((toast, index) => (
        <NotificationToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          position={toast.position}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
};

export default NotificationToast;

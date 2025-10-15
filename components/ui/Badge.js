import React from 'react';
import { motion } from 'framer-motion';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'medium',
  animated = false,
  className = ''
}) => {
  const variants = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
    primary: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
    info: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200'
  };

  const sizes = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-2.5 py-1.5 text-sm',
    large: 'px-3 py-2 text-base'
  };

  const classes = `inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`;

  if (animated) {
    return (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
        className={classes}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default Badge;

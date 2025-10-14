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
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-indigo-100 text-indigo-800'
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

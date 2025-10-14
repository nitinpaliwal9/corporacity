import React from 'react';
import { motion } from 'framer-motion';

const Avatar = ({ 
  src, 
  alt, 
  name,
  size = 'medium',
  status = null,
  className = '',
  onClick
}) => {
  const sizes = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-10 h-10 text-base',
    large: 'w-12 h-12 text-lg',
    xlarge: 'w-16 h-16 text-xl'
  };

  const statusColors = {
    online: 'bg-green-400',
    offline: 'bg-gray-400',
    away: 'bg-yellow-400',
    busy: 'bg-red-400'
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarClasses = `
    relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold
    ${sizes[size]}
    ${onClick ? 'cursor-pointer hover:scale-105 transition-transform duration-200' : ''}
    ${className}
  `;

  const statusClasses = `
    absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
    ${statusColors[status] || 'bg-gray-400'}
  `;

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      className={avatarClasses}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
      
      {status && (
        <div className={statusClasses} />
      )}
    </motion.div>
  );
};

export default Avatar;

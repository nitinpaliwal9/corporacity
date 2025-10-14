import React from 'react';
import { motion } from 'framer-motion';

const StatusCard = ({ 
  status, 
  isActive = false, 
  onClick, 
  disabled = false,
  loading = false,
  count = null 
}) => {
  const statusConfig = {
    present: {
      icon: '✅',
      label: 'Present',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      hoverColor: 'hover:from-green-600 hover:to-emerald-700'
    },
    late: {
      icon: '🕗',
      label: "I'm Late",
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      hoverColor: 'hover:from-yellow-600 hover:to-orange-700'
    },
    leave: {
      icon: '🌴',
      label: 'On Leave',
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      hoverColor: 'hover:from-red-600 hover:to-pink-700'
    },
    visit: {
      icon: '🧭',
      label: 'On Visit',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      hoverColor: 'hover:from-blue-600 hover:to-indigo-700'
    },
    short_leave: {
      icon: '🕓',
      label: 'Short Leave',
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-800',
      hoverColor: 'hover:from-purple-600 hover:to-violet-700'
    }
  };

  const config = statusConfig[status] || statusConfig.present;

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative group w-full p-6 rounded-2xl border-2 transition-all duration-300
        ${config.bgColor} ${config.borderColor}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}
        ${isActive ? 'ring-4 ring-blue-200 ring-opacity-50' : ''}
        ${loading ? 'animate-pulse' : ''}
      `}
    >
      {/* Background gradient overlay */}
      <div className={`
        absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300
        ${config.color}
        ${disabled ? '' : config.hoverColor}
      `} />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center space-y-3">
        {/* Icon */}
        <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
          {loading ? (
            <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
          ) : (
            config.icon
          )}
        </div>
        
        {/* Label */}
        <div className="text-center">
          <h3 className={`font-semibold text-lg ${config.textColor}`}>
            {config.label}
          </h3>
          {count !== null && (
            <p className="text-sm text-gray-500 mt-1">
              {count} {count === 1 ? 'person' : 'people'}
            </p>
          )}
        </div>
        
        {/* Active indicator */}
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </motion.div>
        )}
        
        {/* Loading indicator */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
    </motion.button>
  );
};

export default StatusCard;

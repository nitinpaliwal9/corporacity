import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import AnimatedCounter from './AnimatedCounter';
import ProgressBar from './ProgressBar';

const DashboardWidget = ({ 
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
  trend = null,
  progress = null,
  className = ''
}) => {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      text: 'text-blue-600',
      bgLight: 'bg-blue-50',
      border: 'border-blue-200'
    },
    green: {
      bg: 'from-green-500 to-green-600',
      text: 'text-green-600',
      bgLight: 'bg-green-50',
      border: 'border-green-200'
    },
    red: {
      bg: 'from-red-500 to-red-600',
      text: 'text-red-600',
      bgLight: 'bg-red-50',
      border: 'border-red-200'
    },
    yellow: {
      bg: 'from-yellow-500 to-yellow-600',
      text: 'text-yellow-600',
      bgLight: 'bg-yellow-50',
      border: 'border-yellow-200'
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      text: 'text-purple-600',
      bgLight: 'bg-purple-50',
      border: 'border-purple-200'
    },
    indigo: {
      bg: 'from-indigo-500 to-indigo-600',
      text: 'text-indigo-600',
      bgLight: 'bg-indigo-50',
      border: 'border-indigo-200'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className={`h-full ${colors.bgLight} ${colors.border} hover:shadow-lg transition-shadow duration-300`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              {icon && (
                <div className={`w-10 h-10 bg-gradient-to-br ${colors.bg} rounded-lg flex items-center justify-center`}>
                  <span className="text-white text-lg">{icon}</span>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-600">{title}</h3>
                {subtitle && (
                  <p className="text-xs text-gray-500">{subtitle}</p>
                )}
              </div>
            </div>
            
            <div className="mb-2">
              <div className={`text-2xl font-bold ${colors.text}`}>
                {typeof value === 'number' ? (
                  <AnimatedCounter value={value} />
                ) : (
                  value
                )}
              </div>
            </div>

            {trend && (
              <div className="flex items-center space-x-1">
                <span className={`text-xs ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {trend.positive ? '↗' : '↘'} {trend.value}%
                </span>
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
            )}

            {progress !== null && (
              <div className="mt-3">
                <ProgressBar 
                  progress={progress} 
                  color={color}
                  height={4}
                  showPercentage={false}
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default DashboardWidget;

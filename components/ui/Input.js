import React from 'react';

const Input = ({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400';
  
  const errorClasses = error ? 'border-red-300 dark:border-red-600 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400' : 'border-gray-300 dark:border-gray-600';
  
  const classes = `${baseClasses} ${errorClasses} ${className}`;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={classes}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;

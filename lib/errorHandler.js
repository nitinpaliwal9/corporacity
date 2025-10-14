// Comprehensive error handling utilities

/**
 * Custom error classes for different types of errors
 */
export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

export class AuthenticationError extends Error {
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message = 'Insufficient permissions') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class DatabaseError extends Error {
  constructor(message = 'Database operation failed') {
    super(message);
    this.name = 'DatabaseError';
  }
}

/**
 * Error severity levels
 */
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Error categories
 */
export const ERROR_CATEGORY = {
  VALIDATION: 'validation',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  NETWORK: 'network',
  DATABASE: 'database',
  BUSINESS_LOGIC: 'business_logic',
  UNKNOWN: 'unknown'
};

/**
 * Error logging service
 */
class ErrorLogger {
  constructor() {
    this.errors = [];
    this.maxErrors = 100; // Keep only last 100 errors in memory
  }

  log(error, context = {}) {
    const errorEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      message: error.message,
      name: error.name,
      stack: error.stack,
      context,
      severity: this.determineSeverity(error),
      category: this.determineCategory(error)
    };

    // Add to in-memory store
    this.errors.push(errorEntry);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorEntry);
    }

    // In production, send to external service
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(errorEntry);
    }

    return errorEntry;
  }

  determineSeverity(error) {
    if (error instanceof ValidationError) return ERROR_SEVERITY.LOW;
    if (error instanceof AuthenticationError) return ERROR_SEVERITY.MEDIUM;
    if (error instanceof AuthorizationError) return ERROR_SEVERITY.HIGH;
    if (error instanceof NetworkError) return ERROR_SEVERITY.MEDIUM;
    if (error instanceof DatabaseError) return ERROR_SEVERITY.HIGH;
    return ERROR_SEVERITY.MEDIUM;
  }

  determineCategory(error) {
    if (error instanceof ValidationError) return ERROR_CATEGORY.VALIDATION;
    if (error instanceof AuthenticationError) return ERROR_CATEGORY.AUTHENTICATION;
    if (error instanceof AuthorizationError) return ERROR_CATEGORY.AUTHORIZATION;
    if (error instanceof NetworkError) return ERROR_CATEGORY.NETWORK;
    if (error instanceof DatabaseError) return ERROR_CATEGORY.DATABASE;
    return ERROR_CATEGORY.UNKNOWN;
  }

  sendToExternalService(errorEntry) {
    // In a real application, you would send this to services like:
    // - Sentry
    // - LogRocket
    // - Bugsnag
    // - Custom logging endpoint
    
    // For now, we'll just store it locally
    try {
      const existingErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      existingErrors.push(errorEntry);
      localStorage.setItem('app_errors', JSON.stringify(existingErrors.slice(-50))); // Keep last 50
    } catch (e) {
      console.error('Failed to store error in localStorage:', e);
    }
  }

  getErrors() {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
  }
}

// Global error logger instance
export const errorLogger = new ErrorLogger();

/**
 * Wraps async functions with error handling
 * @param {Function} fn - Async function to wrap
 * @param {object} options - Error handling options
 * @returns {Function} - Wrapped function
 */
export function withErrorHandling(fn, options = {}) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      const context = {
        function: fn.name,
        arguments: args,
        ...options.context
      };

      const loggedError = errorLogger.log(error, context);

      // Re-throw with additional context if needed
      if (options.rethrow !== false) {
        throw error;
      }

      return { error: loggedError };
    }
  };
}

/**
 * Handles Supabase errors specifically
 * @param {object} supabaseError - Error from Supabase
 * @param {string} operation - The operation that failed
 * @returns {Error} - Standardized error
 */
export function handleSupabaseError(supabaseError, operation = 'database operation') {
  console.error(`Supabase error in ${operation}:`, supabaseError);

  // Handle specific Supabase error codes
  switch (supabaseError.code) {
    case '23505': // Unique violation
      return new ValidationError('This record already exists');
    case '23503': // Foreign key violation
      return new ValidationError('Referenced record does not exist');
    case '23502': // Not null violation
      return new ValidationError('Required field is missing');
    case '42501': // Insufficient privilege
      return new AuthorizationError('Insufficient permissions for this operation');
    case 'PGRST116': // Row Level Security violation
      return new AuthorizationError('Access denied by security policy');
    default:
      return new DatabaseError(supabaseError.message || 'Database operation failed');
  }
}

/**
 * Handles API errors
 * @param {Response} response - Fetch response object
 * @param {string} operation - The operation that failed
 * @returns {Error} - Standardized error
 */
export function handleApiError(response, operation = 'API call') {
  console.error(`API error in ${operation}:`, response.status, response.statusText);

  switch (response.status) {
    case 400:
      return new ValidationError('Invalid request data');
    case 401:
      return new AuthenticationError('Authentication required');
    case 403:
      return new AuthorizationError('Access denied');
    case 404:
      return new ValidationError('Resource not found');
    case 429:
      return new NetworkError('Too many requests. Please try again later.');
    case 500:
      return new NetworkError('Server error. Please try again later.');
    default:
      return new NetworkError(`API error: ${response.status} ${response.statusText}`);
  }
}

/**
 * Creates user-friendly error messages
 * @param {Error} error - The error object
 * @returns {string} - User-friendly message
 */
export function getUserFriendlyMessage(error) {
  if (error instanceof ValidationError) {
    return error.message;
  }
  
  if (error instanceof AuthenticationError) {
    return 'Please sign in to continue.';
  }
  
  if (error instanceof AuthorizationError) {
    return 'You do not have permission to perform this action.';
  }
  
  if (error instanceof NetworkError) {
    return 'Network error. Please check your connection and try again.';
  }
  
  if (error instanceof DatabaseError) {
    return 'Something went wrong. Please try again.';
  }

  // Generic fallback
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Error boundary helper for React components
 * @param {Error} error - The error object
 * @param {object} errorInfo - Error info from React
 * @param {string} componentName - Name of the component that errored
 */
export function logComponentError(error, errorInfo, componentName) {
  const context = {
    component: componentName,
    componentStack: errorInfo.componentStack,
    errorBoundary: true
  };

  errorLogger.log(error, context);
}

/**
 * Global error handler for unhandled errors
 */
export function setupGlobalErrorHandling() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    errorLogger.log(event.reason, { type: 'unhandled_promise_rejection' });
  });

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
    errorLogger.log(event.error, { type: 'uncaught_error' });
  });
}

/**
 * Retry mechanism for failed operations
 * @param {Function} operation - The operation to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise} - Result of the operation
 */
export async function retryOperation(operation, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Don't retry certain types of errors
      if (error instanceof ValidationError || error instanceof AuthorizationError) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
}

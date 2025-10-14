// API security utilities and middleware

import { checkRateLimit } from './validation.js';
import { errorLogger, NetworkError, AuthenticationError, AuthorizationError } from './errorHandler.js';

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  // General API endpoints
  GENERAL: { requests: 100, window: 15 * 60 * 1000 }, // 100 requests per 15 minutes
  
  // Authentication endpoints
  AUTH: { requests: 10, window: 15 * 60 * 1000 }, // 10 requests per 15 minutes
  
  // Status updates
  STATUS_UPDATE: { requests: 20, window: 60 * 1000 }, // 20 requests per minute
  
  // Company operations
  COMPANY_OPERATIONS: { requests: 10, window: 60 * 1000 }, // 10 requests per minute
  
  // Join requests
  JOIN_REQUESTS: { requests: 5, window: 60 * 1000 }, // 5 requests per minute
};

/**
 * IP-based rate limiting
 */
const ipRateLimitStore = new Map();

/**
 * Get client IP address from request
 * @param {object} req - Request object
 * @returns {string} - Client IP address
 */
function getClientIP(req) {
  return req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress ||
         'unknown';
}

/**
 * Rate limiting middleware
 * @param {object} limitConfig - Rate limit configuration
 * @returns {Function} - Middleware function
 */
export function rateLimitMiddleware(limitConfig = RATE_LIMITS.GENERAL) {
  return (req, res, next) => {
    try {
      const clientIP = getClientIP(req);
      const userAgent = req.headers['user-agent'] || 'unknown';
      const rateLimitKey = `${clientIP}:${userAgent}`;
      
      const result = checkRateLimit(
        rateLimitKey, 
        limitConfig.requests, 
        limitConfig.window
      );
      
      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', limitConfig.requests);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
      
      if (!result.allowed) {
        const error = new NetworkError('Rate limit exceeded. Please try again later.');
        errorLogger.log(error, {
          clientIP,
          userAgent,
          rateLimitKey,
          limitConfig
        });
        
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
        });
      }
      
      next();
    } catch (error) {
      console.error('Rate limiting error:', error);
      next(); // Continue on rate limiting errors
    }
  };
}

/**
 * CORS configuration
 */
export const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'https://corporacity.hustlehackai.in',
      // Add your production domains here
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // 24 hours
};

/**
 * Security headers middleware
 */
export function securityHeadersMiddleware(req, res, next) {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Strict Transport Security (HTTPS only)
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://*.supabase.co; " +
    "frame-ancestors 'none';"
  );
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  res.setHeader('Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  );
  
  next();
}

/**
 * Request validation middleware
 * @param {object} schema - Validation schema
 * @returns {Function} - Middleware function
 */
export function validateRequestMiddleware(schema) {
  return (req, res, next) => {
    try {
      const { isValid, errors } = validateRequestData(req.body, schema);
      
      if (!isValid) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors
        });
      }
      
      next();
    } catch (error) {
      console.error('Request validation error:', error);
      res.status(400).json({
        error: 'Invalid request format'
      });
    }
  };
}

/**
 * Validate request data against schema
 * @param {object} data - Request data
 * @param {object} schema - Validation schema
 * @returns {object} - Validation result
 */
function validateRequestData(data, schema) {
  const errors = {};
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors[field] = `${field} is required`;
      continue;
    }
    
    if (value !== undefined && value !== null && value !== '') {
      if (rules.type && typeof value !== rules.type) {
        errors[field] = `${field} must be of type ${rules.type}`;
        continue;
      }
      
      if (rules.minLength && value.length < rules.minLength) {
        errors[field] = `${field} must be at least ${rules.minLength} characters`;
        continue;
      }
      
      if (rules.maxLength && value.length > rules.maxLength) {
        errors[field] = `${field} must be no more than ${rules.maxLength} characters`;
        continue;
      }
      
      if (rules.pattern && !rules.pattern.test(value)) {
        errors[field] = `${field} format is invalid`;
        continue;
      }
      
      if (rules.enum && !rules.enum.includes(value)) {
        errors[field] = `${field} must be one of: ${rules.enum.join(', ')}`;
        continue;
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Authentication middleware for API routes
 * @param {object} supabase - Supabase client
 * @returns {Function} - Middleware function
 */
export function authMiddleware(supabase) {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        const error = new AuthenticationError('No authentication token provided');
        return res.status(401).json({
          error: 'Authentication required',
          message: 'Please provide a valid authentication token'
        });
      }
      
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        const authError = new AuthenticationError('Invalid authentication token');
        errorLogger.log(authError, { token: token.substring(0, 10) + '...' });
        
        return res.status(401).json({
          error: 'Authentication failed',
          message: 'Invalid or expired authentication token'
        });
      }
      
      req.user = user;
      next();
    } catch (error) {
      console.error('Authentication middleware error:', error);
      res.status(500).json({
        error: 'Authentication error',
        message: 'An error occurred during authentication'
      });
    }
  };
}

/**
 * Input sanitization middleware
 */
export function sanitizeInputMiddleware(req, res, next) {
  try {
    // Sanitize string inputs
    const sanitizeObject = (obj) => {
      if (typeof obj === 'string') {
        return obj.trim().replace(/[<>\"'&]/g, '');
      }
      if (typeof obj === 'object' && obj !== null) {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
          sanitized[key] = sanitizeObject(value);
        }
        return sanitized;
      }
      return obj;
    };
    
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }
    
    if (req.query) {
      req.query = sanitizeObject(req.query);
    }
    
    next();
  } catch (error) {
    console.error('Input sanitization error:', error);
    next();
  }
}

/**
 * Request logging middleware
 */
export function requestLoggingMiddleware(req, res, next) {
  const startTime = Date.now();
  const clientIP = getClientIP(req);
  const userAgent = req.headers['user-agent'] || 'unknown';
  
  // Log request
  console.log(`${req.method} ${req.path} - ${clientIP} - ${userAgent}`);
  
  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - startTime;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
}

/**
 * Error handling middleware
 */
export function errorHandlingMiddleware(err, req, res, next) {
  console.error('API Error:', err);
  
  // Log error
  errorLogger.log(err, {
    method: req.method,
    path: req.path,
    clientIP: getClientIP(req),
    userAgent: req.headers['user-agent']
  });
  
  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong. Please try again later.'
    });
  }
  
  // In development, return full error details
  res.status(500).json({
    error: err.message,
    stack: err.stack,
    details: err
  });
}

/**
 * API response wrapper
 * @param {object} data - Response data
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Response message
 * @returns {object} - Formatted response
 */
export function apiResponse(data = null, statusCode = 200, message = 'Success') {
  return {
    success: statusCode >= 200 && statusCode < 300,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString()
  };
}

/**
 * Pagination helper
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {object} - Pagination parameters
 */
export function getPaginationParams(page = 1, limit = 10) {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const offset = (pageNum - 1) * limitNum;
  
  return {
    page: pageNum,
    limit: limitNum,
    offset
  };
}

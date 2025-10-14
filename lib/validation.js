// Comprehensive input validation and sanitization utilities

/**
 * Sanitizes a string by removing potentially dangerous characters
 * @param {string} input - The input string to sanitize
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} - Sanitized string
 */
export function sanitizeString(input, maxLength = 255) {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Validates and sanitizes email addresses
 * @param {string} email - Email to validate
 * @returns {object} - {isValid: boolean, sanitized: string, error?: string}
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, sanitized: '', error: 'Email is required' };
  }

  const sanitized = sanitizeString(email.toLowerCase(), 254);
  
  if (sanitized.length === 0) {
    return { isValid: false, sanitized: '', error: 'Email cannot be empty' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return { isValid: false, sanitized: '', error: 'Invalid email format' };
  }

  return { isValid: true, sanitized };
}

/**
 * Validates and sanitizes company names
 * @param {string} name - Company name to validate
 * @returns {object} - {isValid: boolean, sanitized: string, error?: string}
 */
export function validateCompanyName(name) {
  if (!name || typeof name !== 'string') {
    return { isValid: false, sanitized: '', error: 'Company name is required' };
  }

  const sanitized = sanitizeString(name, 100);
  
  if (sanitized.length === 0) {
    return { isValid: false, sanitized: '', error: 'Company name cannot be empty' };
  }

  if (sanitized.length < 2) {
    return { isValid: false, sanitized: '', error: 'Company name must be at least 2 characters' };
  }

  if (sanitized.length > 100) {
    return { isValid: false, sanitized: '', error: 'Company name must be less than 100 characters' };
  }

  // Check for valid characters (letters, numbers, spaces, hyphens, apostrophes)
  const validNameRegex = /^[a-zA-Z0-9\s\-'&.]+$/;
  if (!validNameRegex.test(sanitized)) {
    return { isValid: false, sanitized: '', error: 'Company name contains invalid characters' };
  }

  return { isValid: true, sanitized };
}

/**
 * Validates and sanitizes full names
 * @param {string} name - Full name to validate
 * @returns {object} - {isValid: boolean, sanitized: string, error?: string}
 */
export function validateFullName(name) {
  if (!name || typeof name !== 'string') {
    return { isValid: false, sanitized: '', error: 'Full name is required' };
  }

  const sanitized = sanitizeString(name, 100);
  
  if (sanitized.length === 0) {
    return { isValid: false, sanitized: '', error: 'Full name cannot be empty' };
  }

  if (sanitized.length < 2) {
    return { isValid: false, sanitized: '', error: 'Full name must be at least 2 characters' };
  }

  if (sanitized.length > 100) {
    return { isValid: false, sanitized: '', error: 'Full name must be less than 100 characters' };
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const validNameRegex = /^[a-zA-Z\s\-'\.]+$/;
  if (!validNameRegex.test(sanitized)) {
    return { isValid: false, sanitized: '', error: 'Full name contains invalid characters' };
  }

  return { isValid: true, sanitized };
}

/**
 * Validates and sanitizes phone numbers
 * @param {string} phone - Phone number to validate
 * @returns {object} - {isValid: boolean, sanitized: string, error?: string}
 */
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return { isValid: true, sanitized: null }; // Phone is optional
  }

  const sanitized = phone.replace(/[^\d+\-\(\)\s]/g, '').trim();
  
  if (sanitized.length === 0) {
    return { isValid: true, sanitized: null };
  }

  if (sanitized.length < 10) {
    return { isValid: false, sanitized: '', error: 'Phone number must be at least 10 digits' };
  }

  if (sanitized.length > 20) {
    return { isValid: false, sanitized: '', error: 'Phone number must be less than 20 characters' };
  }

  return { isValid: true, sanitized };
}

/**
 * Validates and sanitizes company codes
 * @param {string} code - Company code to validate
 * @returns {object} - {isValid: boolean, sanitized: string, error?: string}
 */
export function validateCompanyCode(code) {
  if (!code || typeof code !== 'string') {
    return { isValid: false, sanitized: '', error: 'Company code is required' };
  }

  const sanitized = code.trim().toUpperCase();
  
  if (sanitized.length === 0) {
    return { isValid: false, sanitized: '', error: 'Company code cannot be empty' };
  }

  if (sanitized.length < 5) {
    return { isValid: false, sanitized: '', error: 'Company code must be at least 5 characters' };
  }

  if (sanitized.length > 10) {
    return { isValid: false, sanitized: '', error: 'Company code must be less than 10 characters' };
  }

  // Check for valid characters (letters and numbers only)
  const validCodeRegex = /^[A-Z0-9]+$/;
  if (!validCodeRegex.test(sanitized)) {
    return { isValid: false, sanitized: '', error: 'Company code can only contain letters and numbers' };
  }

  return { isValid: true, sanitized };
}

/**
 * Validates status types
 * @param {string} status - Status type to validate
 * @returns {object} - {isValid: boolean, sanitized: string, error?: string}
 */
export function validateStatusType(status) {
  const validStatuses = ['present', 'late', 'leave', 'visit', 'short_leave'];
  
  if (!status || typeof status !== 'string') {
    return { isValid: false, sanitized: '', error: 'Status type is required' };
  }

  const sanitized = status.trim().toLowerCase();
  
  if (!validStatuses.includes(sanitized)) {
    return { 
      isValid: false, 
      sanitized: '', 
      error: `Invalid status type. Must be one of: ${validStatuses.join(', ')}` 
    };
  }

  return { isValid: true, sanitized };
}

/**
 * Validates and sanitizes status messages
 * @param {string} message - Status message to validate
 * @returns {object} - {isValid: boolean, sanitized: string, error?: string}
 */
export function validateStatusMessage(message) {
  if (!message || typeof message !== 'string') {
    return { isValid: true, sanitized: '' }; // Message is optional
  }

  const sanitized = sanitizeString(message, 500);
  
  if (sanitized.length > 500) {
    return { isValid: false, sanitized: '', error: 'Status message must be less than 500 characters' };
  }

  return { isValid: true, sanitized };
}

/**
 * Validates UUID format
 * @param {string} uuid - UUID to validate
 * @returns {boolean} - Whether the UUID is valid
 */
export function validateUUID(uuid) {
  if (!uuid || typeof uuid !== 'string') return false;
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validates and sanitizes join request messages
 * @param {string} message - Join request message to validate
 * @returns {object} - {isValid: boolean, sanitized: string, error?: string}
 */
export function validateJoinRequestMessage(message) {
  if (!message || typeof message !== 'string') {
    return { isValid: true, sanitized: 'Request to join this company' }; // Default message
  }

  const sanitized = sanitizeString(message, 1000);
  
  if (sanitized.length > 1000) {
    return { isValid: false, sanitized: '', error: 'Join request message must be less than 1000 characters' };
  }

  return { isValid: true, sanitized };
}

/**
 * Rate limiting helper - simple in-memory rate limiter
 * @param {string} key - Unique key for rate limiting
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {object} - {allowed: boolean, remaining: number, resetTime: number}
 */
const rateLimitStore = new Map();

export function checkRateLimit(key, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Clean up old entries
  for (const [k, v] of rateLimitStore.entries()) {
    if (v.timestamp < windowStart) {
      rateLimitStore.delete(k);
    }
  }
  
  const current = rateLimitStore.get(key);
  
  if (!current || current.timestamp < windowStart) {
    // New window or first request
    rateLimitStore.set(key, { count: 1, timestamp: now });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }
  
  if (current.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: current.timestamp + windowMs };
  }
  
  current.count++;
  return { allowed: true, remaining: maxRequests - current.count, resetTime: current.timestamp + windowMs };
}

/**
 * Sanitizes HTML content to prevent XSS
 * @param {string} html - HTML content to sanitize
 * @returns {string} - Sanitized HTML
 */
export function sanitizeHTML(html) {
  if (!html || typeof html !== 'string') return '';
  
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates form data object
 * @param {object} data - Form data to validate
 * @param {object} schema - Validation schema
 * @returns {object} - {isValid: boolean, errors: object, sanitized: object}
 */
export function validateFormData(data, schema) {
  const errors = {};
  const sanitized = {};
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    const { validator, required = false, sanitizer } = rules;
    
    if (required && (!value || value.toString().trim() === '')) {
      errors[field] = `${field} is required`;
      continue;
    }
    
    if (value !== undefined && value !== null && value !== '') {
      if (sanitizer) {
        sanitized[field] = sanitizer(value);
      }
      
      if (validator) {
        const result = validator(sanitized[field] || value);
        if (!result.isValid) {
          errors[field] = result.error;
        } else {
          sanitized[field] = result.sanitized;
        }
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized
  };
}

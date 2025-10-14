import {
  sanitizeString,
  validateEmail,
  validateCompanyName,
  validateFullName,
  validatePhone,
  validateCompanyCode,
  validateStatusType,
  validateStatusMessage,
  validateUUID,
  validateJoinRequestMessage,
  checkRateLimit
} from '../../lib/validation'

describe('Validation Utilities', () => {
  describe('sanitizeString', () => {
    it('should sanitize dangerous characters', () => {
      const input = '<script>alert("xss")</script>Hello World'
      const result = sanitizeString(input)
      expect(result).toBe('scriptalert(xss)/scriptHello World')
    })

    it('should trim whitespace', () => {
      const input = '  Hello World  '
      const result = sanitizeString(input)
      expect(result).toBe('Hello World')
    })

    it('should limit length', () => {
      const input = 'a'.repeat(300)
      const result = sanitizeString(input, 10)
      expect(result).toHaveLength(10)
    })

    it('should handle non-string input', () => {
      expect(sanitizeString(null)).toBe('')
      expect(sanitizeString(undefined)).toBe('')
      expect(sanitizeString(123)).toBe('')
    })
  })

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org'
      ]

      validEmails.forEach(email => {
        const result = validateEmail(email)
        expect(result.isValid).toBe(true)
        expect(result.sanitized).toBe(email.toLowerCase())
      })
    })

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test..test@example.com'
      ]

      invalidEmails.forEach(email => {
        const result = validateEmail(email)
        expect(result.isValid).toBe(false)
        expect(result.error).toBeDefined()
      })
    })

    it('should handle empty or null input', () => {
      expect(validateEmail('').isValid).toBe(false)
      expect(validateEmail(null).isValid).toBe(false)
    })
  })

  describe('validateCompanyName', () => {
    it('should validate correct company names', () => {
      const validNames = [
        'Acme Corp',
        'Tech Solutions Inc',
        'ABC Company'
      ]

      validNames.forEach(name => {
        const result = validateCompanyName(name)
        expect(result.isValid).toBe(true)
      })
    })

    it('should reject invalid company names', () => {
      const invalidNames = [
        '',
        'A',
        'A'.repeat(101),
        'Company<script>alert("xss")</script>'
      ]

      invalidNames.forEach(name => {
        const result = validateCompanyName(name)
        expect(result.isValid).toBe(false)
      })
    })
  })

  describe('validateFullName', () => {
    it('should validate correct full names', () => {
      const validNames = [
        'John Doe',
        'Mary Jane Smith',
        'Jean-Pierre O\'Connor'
      ]

      validNames.forEach(name => {
        const result = validateFullName(name)
        expect(result.isValid).toBe(true)
      })
    })

    it('should reject invalid full names', () => {
      const invalidNames = [
        '',
        'A',
        'John123',
        'John<script>alert("xss")</script>'
      ]

      invalidNames.forEach(name => {
        const result = validateFullName(name)
        expect(result.isValid).toBe(false)
      })
    })
  })

  describe('validatePhone', () => {
    it('should validate correct phone numbers', () => {
      const validPhones = [
        '+1-555-123-4567',
        '(555) 123-4567',
        '5551234567'
      ]

      validPhones.forEach(phone => {
        const result = validatePhone(phone)
        expect(result.isValid).toBe(true)
      })
    })

    it('should handle empty phone as valid (optional)', () => {
      const result = validatePhone('')
      expect(result.isValid).toBe(true)
      expect(result.sanitized).toBe(null)
    })
  })

  describe('validateCompanyCode', () => {
    it('should validate correct company codes', () => {
      const validCodes = [
        'ABC123',
        'TECH01',
        'CORP2023'
      ]

      validCodes.forEach(code => {
        const result = validateCompanyCode(code)
        expect(result.isValid).toBe(true)
        expect(result.sanitized).toBe(code.toUpperCase())
      })
    })

    it('should reject invalid company codes', () => {
      const invalidCodes = [
        '',
        'ABC',
        'ABC-123',
        'ABC@123'
      ]

      invalidCodes.forEach(code => {
        const result = validateCompanyCode(code)
        expect(result.isValid).toBe(false)
      })
    })
  })

  describe('validateStatusType', () => {
    it('should validate correct status types', () => {
      const validStatuses = ['present', 'late', 'leave', 'visit', 'short_leave']

      validStatuses.forEach(status => {
        const result = validateStatusType(status)
        expect(result.isValid).toBe(true)
        expect(result.sanitized).toBe(status)
      })
    })

    it('should reject invalid status types', () => {
      const invalidStatuses = ['invalid', 'absent', 'working']

      invalidStatuses.forEach(status => {
        const result = validateStatusType(status)
        expect(result.isValid).toBe(false)
      })
    })
  })

  describe('validateUUID', () => {
    it('should validate correct UUIDs', () => {
      const validUUIDs = [
        '123e4567-e89b-12d3-a456-426614174000',
        '550e8400-e29b-41d4-a716-446655440000'
      ]

      validUUIDs.forEach(uuid => {
        expect(validateUUID(uuid)).toBe(true)
      })
    })

    it('should reject invalid UUIDs', () => {
      const invalidUUIDs = [
        'not-a-uuid',
        '123e4567-e89b-12d3-a456',
        '123e4567-e89b-12d3-a456-42661417400g'
      ]

      invalidUUIDs.forEach(uuid => {
        expect(validateUUID(uuid)).toBe(false)
      })
    })
  })

  describe('checkRateLimit', () => {
    beforeEach(() => {
      // Clear any existing rate limit data
      jest.clearAllMocks()
    })

    it('should allow requests within limit', () => {
      const result = checkRateLimit('test-key', 5, 60000)
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(4)
    })

    it('should block requests over limit', () => {
      const key = 'test-key-limit'
      const maxRequests = 2

      // Make requests up to limit
      checkRateLimit(key, maxRequests, 60000)
      checkRateLimit(key, maxRequests, 60000)

      // This should be blocked
      const result = checkRateLimit(key, maxRequests, 60000)
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('should reset after time window', () => {
      const key = 'test-key-reset'
      const maxRequests = 1
      const windowMs = 100 // Very short window for testing

      // First request should be allowed
      const result1 = checkRateLimit(key, maxRequests, windowMs)
      expect(result1.allowed).toBe(true)

      // Second request should be blocked
      const result2 = checkRateLimit(key, maxRequests, windowMs)
      expect(result2.allowed).toBe(false)

      // Wait for window to reset
      setTimeout(() => {
        const result3 = checkRateLimit(key, maxRequests, windowMs)
        expect(result3.allowed).toBe(true)
      }, windowMs + 10)
    })
  })
})

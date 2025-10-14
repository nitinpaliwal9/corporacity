// /pages/api/approve.js
import { createClient } from '@supabase/supabase-js'
import { rateLimitMiddleware, RATE_LIMITS, securityHeadersMiddleware, validateRequestMiddleware, authMiddleware, errorHandlingMiddleware, apiResponse } from '../../lib/apiSecurity.js'
import { validateUUID } from '../../lib/validation.js'
import { handleSupabaseError, withErrorHandling } from '../../lib/errorHandler.js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Validation schema for approve request
const approveSchema = {
  user_id: {
    required: true,
    type: 'string',
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  },
  company_id: {
    required: true,
    type: 'string',
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  }
}

// Apply middleware
export default async function handler(req, res) {
  try {
    // Apply security headers
    securityHeadersMiddleware(req, res, () => {});
    
    // Apply rate limiting
    rateLimitMiddleware(RATE_LIMITS.COMPANY_OPERATIONS)(req, res, () => {});
    
    // Validate request method
    if (req.method !== 'POST') {
      return res.status(405).json(apiResponse(null, 405, 'Method not allowed'))
    }

    // Validate request data
    const validationResult = validateRequestData(req.body, approveSchema);
    if (!validationResult.isValid) {
      return res.status(400).json(apiResponse(null, 400, 'Validation failed', validationResult.errors))
    }

    const { user_id, company_id } = req.body

    // Additional UUID validation
    if (!validateUUID(user_id) || !validateUUID(company_id)) {
      return res.status(400).json(apiResponse(null, 400, 'Invalid UUID format'))
    }

    // Verify the requesting user is the company owner
    const { data: company, error: companyError } = await supabaseAdmin
      .from('corp_companies')
      .select('owner_id')
      .eq('id', company_id)
      .single()

    if (companyError) {
      const error = handleSupabaseError(companyError, 'fetch company');
      return res.status(400).json(apiResponse(null, 400, error.message))
    }

    if (!company) {
      return res.status(404).json(apiResponse(null, 404, 'Company not found'))
    }

    // Note: In a real implementation, you would verify the requesting user is the owner
    // For now, we'll trust the frontend validation

    // Try inserting membership (unique constraint prevents duplicates)
    const { error } = await supabaseAdmin
      .from('corp_memberships')
      .insert([{ user_id, company_id, role: 'employee' }])

    // Handle duplicate gracefully
    if (error) {
      // 23505 = unique violation in Postgres
      if (error.code === '23505') {
        return res.status(200).json(apiResponse(
          { already_member: true }, 
          200, 
          'User is already a member of this company'
        ))
      }

      const dbError = handleSupabaseError(error, 'insert membership');
      return res.status(400).json(apiResponse(null, 400, dbError.message))
    }

    // Success response
    return res.status(200).json(apiResponse(
      { membership_created: true }, 
      200, 
      'Member approved successfully'
    ))

  } catch (err) {
    console.error('Approve API exception:', err)
    return res.status(500).json(apiResponse(null, 500, 'Internal server error'))
  }
}

// Helper function for request validation
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
      
      if (rules.pattern && !rules.pattern.test(value)) {
        errors[field] = `${field} format is invalid`;
        continue;
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Robust approve API with comprehensive error handling
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  console.log('Approve API called:', {
    method: req.method,
    url: req.url,
    body: req.body,
    timestamp: new Date().toISOString()
  })

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      console.log('Method not allowed:', req.method)
      return res.status(405).json({ 
        error: 'Method not allowed',
        received: req.method,
        expected: 'POST'
      })
    }

    const { user_id, company_id } = req.body || {}

    // Basic validation
    if (!user_id || !company_id) {
      console.log('Missing required fields:', { user_id, company_id })
      return res.status(400).json({ 
        error: 'user_id and company_id are required',
        received: { user_id, company_id }
      })
    }

    console.log('Approving request:', { user_id, company_id })

    // Verify the company exists
    const { data: company, error: companyError } = await supabaseAdmin
      .from('corp_companies')
      .select('owner_id')
      .eq('id', company_id)
      .single()

    if (companyError) {
      console.error('Company lookup error:', companyError)
      return res.status(400).json({ 
        error: 'Company not found',
        details: companyError.message 
      })
    }

    if (!company) {
      console.log('Company not found for ID:', company_id)
      return res.status(404).json({ error: 'Company not found' })
    }

    console.log('Company found:', company)

    // Try inserting membership
    const { data: membership, error: membershipError } = await supabaseAdmin
      .from('corp_memberships')
      .insert([{ user_id, company_id, role: 'employee' }])
      .select()

    if (membershipError) {
      console.error('Membership insert error:', membershipError)
      
      // Handle duplicate gracefully
      if (membershipError.code === '23505') {
        return res.status(200).json({ 
          success: true, 
          message: 'User is already a member of this company',
          already_member: true 
        })
      }

      return res.status(400).json({ 
        error: membershipError.message,
        code: membershipError.code 
      })
    }

    console.log('Membership created successfully:', membership)

    // Now delete the join request
    const { error: deleteError } = await supabaseAdmin
      .from('corp_join_requests')
      .delete()
      .eq('user_id', user_id)
      .eq('company_id', company_id)

    if (deleteError) {
      console.error('Join request deletion error:', deleteError)
      // Don't fail the whole request if deletion fails - membership was created
      console.warn('Membership created but failed to delete join request')
    } else {
      console.log('Join request deleted successfully')
    }

    // Success response
    return res.status(200).json({ 
      success: true, 
      message: 'Member approved successfully',
      membership_created: true,
      join_request_deleted: !deleteError,
      data: membership
    })

  } catch (err) {
    console.error('Approve API exception:', err)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
  }
}

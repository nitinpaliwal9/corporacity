// Simple approve API without complex middleware
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const { user_id, company_id } = req.body

    // Basic validation
    if (!user_id || !company_id) {
      return res.status(400).json({ error: 'user_id and company_id are required' })
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
      return res.status(400).json({ error: 'Company not found' })
    }

    if (!company) {
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

      return res.status(400).json({ error: membershipError.message })
    }

    console.log('Membership created:', membership)

    // Success response
    return res.status(200).json({ 
      success: true, 
      message: 'Member approved successfully',
      membership_created: true 
    })

  } catch (err) {
    console.error('Approve API exception:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

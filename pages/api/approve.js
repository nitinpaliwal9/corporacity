// /pages/api/approve.js
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { user_id, company_id } = req.body
    if (!user_id || !company_id) {
      return res.status(400).json({ error: 'Missing user_id or company_id' })
    }

    // ✅ Try inserting membership (unique constraint prevents duplicates)
    const { error } = await supabaseAdmin
      .from('corp_memberships')
      .insert([{ user_id, company_id, role: 'employee' }])

    // ⚠️ Handle duplicate gracefully
    if (error) {
      // 23505 = unique violation in Postgres
      if (error.code === '23505') {
        return res
          .status(200)
          .json({ success: true, message: 'User is already a member of this company.' })
      }

      console.error('Insert membership error:', error)
      return res.status(400).json({ error })
    }

    // ✅ Success response
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Approve API exception:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

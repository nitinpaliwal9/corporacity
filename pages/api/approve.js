// /pages/api/approve.js
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  const { user_id, company_id } = req.body
  const { error } = await supabaseAdmin
    .from('corp_memberships')
    .insert([{ user_id, company_id, role: 'employee' }])

  if (error) return res.status(400).json({ error })
  res.status(200).json({ success: true })
}

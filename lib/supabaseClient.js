// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Keep config minimal but explicit so sessions persist and tokens auto-refresh.
// NOTE: we avoid using SDK helper methods that may be missing in certain versions.
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // persist session to localStorage so page reloads retain the logged-in user
    persistSession: true,
    // refresh tokens automatically when possible
    autoRefreshToken: true,
    // do not rely on any automatic URL-session parsing here — we'll handle auth flow in _app.js
  },
})

export default supabase

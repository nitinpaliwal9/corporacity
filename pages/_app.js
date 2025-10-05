// pages/_app.js
import '../styles/globals.css'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import supabase from '../lib/supabaseClient'

function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    // Parse session from URL (when returning from OAuth)
    const parseUrlSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true })
        if (error) {
          console.debug('getSessionFromUrl warning', error.message || error)
        } else if (data?.session) {
          // session present after OAuth
          await postSignInFlow(data.session)
        }
      } catch (err) {
        console.error('Error parsing session from URL', err)
      }
    }

    // Listen to realtime auth events (SIGNED_IN)
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await postSignInFlow(session)
      }
    })

    parseUrlSession()
    return () => {
      listener?.subscription?.unsubscribe()
    }
  }, [])

  // Post-sign-in logic:
  // - ensure corp_profiles row exists
  // - if profile incomplete -> redirect to /profile-setup
  // - if no membership: auto-join DEMO123 (only for demo), else leave for user to create/join
  // - redirect to /ceo if owner else /employee
  const postSignInFlow = async (session) => {
    if (!session?.user) return
    const user = session.user

    try {
      // ensure profile exists
      const { data: profile } = await supabase
        .from('corp_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile) {
        await supabase.from('corp_profiles').insert([{
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || null
        }])
      }

      // re-fetch profile to check completeness
      const { data: freshProfile } = await supabase
        .from('corp_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      // If profile is missing required fields, redirect to profile setup
      const needsProfile = !freshProfile || !freshProfile.full_name
      if (needsProfile) {
        // keep any query params so the setup can use them
        router.push('/profile-setup')
        return
      }

      // check membership
      const { data: mems } = await supabase
        .from('corp_memberships')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)

      // if no membership, try to auto-join demo (DEMO123). This is only for quick testing.
      if (!mems || mems.length === 0) {
        const { data: demoCompany } = await supabase
          .from('corp_companies')
          .select('*')
          .eq('code', 'DEMO123')
          .limit(1)
          .maybeSingle()

        if (demoCompany) {
          await supabase.from('corp_memberships').insert([{
            user_id: user.id,
            company_id: demoCompany.id,
            role: 'employee'
          }])
        }
      }

      // find if user owns any company
      const { data: owned } = await supabase
        .from('corp_companies')
        .select('id')
        .eq('owner_id', user.id)
        .limit(1)

      if (owned && owned.length > 0) {
        router.push('/ceo')
      } else {
        router.push('/employee')
      }

    } catch (err) {
      console.error('postSignInFlow error', err)
    }
  }

  return <Component {...pageProps} />
}

export default App

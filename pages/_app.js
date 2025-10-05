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

  // Post sign-in: ensure profile exists, require full_name, then route user
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

      // If profile missing required fields -> redirect to profile-setup
      const needsProfile = !freshProfile || !freshProfile.full_name
      if (needsProfile) {
        router.push('/profile-setup')
        return
      }

      // check membership
      const { data: mems } = await supabase
        .from('corp_memberships')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)

      // If no membership, send to onboarding where user chooses Create or Join
      if (!mems || mems.length === 0) {
        router.push('/onboarding')
        return
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

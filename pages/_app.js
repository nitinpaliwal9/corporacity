// pages/_app.js
import '../styles/globals.css'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import supabase from '../lib/supabaseClient'

function App({ Component, pageProps }) {
  const router = useRouter()
  const bootstrappedRef = useRef(false)

  useEffect(() => {
    let listener = null
    let cancelled = false

    const bootstrap = async () => {
      // 1) try to restore persisted session (if any)
      try {
        const { data } = await supabase.auth.getSession()
        if (data?.session) {
          await postSignInFlow(data.session)
        }
      } catch (err) {
        console.debug('getSession() failed or not available:', err)
      }

      // 2) subscribe to auth state changes for future sign-ins
      const sub = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await postSignInFlow(session)
        } else if (event === 'SIGNED_OUT') {
          router.push('/')
        }
      })

      // keep reference for cleanup
      listener = sub
      bootstrappedRef.current = true
    }

    bootstrap()

    return () => {
      cancelled = true
      try {
        // unsubscribe callback depending on SDK shape
        if (listener?.subscription?.unsubscribe) listener.subscription.unsubscribe()
        else if (listener?.unsubscribe) listener.unsubscribe()
      } catch (e) {}
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

      // re-fetch updated profile
      const { data: freshProfile } = await supabase
        .from('corp_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      // if full_name missing → go to profile setup
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

      if (!mems || mems.length === 0) {
        router.push('/onboarding')
        return
      }

      // check if user owns a company
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

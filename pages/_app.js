// pages/_app.js
import '../styles/globals.css'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import supabase from '../lib/supabaseClient'

function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    // 1) If user returned from OAuth flow, let supabase-js parse/store the session from URL
    const parseUrlSession = async () => {
      try {
        // this reads tokens from the URL and stores session locally
        const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true })
        if (error) {
          // Not fatal — often no session in URL (if not just returned from OAuth)
          console.debug('getSessionFromUrl warning', error.message || error)
        } else if (data?.session) {
          console.log('OAuth session stored', data.session)
          // proceed to ensure profile + membership + redirect
          await ensureProfileAndDemoMembership(data.session)
        }
      } catch (err) {
        console.error('Error parsing session from URL', err)
      }
    }

    // 2) subscribe to live auth events also (SIGNED_IN will fire normally)
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event', event)
      if (event === 'SIGNED_IN' && session) {
        await ensureProfileAndDemoMembership(session)
      }
    })

    // try parsing url once on mount
    parseUrlSession()

    return () => {
      listener?.subscription?.unsubscribe()
    }
  }, [])

  // helper: create profile, create demo membership, redirect
  const ensureProfileAndDemoMembership = async (session) => {
    if (!session?.user) return
    const user = session.user
    try {
      // 1) ensure profile exists
      const { data: profile } = await supabase
        .from('corp_profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile) {
        await supabase.from('corp_profiles').insert([{
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || null
        }])
      }

      // 2) ensure membership exists (if none, add to DEMO123 if present)
      const { data: mem } = await supabase
        .from('corp_memberships')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)

      if (!mem || mem.length === 0) {
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

      // 3) check if user owns a company -> redirect to /ceo else -> /employee
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
      console.error('ensureProfileAndDemoMembership error', err)
    }
  }

  return <Component {...pageProps} />
}

export default App

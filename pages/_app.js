// pages/_app.js
import '../styles/globals.css'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import supabase from '../lib/supabaseClient'
import ErrorBoundary from '../components/ErrorBoundary'
import PWAInstall from '../components/ui/PWAInstall'
import { initializeAnalytics, analytics } from '../lib/analytics'
import { setupGlobalErrorHandling } from '../lib/errorHandler'

function App({ Component, pageProps }) {
  const router = useRouter()
  const bootstrappedRef = useRef(false)
  const listenerRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    // Initialize analytics and error handling
    initializeAnalytics()
    setupGlobalErrorHandling()
    
    // Register service worker for PWA
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration)
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error)
        })
    }

    const bootstrap = async () => {
      // 1) try to restore persisted session (if any)
      try {
        // supabase.auth.getSession() is v2-style; wrap in try/catch to be safe
        const maybe = await supabase.auth.getSession?.()
        const session = maybe?.data?.session ?? maybe?.session ?? null

        if (session) {
          analytics.setUserId(session.user.id)
          await postSignInFlow(session)
        }
      } catch (err) {
        // don't fail hard — older/newer SDK shapes might differ
        console.debug('getSession() unavailable or failed:', err)
      }

      // 2) subscribe to auth state changes for future sign-ins
      try {
        const sub = await supabase.auth.onAuthStateChange?.(
          async (event, session) => {
            // keep behavior deliberate and safe
            if (event === 'SIGNED_IN' && session) {
              analytics.setUserId(session.user.id)
              analytics.track('user_signed_in', { method: 'session_restore' })
              await postSignInFlow(session)
            } else if (event === 'SIGNED_OUT') {
              analytics.track('user_signed_out')
              analytics.setUserId(null)
              // on sign-out, send user to the guest landing page
              if (router.pathname !== '/') router.replace('/')
            }
          }
        )

        // store listener for cleanup. different SDKs return different shapes.
        listenerRef.current = sub
      } catch (err) {
        console.debug('onAuthStateChange unavailable or failed:', err)
      }

      bootstrappedRef.current = true
      if (!cancelled) setReady(true)
    }

    bootstrap()

    return () => {
      cancelled = true
      // unsubscribe gracefully across SDK versions
      try {
        const sub = listenerRef.current
        if (!sub) return

        // v2: sub?.subscription?.unsubscribe()
        if (sub?.subscription?.unsubscribe) sub.subscription.unsubscribe()
        // v1: sub?.unsubscribe()
        else if (typeof sub.unsubscribe === 'function') sub.unsubscribe()
        // v2 alternative: sub?.data?.subscription?.unsubscribe()
        else if (sub?.data?.subscription?.unsubscribe) sub.data.subscription.unsubscribe()
      } catch (e) {
        console.debug('error unsubscribing auth listener', e)
      }
    }
  }, []) // run once on client

  // Post sign-in: ensure profile, require full_name, then route user
  const postSignInFlow = async (session) => {
    if (!session?.user) return
    const user = session.user

    try {
      // ensure profile exists
      const { data: profile, error: profileErr } = await supabase
        .from('corp_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (profileErr) {
        console.debug('profile select error (non-fatal):', profileErr)
      }

      if (!profile) {
        const insertPayload = {
          id: user.id,
          email: user.email ?? null,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        }
        const { error: insertErr } = await supabase
          .from('corp_profiles')
          .insert([insertPayload])

        if (insertErr) {
          console.warn('failed to insert corp_profiles:', insertErr)
        }
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
        if (router.pathname !== '/profile-setup') router.replace('/profile-setup')
        return
      }

      // check membership
      const { data: mems } = await supabase
        .from('corp_memberships')
        .select('id, company_id')
        .eq('user_id', user.id)
        .limit(1)

      if (!mems || mems.length === 0) {
        if (router.pathname !== '/onboarding') router.replace('/onboarding')
        return
      }

      // check if user owns a company
      const { data: owned } = await supabase
        .from('corp_companies')
        .select('id')
        .eq('owner_id', user.id)
        .limit(1)

      if (owned && owned.length > 0) {
        if (router.pathname !== '/ceo') router.replace('/ceo')
      } else {
        if (router.pathname !== '/employee') router.replace('/employee')
      }
    } catch (err) {
      console.error('postSignInFlow error', err)
    }
  }

  // Render app even while bootstrapping to avoid blank screen for public pages,
  // but don't render until initial bootstrap attempt finished to avoid race conditions
  if (!ready) {
    // simple client-side placeholder while we detect session.
    return null
  }

  return (
    <ErrorBoundary>
      <Component {...pageProps} />
      <PWAInstall />
    </ErrorBoundary>
  )
}

export default App

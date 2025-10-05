// pages/join.js
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import supabase from '../lib/supabaseClient'

export default function JoinCompany() {
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    const boot = async () => {
      try {
        // Try v2 getUser shape
        const maybe = await supabase.auth.getUser?.()
        const u = maybe?.data?.user ?? maybe?.user ?? null

        // Fallback to getSession (older/newer shapes)
        if (!u) {
          const maybeSession = await supabase.auth.getSession?.()
          const session = maybeSession?.data?.session ?? maybeSession?.session ?? null
          if (session?.user) {
            if (mounted) setUser(session.user)
            return
          }
        }

        if (u && mounted) setUser(u)
      } catch (err) {
        console.debug('auth bootstrap error (non-fatal):', err)
      }
    }

    boot()
    return () => { mounted = false }
  }, [])

  const requestJoin = async () => {
    if (!user) return setMsg('Please sign in first on the homepage.')
    if (!code.trim()) return setMsg('Please enter a valid company ID.')

    setLoading(true)
    setMsg('Checking company...')

    try {
      // Step 1: find company by code
      const { data: company, error: companyErr } = await supabase
        .from('corp_companies')
        .select('*')
        .eq('code', code.trim())
        .maybeSingle()

      if (companyErr) {
        console.error('company lookup error', companyErr)
        setMsg('Error while checking company. See console for details.')
        setLoading(false)
        return
      }

      if (!company) {
        setMsg('❌ Company not found. Check the ID and try again.')
        setLoading(false)
        return
      }

      // Step 2: check if already member
      const { data: member, error: memberErr } = await supabase
        .from('corp_memberships')
        .select('*')
        .eq('user_id', user.id)
        .eq('company_id', company.id)
        .maybeSingle()

      if (memberErr) {
        console.error('membership check error', memberErr)
        setMsg('Error checking membership. See console.')
        setLoading(false)
        return
      }

      if (member) {
        setMsg('You are already a member of this company.')
        setLoading(false)
        return
      }

      // Step 3: check if a join request already exists
      const { data: existing, error: existingErr } = await supabase
        .from('corp_join_requests')
        .select('*')
        .eq('company_id', company.id)
        .eq('user_id', user.id)
        .maybeSingle()

      if (existingErr) {
        console.error('existing request check error', existingErr)
        setMsg('Error checking existing requests. See console.')
        setLoading(false)
        return
      }

      if (existing) {
        setMsg('You already have a pending join request for this company.')
        setLoading(false)
        return
      }

      // Step 4: insert new join request (final check + insert)
      const { data: insertData, error: insertErr } = await supabase
        .from('corp_join_requests')
        .insert([
          {
            company_id: company.id,
            user_id: user.id,
            message: 'Request to join this company',
          },
        ])

      if (insertErr) {
        // Surface RLS / permission errors clearly
        console.error('join request insert error', insertErr)
        const friendly = insertErr.message || 'Failed to send join request (permissions or RLS may block this).'
        setMsg(`❌ ${friendly}`)
        setLoading(false)
        return
      }

      setMsg(`✅ Join request sent to ${company.name}. Please wait for CEO approval.`)

      setTimeout(() => {
        router.push('/employee')
      }, 1200)
    } catch (err) {
      console.error('join-company unexpected error:', err)
      setMsg(err?.message || JSON.stringify(err) || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h2 className="text-xl font-semibold mb-4">Join Company</h2>

      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter company ID"
        className="border p-2 rounded w-full mb-2"
      />

      <button
        onClick={requestJoin}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Sending Request...' : 'Request to Join'}
      </button>

      {msg && (
        <div className="mt-4 bg-gray-50 border p-3 rounded text-sm text-gray-700">
          {msg}
        </div>
      )}
    </div>
  )
}

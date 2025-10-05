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
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
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

      if (companyErr) throw companyErr
      if (!company) {
        setMsg('❌ Company not found. Check the ID and try again.')
        setLoading(false)
        return
      }

      // Step 2: check if already member
      const { data: member } = await supabase
        .from('corp_memberships')
        .select('*')
        .eq('user_id', user.id)
        .eq('company_id', company.id)
        .maybeSingle()

      if (member) {
        setMsg('You are already a member of this company.')
        setLoading(false)
        return
      }

      // Step 3: check if a join request already exists
      const { data: existing } = await supabase
        .from('corp_join_requests')
        .select('*')
        .eq('company_id', company.id)
        .eq('user_id', user.id)
        .maybeSingle()

      if (existing) {
        setMsg('You already have a pending join request for this company.')
        setLoading(false)
        return
      }

      // Step 4: insert new join request
      const { error } = await supabase.from('corp_join_requests').insert([
        {
          company_id: company.id,
          user_id: user.id,
          message: 'Request to join this company',
        },
      ])

      if (error) throw error

      setMsg(`✅ Join request sent to ${company.name}. Please wait for CEO approval.`)

      // optional redirect after 2 seconds
      setTimeout(() => {
        router.push('/employee')
      }, 2000)
    } catch (err) {
      console.error('join-company error:', err)
      setMsg(err.message || 'Something went wrong. Please try again.')
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

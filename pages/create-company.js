// pages/create-company.js
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import supabase from '../lib/supabaseClient'

export default function CreateCompany() {
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // wait for supabase session to load
    const loadUser = async () => {
      for (let i = 0; i < 10; i++) {
        const { data: sessionData } = await supabase.auth.getSession()
        const currentUser = sessionData?.session?.user || null
        if (currentUser) {
          setUser(currentUser)
          return
        }
        await new Promise((r) => setTimeout(r, 200))
      }
      setMsg('⚠️ No active session found. Please sign in again.')
    }
    loadUser()
  }, [])

  const create = async () => {
    if (!user) return setMsg('Please sign in first.')
    if (!name.trim()) return setMsg('Enter a valid company name.')

    setLoading(true)
    setMsg('Creating company...')

    try {
      // ✅ generate unique company code
      const code =
        name.split(' ')[0].toUpperCase().slice(0, 5) +
        Math.random().toString(36).slice(2, 7).toUpperCase()

      // ✅ ensure owner_id is set, RLS-safe insert
      const { data, error } = await supabase
        .from('corp_companies')
        .insert([{ name: name.trim(), code, owner_id: user.id }])
        .select()
        .single()

      if (error) {
        console.error('Insert company error:', error)
        // 23505 = duplicate key violation
        if (error.code === '23505') {
          setMsg('⚠️ A company with this code already exists. Try again.')
          return
        }
        throw error
      }

      // ✅ create CEO membership (safe, uses same session)
      const { error: memErr } = await supabase
        .from('corp_memberships')
        .insert([{ user_id: user.id, company_id: data.id, role: 'owner' }])

      if (memErr) {
        console.error('Insert membership error:', memErr)
        // not fatal, but log it for admin debugging
      }

      setMsg(`✅ Company created successfully! Company ID: ${data.code}`)

      // short delay so message is visible before redirect
      setTimeout(() => router.push('/ceo'), 1500)
    } catch (err) {
      console.error('create-company exception:', err)
      setMsg(err.message || 'Failed to create company. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h2 className="text-xl font-semibold mb-4">Create Company</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Company name"
        className="border p-2 rounded w-full mb-2"
      />

      <button
        onClick={create}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create'}
      </button>

      {msg && (
        <div className="mt-4 bg-gray-50 border p-3 rounded text-sm text-gray-700">
          {msg}
        </div>
      )}
    </div>
  )
}

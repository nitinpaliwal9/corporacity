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
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  const create = async () => {
    if (!user) return setMsg('Please sign in first.')
    if (!name.trim()) return setMsg('Enter a valid company name.')

    setLoading(true)
    setMsg('Creating company...')

    try {
      // generate unique company code
      const code =
        name.split(' ')[0].toUpperCase().slice(0, 5) +
        Math.random().toString(36).slice(2, 7).toUpperCase()

      // create company
      const { data, error } = await supabase
        .from('corp_companies')
        .insert([{ name, code, owner_id: user.id }])
        .select()
        .single()

      if (error) throw error

      // add membership for the owner (CEO)
      await supabase.from('corp_memberships').insert([
        { user_id: user.id, company_id: data.id, role: 'owner' }
      ])

      setMsg(`✅ Company created successfully! Company ID: ${data.code}`)

      // short delay so message is visible before redirect
      setTimeout(() => {
        router.push('/ceo')
      }, 1500)
    } catch (err) {
      console.error('create-company error:', err)
      setMsg(err.message || 'Failed to create company.')
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

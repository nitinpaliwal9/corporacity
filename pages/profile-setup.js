// pages/profile-setup.js
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import supabase from '../lib/supabaseClient'

export default function ProfileSetup() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [roleChoice, setRoleChoice] = useState('employee') // default
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      // try to prefill name if metadata exists
      setFullName(data.user?.user_metadata?.full_name || data.user?.user_metadata?.name || '')
    })
  }, [])

  const saveProfile = async () => {
    if (!user) return setMsg('Please sign in first.')
    if (!fullName.trim()) return setMsg('Please enter your full name.')

    setLoading(true)
    try {
      await supabase.from('corp_profiles').upsert([{
        id: user.id,
        email: user.email,
        full_name: fullName,
        phone: phone || null
      }])

      // If the user chose "I'm a CEO / want to create company" -> redirect to create company
      if (roleChoice === 'create') {
        router.push('/create-company')
        return
      }

      // otherwise proceed to post-sign-in flow (trigger by refreshing session)
      // We'll trigger the same postSignInFlow by redirecting to home which will call post-sign-in
      router.push('/')
    } catch (err) {
      console.error('saveProfile error', err)
      setMsg('Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC] p-6">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Complete your profile</h2>
        <p className="text-sm text-gray-600 mb-4">One quick step so your manager and colleagues recognise you.</p>

        <label className="text-sm block mb-1">Full name</label>
        <input value={fullName} onChange={(e)=>setFullName(e.target.value)} className="border p-2 rounded w-full mb-3" />

        <label className="text-sm block mb-1">Phone (optional)</label>
        <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="border p-2 rounded w-full mb-3" />

        <div className="mb-4">
          <label className="block mb-2 text-sm">What best describes you?</label>
          <div className="flex gap-3">
            <button onClick={()=>setRoleChoice('employee')} className={`px-3 py-2 border rounded ${roleChoice==='employee' ? 'bg-blue-50 border-blue-300' : ''}`}>I'm an employee</button>
            <button onClick={()=>setRoleChoice('create')} className={`px-3 py-2 border rounded ${roleChoice==='create' ? 'bg-blue-50 border-blue-300' : ''}`}>I want to create a company</button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={saveProfile} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
            {loading ? 'Saving...' : 'Save and continue'}
          </button>
          <button onClick={() => router.push('/')} className="px-3 py-2 rounded border">Cancel</button>
        </div>

        {msg && <div className="mt-3 text-sm text-red-600">{msg}</div>}
      </div>
    </div>
  )
}

// pages/employee.js
'use client'
import { useState, useEffect } from 'react'
import supabase from '../lib/supabaseClient'

const STATUS_TYPES = [
  { key: 'present', label: 'Present ✅' },
  { key: 'late', label: 'I\'m Late 🕗' },
  { key: 'leave', label: 'On Leave 🌴' },
  { key: 'visit', label: 'On Visit 🧭' },
  { key: 'short_leave', label: 'Short Leave 🕓' }
]

export default function EmployeeStatus() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    // fetch current user + profile
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (data.user) {
        const { data: prof } = await supabase.from('corp_profiles').select('*').eq('id', data.user.id).maybeSingle()
        setProfile(prof)
      }
    })
  }, [])

  const postStatus = async (type) => {
    if (!user) return setMsg('Sign in first on the homepage.')
    // use corp_memberships
    const { data: membership } = await supabase.from('corp_memberships').select('*').eq('user_id', user.id).limit(1).maybeSingle()
    if (!membership) return setMsg('You are not member of any company. Ask admin to approve your join request.')

    const { error } = await supabase.from('corp_statuses').insert([{ user_id: user.id, company_id: membership.company_id, type, message: '' }])
    if (error) setMsg(error.message)
    else setMsg('Status posted.')
  }

  return (
    <div className='container'>
      <h2 className='text-xl font-semibold mb-4'>Update Your Day</h2>
      {profile && <div className='mb-4'>Signed in as <strong>{profile.full_name || user.email}</strong></div>}
      <div className='grid grid-cols-2 gap-3 mb-4'>
        {STATUS_TYPES.map(s => (
          <button key={s.key} onClick={() => postStatus(s.key)} className='border rounded p-3 text-left'>
            {s.label}
          </button>
        ))}
      </div>
      {msg && <div>{msg}</div>}
    </div>
  )
}

// pages/create-company.js
'use client'
import { useState, useEffect } from 'react'
import supabase from '../lib/supabaseClient'

export default function CreateCompany() {
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  const create = async () => {
    setMsg('Creating...')
    if (!user) return setMsg('Please sign in first.')
    if (!name) return setMsg('Enter company name.')

    const code = name.split(' ')[0].toUpperCase().slice(0,5) + Math.random().toString(36).slice(2,7).toUpperCase()
    const { data, error } = await supabase.from('corp_companies').insert([{
      name, code, owner_id: user.id
    }]).select().single()

    if (error) setMsg(error.message)
    else {
      // create membership for the owner too
      await supabase.from('corp_memberships').insert([{ user_id: user.id, company_id: data.id, role: 'owner' }])
      setMsg(`Company created! Code: ${data.code}. Share this link with employees: ${location.origin}/join`)
    }
  }

  return (
    <div className='container'>
      <h2 className='text-xl font-semibold mb-4'>Create Company</h2>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder='Company name' className='border p-2 rounded w-full mb-2' />
      <button onClick={create} className='bg-green-600 text-white px-4 py-2 rounded'>Create</button>
      {msg && <div className='mt-4'>{msg}</div>}
    </div>
  )
}

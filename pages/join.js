// pages/join.js
'use client'
import { useState, useEffect } from 'react'
import supabase from '../lib/supabaseClient'

export default function JoinCompany() {
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  const requestJoin = async () => {
    if (!user) return setMsg('Please sign in first on the homepage.')
    if (!code) return setMsg('Enter company ID.')

    // find company by code
    const { data: company, error: companyErr } = await supabase.from('corp_companies').select('*').eq('code', code).maybeSingle()
    if (companyErr) return setMsg(companyErr.message)
    if (!company) return setMsg('Company not found. Check the company ID and try again.')

    // check if there's already a pending request
    const { data: existing } = await supabase
      .from('corp_join_requests')
      .select('*')
      .eq('company_id', company.id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (existing) return setMsg('You already have a pending join request for this company.')

    const { error } = await supabase.from('corp_join_requests').insert([{ company_id: company.id, user_id: user.id, message: 'Request to join' }])
    if (error) setMsg(error.message)
    else setMsg('Join request sent. Wait for CEO approval.')
  }

  return (
    <div className='container'>
      <h2 className='text-xl font-semibold mb-4'>Join Company</h2>
      <input value={code} onChange={e=>setCode(e.target.value)} placeholder='Enter company ID' className='border p-2 rounded w-full mb-2' />
      <button onClick={requestJoin} className='bg-blue-600 text-white px-4 py-2 rounded'>Request to Join</button>
      {msg && <div className='mt-4'>{msg}</div>}
    </div>
  )
}

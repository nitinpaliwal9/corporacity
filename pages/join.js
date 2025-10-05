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
    if (!code) return setMsg('Enter company code.')

    // find company
    const { data: company } = await supabase.from('companies').select('*').eq('code', code).single()
    if (!company) return setMsg('Company not found')
    const { error } = await supabase.from('join_requests').insert([{ company_id: company.id, user_id: user.id, message: 'Request to join' }])
    if (error) setMsg(error.message)
    else setMsg('Join request sent. Wait for CEO approval.')
  }

  return (
    <div className='container'>
      <h2 className='text-xl font-semibold mb-4'>Join Company</h2>
      <input value={code} onChange={e=>setCode(e.target.value)} placeholder='Company code' className='border p-2 rounded w-full mb-2' />
      <button onClick={requestJoin} className='bg-blue-600 text-white px-4 py-2 rounded'>Request to Join</button>
      {msg && <div className='mt-4'>{msg}</div>}
    </div>
  )
}

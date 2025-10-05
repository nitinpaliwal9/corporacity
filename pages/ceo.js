// pages/ceo.js
'use client'
import { useState, useEffect } from 'react'
import supabase from '../lib/supabaseClient'

export default function CeoDashboard() {
  const [feed, setFeed] = useState([])
  const [requests, setRequests] = useState([])

  useEffect(() => {
    // fetch recent statuses (join with corp_profiles for name)
    supabase.from('corp_statuses').select('*, corp_profiles!inner(id, full_name)').order('timestamp', { ascending: false }).limit(50).then(({ data }) => {
      setFeed(data || [])
    })

    // fetch join requests (and user email)
    supabase.from('corp_join_requests').select('*, corp_profiles(id, full_name, email)').order('created_at', { ascending: false }).then(({ data }) => {
      setRequests(data || [])
    })

    // setup realtime subscription for new statuses
    const channel = supabase.channel('public:corp_statuses')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'corp_statuses' }, payload => {
        setFeed(f => [payload.new, ...f])
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const approve = async (req) => {
    // create membership and remove request
    await supabase.from('corp_memberships').insert([{ user_id: req.user_id, company_id: req.company_id }])
    await supabase.from('corp_join_requests').delete().eq('id', req.id)
    setRequests(r => r.filter(x => x.id !== req.id))
  }

  return (
    <div className='container'>
      <h2 className='text-xl font-semibold mb-4'>CEO Dashboard</h2>

      <section className='mb-6'>
        <h3 className='font-semibold mb-2'>Join Requests</h3>
        {requests.length === 0 && <div className='text-sm text-gray-600'>No requests</div>}
        <ul>
          {requests.map(r => (
            <li key={r.id} className='border p-2 mb-2 flex justify-between items-center'>
              <div>{r.corp_profiles?.full_name || r.corp_profiles?.email || r.user_id}</div>
              <div><button onClick={() => approve(r)} className='bg-green-600 text-white px-3 py-1 rounded'>Approve</button></div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className='font-semibold mb-2'>Live Feed</h3>
        <ul>
          {feed.map(item => (
            <li key={item.id} className='border p-2 mb-2'>
              <div className='text-sm text-gray-600'>{new Date(item.timestamp).toLocaleString()}</div>
              <div><strong>{item.corp_profiles?.full_name || item.user_id}</strong> — {item.type} {item.message}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

// pages/ceo.js
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import supabase from '../lib/supabaseClient'

export default function CeoDashboard() {
  const [feed, setFeed] = useState([])
  const [requests, setRequests] = useState([])
  const [company, setCompany] = useState(null)
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({ present: 0, late: 0, leave: 0, visit: 0 })
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const currentUser = userData?.user
      if (!currentUser) return
      setUser(currentUser)

      // Fetch company owned by this user (CEO)
      const { data: ownedCompany } = await supabase
        .from('corp_companies')
        .select('*')
        .eq('owner_id', currentUser.id)
        .maybeSingle()

      if (ownedCompany) {
        setCompany(ownedCompany)
        await fetchRequests(ownedCompany.id)
        await fetchFeed(ownedCompany.id)
        await fetchStats(ownedCompany.id)
        setupRealtimeChannels(ownedCompany.id)
      }
    }

    loadData()
  }, [])

  // 🟢 Fetch join requests
  const fetchRequests = async (companyId) => {
    const { data: joinRequests } = await supabase
      .from('corp_join_requests')
      .select(`
        id, user_id, company_id, message, created_at,
        corp_profiles(id, full_name, email),
        corp_companies(id, name, owner_id)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
    setRequests(joinRequests || [])
  }

  // 🟢 Fetch feed (employee statuses)
  const fetchFeed = async (companyId) => {
    const { data: feedData } = await supabase
      .from('corp_statuses')
      .select('*, corp_profiles!inner(id, full_name)')
      .eq('company_id', companyId)
      .order('timestamp', { ascending: false })
      .limit(50)
    setFeed(feedData || [])
  }

  // 🧮 Fetch today's status stats
  const fetchStats = async (companyId) => {
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
    const { data } = await supabase
      .from('corp_statuses')
      .select('type')
      .eq('company_id', companyId)
      .gte('timestamp', startOfDay)

    if (!data) return
    const counts = { present: 0, late: 0, leave: 0, visit: 0 }
    data.forEach((s) => {
      if (counts[s.type] !== undefined) counts[s.type]++
    })
    setStats(counts)
  }

  // 🟡 Real-time channels setup for statuses + join requests
  const setupRealtimeChannels = (companyId) => {
    // Realtime updates for employee status posts
    const statusChannel = supabase
      .channel('public:corp_statuses')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'corp_statuses' },
        (payload) => {
          if (payload.new.company_id === companyId) {
            setFeed((f) => [payload.new, ...f])
            fetchStats(companyId) // refresh quick stats
          }
        }
      )
      .subscribe()

    // Realtime updates for join requests
    const joinChannel = supabase
      .channel('public:corp_join_requests')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'corp_join_requests' },
        (payload) => {
          if (payload.new.company_id === companyId) fetchRequests(companyId)
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'corp_join_requests' },
        (payload) => {
          if (payload.old.company_id === companyId) {
            setRequests((r) => r.filter((x) => x.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      statusChannel.unsubscribe()
      joinChannel.unsubscribe()
    }
  }

  // 🟢 Approve request
  const approve = async (req) => {
    try {
      await supabase.from('corp_memberships').insert([
        { user_id: req.user_id, company_id: req.company_id, role: 'employee' },
      ])
      await supabase.from('corp_join_requests').delete().eq('id', req.id)
      setRequests((r) => r.filter((x) => x.id !== req.id))
    } catch (err) {
      console.error('approve error', err)
    }
  }

  // 🔴 Deny request
  const deny = async (req) => {
    try {
      await supabase.from('corp_join_requests').delete().eq('id', req.id)
      setRequests((r) => r.filter((x) => x.id !== req.id))
    } catch (err) {
      console.error('deny error', err)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">CEO Dashboard</h2>
        <button onClick={logout} className="text-sm px-3 py-1 border rounded">
          Logout
        </button>
      </div>

      {company && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg border">
          <div><strong>Company Name:</strong> {company.name}</div>
          <div><strong>Company ID:</strong> {company.code}</div>
        </div>
      )}

      {/* Quick Stats */}
      <section className="mb-8">
        <h3 className="font-semibold mb-3">Today's Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-green-50 border rounded text-center">
            <div className="text-lg font-bold">{stats.present}</div>
            <div className="text-sm text-gray-600">Present</div>
          </div>
          <div className="p-3 bg-yellow-50 border rounded text-center">
            <div className="text-lg font-bold">{stats.late}</div>
            <div className="text-sm text-gray-600">Late</div>
          </div>
          <div className="p-3 bg-red-50 border rounded text-center">
            <div className="text-lg font-bold">{stats.leave}</div>
            <div className="text-sm text-gray-600">Leave</div>
          </div>
          <div className="p-3 bg-blue-50 border rounded text-center">
            <div className="text-lg font-bold">{stats.visit}</div>
            <div className="text-sm text-gray-600">On Visit</div>
          </div>
        </div>
      </section>

      {/* Join Requests */}
      <section className="mb-6">
        <h3 className="font-semibold mb-2">Join Requests</h3>
        {requests.length === 0 && (
          <div className="text-sm text-gray-600">No requests</div>
        )}
        <ul>
          {requests.map((r) => (
            <li
              key={r.id}
              className="border p-2 mb-2 flex justify-between items-center"
            >
              <div>
                <div className="font-semibold">
                  {r.corp_profiles?.full_name || r.corp_profiles?.email || r.user_id}
                </div>
                <div className="text-sm text-gray-600">
                  {r.corp_companies?.name || ''}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => approve(r)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => deny(r)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Deny
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Live Feed */}
      <section>
        <h3 className="font-semibold mb-2">Live Feed</h3>
        <ul>
          {feed.map((item) => (
            <li key={item.id} className="border p-2 mb-2">
              <div className="text-sm text-gray-600">
                {new Date(item.timestamp).toLocaleString()}
              </div>
              <div>
                <strong>{item.corp_profiles?.full_name || item.user_id}</strong> —{' '}
                {item.type} {item.message}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

// pages/ceo.js
'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import supabase from '../lib/supabaseClient'

export default function CeoDashboard() {
  const [feed, setFeed] = useState([])
  const [requests, setRequests] = useState([])
  const [company, setCompany] = useState(null)
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({ present: 0, late: 0, leave: 0, visit: 0 })
  const [debugVisible, setDebugVisible] = useState(true) // show debug panel on-page
  const ownedCompanyIdsRef = useRef([])
  const router = useRouter()

  useEffect(() => {
    let statusChannel = null
    let joinChannel = null
    let mounted = true

    const loadData = async () => {
      // robust user detection: try getUser(), then fallback to getSession()
      let currentUser = null
      try {
        const { data: u } = await supabase.auth.getUser()
        currentUser = u?.user || null
      } catch (e) {
        console.debug('getUser() threw', e)
      }

      if (!currentUser) {
        try {
          const { data: s } = await supabase.auth.getSession()
          currentUser = s?.session?.user || null
        } catch (e) {
          console.debug('getSession() threw', e)
        }
      }

      if (!currentUser) {
        console.debug('No authenticated user (after both checks).')
        setUser(null)
        setCompany(null)
        setRequests([])
        return
      }

      console.debug('Authenticated user found:', currentUser)
      setUser(currentUser)

      // 1) fetch all companies owned by this user
      const { data: ownedCompanies, error: ownedErr } = await supabase
        .from('corp_companies')
        .select('id, name, code, owner_id')
        .eq('owner_id', currentUser.id)

      if (ownedErr) console.error('Error fetching owned companies', ownedErr)
      const ownedIds = (ownedCompanies || []).map(c => c.id)
      ownedCompanyIdsRef.current = ownedIds
      console.debug('Owned companies:', ownedCompanies)

      // choose first company for UI if present
      if (mounted && ownedCompanies && ownedCompanies.length > 0) {
        setCompany(ownedCompanies[0])
        await fetchFeed(ownedCompanies[0].id)
        await fetchStats(ownedCompanies[0].id)
      } else {
        setCompany(null)
        setFeed([])
        setStats({ present: 0, late: 0, leave: 0, visit: 0 })
      }

      // 2) fetch join requests for all owned company IDs using .in()
      if (ownedIds.length > 0) {
        await fetchRequestsForCompanyIds(ownedIds)
      } else {
        setRequests([])
      }

      // setup realtime channels (status + join requests)
      statusChannel = supabase
        .channel('public:corp_statuses')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'corp_statuses' }, payload => {
          const newRow = payload?.new
          if (!newRow) return
          if (ownedCompanyIdsRef.current.includes(newRow.company_id)) {
            setFeed(f => [newRow, ...f])
            fetchStats(newRow.company_id)
          }
        })
        .subscribe()

      joinChannel = supabase
        .channel('public:corp_join_requests')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'corp_join_requests' }, payload => {
          const newRow = payload?.new
          if (!newRow) return
          if (ownedCompanyIdsRef.current.includes(newRow.company_id)) {
            fetchRequestsForCompanyIds(ownedCompanyIdsRef.current)
          }
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'corp_join_requests' }, payload => {
          const oldRow = payload?.old
          if (!oldRow) return
          if (ownedCompanyIdsRef.current.includes(oldRow.company_id)) {
            setRequests(r => r.filter(x => x.id !== oldRow.id))
          }
        })
        .subscribe()
    }

    loadData()

    return () => {
      mounted = false
      try { statusChannel?.unsubscribe() } catch (e) {}
      try { joinChannel?.unsubscribe() } catch (e) {}
    }
  }, [])

  // fetch join requests for multiple company IDs
  const fetchRequestsForCompanyIds = async (companyIds = []) => {
    if (!companyIds || companyIds.length === 0) {
      setRequests([])
      return
    }
    const { data, error } = await supabase
      .from('corp_join_requests')
      .select(`
        id, user_id, company_id, message, created_at,
        corp_profiles(id, full_name, email),
        corp_companies(id, name, owner_id)
      `)
      .in('company_id', companyIds)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('fetchRequestsForCompanyIds error', error)
      setRequests([])
      return
    }
    console.debug('Fetched join requests:', data)
    setRequests(data || [])
  }

  const fetchFeed = async (companyId) => {
    if (!companyId) {
      setFeed([])
      return
    }
    const { data: feedData, error } = await supabase
      .from('corp_statuses')
      .select('*, corp_profiles!inner(id, full_name)')
      .eq('company_id', companyId)
      .order('timestamp', { ascending: false })
      .limit(50)
    if (error) console.error('fetchFeed error', error)
    setFeed(feedData || [])
  }

  const fetchStats = async (companyId) => {
    if (!companyId) {
      setStats({ present: 0, late: 0, leave: 0, visit: 0 })
      return
    }
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
    const { data, error } = await supabase
      .from('corp_statuses')
      .select('type')
      .eq('company_id', companyId)
      .gte('timestamp', startOfDay)

    if (error) {
      console.error('fetchStats error', error)
      return
    }
    const counts = { present: 0, late: 0, leave: 0, visit: 0 }
    (data || []).forEach((s) => {
      if (counts[s.type] !== undefined) counts[s.type]++
    })
    setStats(counts)
  }

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
        <button onClick={logout} className="text-sm px-3 py-1 border rounded">Logout</button>
      </div>

      {company ? (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg border">
          <div><strong>Company Name:</strong> {company.name}</div>
          <div><strong>Company ID:</strong> {company.code}</div>
        </div>
      ) : (
        <div className="mb-6 p-3 bg-yellow-50 border rounded text-sm text-gray-700">
          No owned company detected for current user.
        </div>
      )}

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

      <section className="mb-6">
        <h3 className="font-semibold mb-2">Join Requests</h3>
        {requests.length === 0 ? <div className="text-sm text-gray-600">No requests</div> : (
          <ul>
            {requests.map((r) => (
              <li key={r.id} className="border p-2 mb-2 flex justify-between items-center">
                <div>
                  <div className="font-semibold">{r.corp_profiles?.full_name || r.corp_profiles?.email || r.user_id}</div>
                  <div className="text-sm text-gray-600">{r.corp_companies?.name || ''}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approve(r)} className="bg-green-600 text-white px-3 py-1 rounded">Approve</button>
                  <button onClick={() => deny(r)} className="bg-red-500 text-white px-3 py-1 rounded">Deny</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="font-semibold mb-2">Live Feed</h3>
        <ul>
          {feed.map((item) => (
            <li key={item.id} className="border p-2 mb-2">
              <div className="text-sm text-gray-600">{new Date(item.timestamp).toLocaleString()}</div>
              <div><strong>{item.corp_profiles?.full_name || item.user_id}</strong> — {item.type} {item.message}</div>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------- DEBUG PANEL (temporary) ---------------- */}
      {debugVisible && (
        <div className="fixed right-4 bottom-4 w-96 max-w-full bg-white border rounded p-3 shadow-lg text-xs z-50">
          <div className="flex justify-between items-center mb-2">
            <strong>Debug (temp)</strong>
            <button onClick={() => setDebugVisible(false)} className="text-gray-500">hide</button>
          </div>
          <div><strong>Current user id:</strong> {user?.id || '—'}</div>
          <div><strong>Current user email:</strong> {user?.email || '—'}</div>
          <div className="mt-2"><strong>Owned company ids:</strong> {JSON.stringify(ownedCompanyIdsRef.current)}</div>
          <div className="mt-2"><strong>Company shown:</strong> {company ? company.name + ' (' + company.id + ')' : '—'}</div>
          <div className="mt-2"><strong>Requests (count):</strong> {requests.length}</div>
          <details className="mt-2">
            <summary className="cursor-pointer">Raw requests (click)</summary>
            <pre className="max-h-60 overflow-auto p-2 bg-gray-50 border mt-2 text-xs">{JSON.stringify(requests, null, 2)}</pre>
          </details>
          <div className="mt-2 text-gray-500">Refresh page & check console for logs.</div>
        </div>
      )}
    </div>
  )
}

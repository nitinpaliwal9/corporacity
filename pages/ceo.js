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
  const [debugVisible, setDebugVisible] = useState(true)
  const [lastError, setLastError] = useState(null)
  const [rawRequestsCount, setRawRequestsCount] = useState(null)
  const ownedCompanyIdsRef = useRef([])
  const router = useRouter()

  useEffect(() => {
    let statusChannel = null
    let joinChannel = null
    let mounted = true

    const loadData = async () => {
      // wait for session to be restored (defensive)
      let session = null
      try {
        const maybe = await supabase.auth.getSession?.()
        session = maybe?.data?.session ?? maybe?.session ?? null
      } catch (err) {
        console.debug('getSession() threw (non-fatal):', err)
      }

      // If no session found, still try getUser (older SDK shapes)
      try {
        if (!session) {
          const maybeUser = await supabase.auth.getUser?.()
          const userObj = maybeUser?.data?.user ?? maybeUser?.user ?? null
          if (userObj) {
            session = { user: userObj }
          }
        }
      } catch (err) {
        console.debug('getUser() threw (non-fatal):', err)
      }

      if (!session?.user) {
        console.debug('No authenticated user detected during CEO bootstrap.')
        setUser(null)
        setCompany(null)
        setRequests([])
        setLastError('No authenticated user')
        return
      }

      const currentUser = session.user
      setUser(currentUser)
      setLastError(null)

      // fetch owned companies
      try {
        const { data: ownedCompanies, error: ownedErr } = await supabase
          .from('corp_companies')
          .select('id, name, code, owner_id')
          .eq('owner_id', currentUser.id)

        if (ownedErr) {
          console.error('Error fetching owned companies', ownedErr)
          setLastError(JSON.stringify(ownedErr))
        }

        const ownedIds = (ownedCompanies || []).map(c => c.id)
        ownedCompanyIdsRef.current = ownedIds

        if (mounted && ownedCompanies && ownedCompanies.length > 0) {
          setCompany(ownedCompanies[0])
          await fetchFeed(ownedCompanies[0].id)
          await fetchStats(ownedCompanies[0].id)
        } else {
          setCompany(null)
          setFeed([])
          setStats({ present: 0, late: 0, leave: 0, visit: 0 })
        }

        // fetch join requests (diagnostic + enriched)
        if (ownedIds.length > 0) {
          await fetchRequestsForCompanyIds(ownedIds)
        } else {
          setRequests([])
          setRawRequestsCount(0)
        }
      } catch (err) {
        console.error('loadData top-level error', err)
        setLastError(String(err))
      }

      // setup realtime channels (defensive unsubscribe)
      try {
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
      } catch (e) {
        console.debug('status realtime setup failed', e)
      }

      try {
        joinChannel = supabase
          .channel('public:corp_join_requests')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'corp_join_requests' }, payload => {
            const newRow = payload?.new
            if (!newRow) return
            if (ownedCompanyIdsRef.current.includes(newRow.company_id)) {
              // try to fetch fresh list (diagnostic)
              fetchRequestsForCompanyIds(ownedCompanyIdsRef.current)
            }
          })
          .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'corp_join_requests' }, payload => {
            const oldRow = payload?.old
            if (!oldRow) return
            if (ownedCompanyIdsRef.current.includes(oldRow.company_id)) {
              setRequests(r => r.filter(x => x.id !== oldRow.id))
              setRawRequestsCount(c => (c !== null ? Math.max(0, c - 1) : null))
            }
          })
          .subscribe()
      } catch (e) {
        console.debug('join realtime setup failed', e)
      }
    }

    loadData()

    return () => {
      mounted = false
      // defensive unsubscribe for different SDK shapes
      try {
        if (statusChannel?.unsubscribe) statusChannel.unsubscribe()
        else if (statusChannel?.subscription?.unsubscribe) statusChannel.subscription.unsubscribe()
        else if (statusChannel?.data?.subscription?.unsubscribe) statusChannel.data.subscription.unsubscribe()
      } catch (e) { console.debug('error unsubscribing statusChannel', e) }

      try {
        if (joinChannel?.unsubscribe) joinChannel.unsubscribe()
        else if (joinChannel?.subscription?.unsubscribe) joinChannel.subscription.unsubscribe()
        else if (joinChannel?.data?.subscription?.unsubscribe) joinChannel.data.subscription.unsubscribe()
      } catch (e) { console.debug('error unsubscribing joinChannel', e) }
    }
  }, [])

  // fetch join requests for multiple company IDs (DIAGNOSTIC + ENRICHED)
  const fetchRequestsForCompanyIds = async (companyIds = []) => {
    if (!companyIds || companyIds.length === 0) {
      setRequests([])
      setRawRequestsCount(0)
      return
    }

    // STEP 1 — fetch raw rows (simple columns). This helps detect RLS blocking.
    try {
      const { data: rawRows, error: rawErr } = await supabase
        .from('corp_join_requests')
        .select('id, user_id, company_id, message, created_at')
        .in('company_id', companyIds)
        .order('created_at', { ascending: false })

      if (rawErr) {
        console.error('fetchRequests raw error', rawErr)
        setLastError(JSON.stringify(rawErr))
        setRawRequestsCount(0)
      } else {
        setRawRequestsCount((rawRows && rawRows.length) || 0)
        // If rawRows is empty but you know there are rows in DB, RLS is likely blocking.
      }
    } catch (err) {
      console.error('fetchRequests raw exception', err)
      setLastError(String(err))
      setRawRequestsCount(null)
    }

    // STEP 2 — attempt enriched fetch (with related profiles & companies).
    // This may return [] if nested relations fail due to FK/RLS.
    try {
      const { data, error } = await supabase
  .from('corp_join_requests')
  .select(`
    id, user_id, company_id, message, created_at,
    corp_profiles(id, full_name, email),
    corp_companies!fk_cjr_company(id, name, owner_id)
  `)
  .in('company_id', companyIds)
  .order('created_at', { ascending: false })


      if (error) {
        console.error('fetchRequestsForCompanyIds error', error)
        setLastError(JSON.stringify(error))
        setRequests([])
        return
      }

      console.debug('Fetched join requests (enriched):', data)
      setRequests(data || [])
      setLastError(null)
    } catch (err) {
      console.error('fetchRequestsForCompanyIds exception', err)
      setLastError(String(err))
      setRequests([])
    }
  }

  const fetchFeed = async (companyId) => {
    if (!companyId) {
      setFeed([])
      return
    }
    try {
      const { data: feedData, error } = await supabase
        .from('corp_statuses')
        .select('*, corp_profiles!inner(id, full_name)')
        .eq('company_id', companyId)
        .order('timestamp', { ascending: false })
        .limit(50)
      if (error) {
        console.error('fetchFeed error', error)
        setLastError(JSON.stringify(error))
      } else {
        setFeed(feedData || [])
      }
    } catch (err) {
      console.error('fetchFeed exception', err)
      setLastError(String(err))
    }
  }

  const fetchStats = async (companyId) => {
    if (!companyId) {
      setStats({ present: 0, late: 0, leave: 0, visit: 0 })
      return
    }
    try {
      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
      const { data, error } = await supabase
        .from('corp_statuses')
        .select('type')
        .eq('company_id', companyId)
        .gte('timestamp', startOfDay)
      if (error) {
        console.error('fetchStats error', error)
        setLastError(JSON.stringify(error))
        return
      }
      const counts = { present: 0, late: 0, leave: 0, visit: 0 }
      (data || []).forEach((s) => {
        if (counts[s.type] !== undefined) counts[s.type]++
      })
      setStats(counts)
    } catch (err) {
      console.error('fetchStats exception', err)
      setLastError(String(err))
    }
  }

  const approve = async (req) => {
  try {
    // 1️⃣ Securely call your API route (uses service role on the server)
    const res = await fetch('/api/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: req.user_id,
        company_id: req.company_id,
      }),
    })

    const result = await res.json()
    if (!res.ok) {
      console.error('Approve API error:', result)
      setLastError(JSON.stringify(result.error || result))
      alert(result.error?.message || 'Error approving request')
      return
    }

    // 2️⃣ Delete join request (CEO’s session allowed by RLS)
    const { error: delErr } = await supabase
      .from('corp_join_requests')
      .delete()
      .eq('id', req.id)

    if (delErr) {
      console.error('approve delete join request error', delErr)
      setLastError(JSON.stringify(delErr))
      alert('Member added, but could not delete join request.')
      return
    }

    // 3️⃣ Update UI + local state
    setRequests((r) => r.filter((x) => x.id !== req.id))
    setRawRequestsCount((c) => (c !== null ? Math.max(0, c - 1) : c))
    setLastError(null)
    alert('✅ Member approved successfully!')
  } catch (err) {
    console.error('approve exception', err)
    setLastError(String(err))
    alert('Unexpected error approving request')
  }
}


  const deny = async (req) => {
    try {
      const { error } = await supabase.from('corp_join_requests').delete().eq('id', req.id)
      if (error) {
        console.error('deny delete error', error)
        setLastError(JSON.stringify(error))
        return
      }
      setRequests((r) => r.filter((x) => x.id !== req.id))
      setRawRequestsCount((c) => (c !== null ? Math.max(0, c - 1) : c))
      setLastError(null)
    } catch (err) {
      console.error('deny exception', err)
      setLastError(String(err))
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
          <div className="mt-2"><strong>Requests (enriched count):</strong> {requests.length}</div>
          <div className="mt-1"><strong>Requests (raw count):</strong> {rawRequestsCount !== null ? rawRequestsCount : '—'}</div>
          <div className="mt-2"><strong>Last Supabase error:</strong> {lastError || '—'}</div>
          <details className="mt-2">
            <summary className="cursor-pointer">Raw requests (click)</summary>
            <pre className="max-h-60 overflow-auto p-2 bg-gray-50 border mt-2 text-xs">{JSON.stringify(requests, null, 2)}</pre>
          </details>
          <div className="mt-2 text-gray-500">
  If raw count &gt; 0 but enriched count = 0, check RLS policies / FK relationships for <code>corp_join_requests</code>.
</div>

        </div>
      )}
    </div>
  )
}

// pages/ceo.js
'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import supabase from '../lib/supabaseClient'
import Layout from '../components/ui/Layout'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Alert from '../components/ui/Alert'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ProgressBar from '../components/ui/ProgressBar'
import AnimatedCounter from '../components/ui/AnimatedCounter'

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
        console.log('Starting approve process:', req)
        
        // Test if API endpoint is accessible first
        try {
          const testRes = await fetch('/api/approve', { method: 'OPTIONS' })
          console.log('API endpoint test:', testRes.status, testRes.statusText)
        } catch (testErr) {
          console.error('API endpoint not accessible:', testErr)
        }
        
        // 1️⃣ Securely call your API route (uses service role on the server)
        const res = await fetch('/api/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: req.user_id,
        company_id: req.company_id,
      }),
    })
    
    console.log('API response status:', res.status, res.statusText)
    console.log('API response headers:', Object.fromEntries(res.headers.entries()))

    const result = await res.json()
    if (!res.ok) {
      console.error('Approve API error:', result)
      setLastError(JSON.stringify(result.error || result))
      alert(result.error || 'Error approving request')
      return
    }

    console.log('Approve API success:', result)

        // 2️⃣ Delete join request (CEO's session allowed by RLS)
        const { error: delErr } = await supabase
          .from('corp_join_requests')
          .delete()
          .eq('id', req.id)

        if (delErr) {
          console.error('approve delete join request error', delErr)
          setLastError(JSON.stringify(delErr))
          alert('Member added successfully, but could not remove the join request. Please refresh the page.')
          // Still update UI since member was added
          setRequests((r) => r.filter((x) => x.id !== req.id))
          setRawRequestsCount((c) => (c !== null ? Math.max(0, c - 1) : c))
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
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CEO Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your team and monitor company activity</p>
          </div>
          <Button onClick={logout} variant="outline" size="small">
            Logout
          </Button>
        </motion.div>

        {/* Company Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {company ? (
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {company.name}
                  </h3>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Company ID:</span> {company.code}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Owner:</span> {user?.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-sm text-gray-500 mt-1">Active</p>
                </div>
              </div>
            </Card>
          ) : (
            <Alert variant="warning">
              <div>
                <h4 className="font-semibold mb-2">No owned company detected</h4>
                <p className="text-sm">You need to create a company to access the CEO dashboard.</p>
              </div>
            </Alert>
          )}
        </motion.div>

        {/* Stats Overview */}
        {company && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card>
              <Card.Header>
                <Card.Title>Today's Team Overview</Card.Title>
                <p className="text-sm text-gray-600 mt-2">
                  Real-time status updates from your team members
                </p>
              </Card.Header>
              
              <Card.Content>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-2xl">✅</span>
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      <AnimatedCounter value={stats.present} />
                    </div>
                    <div className="text-sm text-gray-600">Present</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-2xl">🕗</span>
                    </div>
                    <div className="text-3xl font-bold text-yellow-600 mb-1">
                      <AnimatedCounter value={stats.late} />
                    </div>
                    <div className="text-sm text-gray-600">Late</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-2xl">🌴</span>
                    </div>
                    <div className="text-3xl font-bold text-red-600 mb-1">
                      <AnimatedCounter value={stats.leave} />
                    </div>
                    <div className="text-sm text-gray-600">On Leave</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-2xl">🧭</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      <AnimatedCounter value={stats.visit} />
                    </div>
                    <div className="text-sm text-gray-600">On Visit</div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        )}

        {/* Join Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <Card.Header>
              <Card.Title>Join Requests</Card.Title>
              <p className="text-sm text-gray-600 mt-2">
                Review and approve new team member requests
              </p>
            </Card.Header>
            
            <Card.Content>
              {requests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending requests</h3>
                  <p className="text-gray-600">All join requests have been processed</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {(request.corp_profiles?.full_name || request.user_id || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {request.corp_profiles?.full_name || request.corp_profiles?.email || request.user_id}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Requested to join {request.corp_companies?.name || 'your company'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(request.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => approve(request)}
                          variant="success"
                          size="small"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => deny(request)}
                          variant="danger"
                          size="small"
                        >
                          Deny
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card.Content>
          </Card>
        </motion.div>

        {/* Live Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <Card.Header>
              <Card.Title>Live Activity Feed</Card.Title>
              <p className="text-sm text-gray-600 mt-2">
                Real-time updates from your team members
              </p>
            </Card.Header>
            
            <Card.Content>
              {feed.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No activity yet</h3>
                  <p className="text-gray-600">Team activity will appear here in real-time</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {feed.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {(item.corp_profiles?.full_name || item.user_id || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">
                            {item.corp_profiles?.full_name || item.user_id}
                          </span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-1">
                          Status: <span className="font-medium capitalize">{item.type}</span>
                          {item.message && <span> - {item.message}</span>}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card.Content>
          </Card>
        </motion.div>

        {/* Debug Panel */}
        {debugVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed right-4 bottom-4 w-96 max-w-full bg-white border rounded-xl p-4 shadow-xl text-xs z-50"
          >
            <div className="flex justify-between items-center mb-3">
              <strong className="text-sm">Debug Panel</strong>
              <Button
                onClick={() => setDebugVisible(false)}
                variant="ghost"
                size="small"
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            <div className="space-y-2 text-xs">
              <div><strong>User ID:</strong> {user?.id || '—'}</div>
              <div><strong>Email:</strong> {user?.email || '—'}</div>
              <div><strong>Company:</strong> {company ? company.name : '—'}</div>
              <div><strong>Requests:</strong> {requests.length}</div>
              <div><strong>Feed Items:</strong> {feed.length}</div>
              {lastError && (
                <div className="text-red-600">
                  <strong>Error:</strong> {lastError}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}

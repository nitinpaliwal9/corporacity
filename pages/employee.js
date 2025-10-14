// pages/employee.js
'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import supabase from '../lib/supabaseClient'
import { NotificationService } from '../lib/notificationService'
import { SecurityService } from '../lib/securityService'
import Layout from '../components/ui/Layout'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import StatusCard from '../components/ui/StatusCard'
import Alert from '../components/ui/Alert'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ProgressBar from '../components/ui/ProgressBar'
import AnimatedCounter from '../components/ui/AnimatedCounter'

const STATUS_TYPES = [
  { key: 'present', label: 'Present ✅' },
  { key: 'late', label: "I'm Late 🕗" },
  { key: 'leave', label: 'On Leave 🌴' },
  { key: 'visit', label: 'On Visit 🧭' },
  { key: 'short_leave', label: 'Short Leave 🕓' }
]

export default function EmployeeStatus() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [membership, setMembership] = useState(null)
  const [company, setCompany] = useState(null)
  const [companyOwner, setCompanyOwner] = useState(null)
  const [pendingRequests, setPendingRequests] = useState([])
  const [statuses, setStatuses] = useState([])
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const membershipsChannelRef = useRef(null)
  const statusesChannelRef = useRef(null)

  useEffect(() => {
    let mounted = true

    const boot = async () => {
      // ✅ Wait for Supabase session to be restored before fetching anything
      let currentUser = null
      for (let i = 0; i < 10; i++) {
        const { data: sessionData } = await supabase.auth.getSession()
        currentUser = sessionData?.session?.user || null
        if (currentUser) break
        await new Promise((r) => setTimeout(r, 200)) // wait 200ms
      }

      if (!currentUser) {
        console.debug('❌ No active session found after retries')
        if (!mounted) return
        setUser(null)
        setProfile(null)
        setMembership(null)
        setCompany(null)
        setPendingRequests([])
        return
      }

      if (!mounted) return
      setUser(currentUser)

      // fetch profile
      try {
        const { data: prof, error: profErr } = await supabase
          .from('corp_profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle()
        if (profErr) console.debug('profile fetch error', profErr)
        setProfile(prof || null)
      } catch (e) {
        console.debug('profile fetch exception', e)
      }

      // fetch membership (separate call — avoids nested FK embedding)
      await fetchMembership(currentUser.id)

      // subscribe to membership inserts/updates so user sees CEO approval immediately
      try {
        membershipsChannelRef.current = supabase
          .channel(`public:corp_memberships_user_${currentUser.id}`)
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'corp_memberships' }, payload => {
            const newRow = payload?.new
            if (newRow?.user_id === currentUser.id) fetchMembership(currentUser.id)
          })
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'corp_memberships' }, payload => {
            const newRow = payload?.new
            if (newRow?.user_id === currentUser.id) fetchMembership(currentUser.id)
          })
          .subscribe()
      } catch (e) {
        console.debug('membership realtime subscribe failed', e)
      }

      // subscribe to statuses so "My Updates" updates instantly
      try {
        statusesChannelRef.current = supabase
          .channel(`public:corp_statuses_user_${currentUser.id}`)
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'corp_statuses' }, payload => {
            const newStatus = payload?.new
            if (newStatus?.user_id === currentUser.id) setStatuses(s => [newStatus, ...s])
          })
          .subscribe()
      } catch (e) {
        console.debug('statuses realtime subscribe failed', e)
      }
    }

    boot()

    return () => {
      mounted = false
      try {
        membershipsChannelRef.current?.unsubscribe?.()
      } catch (e) {}
      try {
        statusesChannelRef.current?.unsubscribe?.()
      } catch (e) {}
    }
  }, [])

  // same fetchMembership, loadPendingRequests, fetchStatuses, postStatus, logout, and JSX as before...

  // re-usable function to fetch membership + company + owner + statuses
  const fetchMembership = async (userId) => {
    if (!userId) return
    try {
      const { data: mem, error: memErr } = await supabase
        .from('corp_memberships')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (memErr) {
        console.debug('membership fetch error', memErr)
        setMembership(null)
        setCompany(null)
        setCompanyOwner(null)
        // fallback to pending requests
        await loadPendingRequests(userId)
        return
      }

      if (!mem) {
        setMembership(null)
        setCompany(null)
        setCompanyOwner(null)
        // no membership → show pending requests
        await loadPendingRequests(userId)
        return
      }

      // we have a membership — populate state
      setMembership(mem)

      // fetch company separately
      const { data: comp, error: compErr } = await supabase
        .from('corp_companies')
        .select('*')
        .eq('id', mem.company_id)
        .maybeSingle()

      if (compErr) {
        console.debug('company fetch error', compErr)
        setCompany(null)
      } else {
        setCompany(comp || null)
      }

      // fetch company owner profile
      if (comp) {
        const { data: owner, error: ownerErr } = await supabase
          .from('corp_profiles')
          .select('id, full_name, email')
          .eq('id', comp.owner_id)
          .maybeSingle()

        if (ownerErr) {
          console.debug('owner fetch error', ownerErr)
          setCompanyOwner(null)
        } else {
          setCompanyOwner(owner || null)
        }
      } else {
        setCompanyOwner(null)
      }

      // fetch statuses (last 10)
      await fetchStatuses(mem.company_id, userId)
    } catch (err) {
      console.error('fetchMembership exception', err)
      setMembership(null)
      setCompany(null)
      setCompanyOwner(null)
    }
  }

  const loadPendingRequests = async (userId) => {
    try {
      // explicit relationship name for corp_companies if needed: use !fk_cjr_company if you added that previously
      const { data: pendings, error } = await supabase
        .from('corp_join_requests')
        .select('id, user_id, company_id, message, created_at, corp_companies(id, name)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.debug('pending requests fetch error', error)
        setPendingRequests([])
        return
      }

      setPendingRequests(pendings || [])
    } catch (err) {
      console.debug('loadPendingRequests exception', err)
      setPendingRequests([])
    }
  }

  const fetchStatuses = async (companyId, userId) => {
    if (!companyId || !userId) return
    try {
      const { data, error } = await supabase
        .from('corp_statuses')
        .select('id, user_id, company_id, type, message, timestamp')
        .eq('company_id', companyId)
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(10)

      if (error) {
        console.debug('fetchStatuses error', error)
        setStatuses([])
        return
      }

      setStatuses(data || [])
    } catch (err) {
      console.debug('fetchStatuses exception', err)
      setStatuses([])
    }
  }

  const postStatus = async (type) => {
    if (!user) return setMsg('Sign in first on the homepage.')
    if (!membership) return setMsg('You are not a member of any company. Ask admin to approve your join request.')

    setMsg('')
    setLoading(true)
    try {
      // insert and return the new status
      const { data: inserted, error } = await supabase
        .from('corp_statuses')
        .insert([{
          user_id: user.id,
          company_id: membership.company_id,
          type,
          message: ''
        }])
        .select()
        .single()

      if (error) {
        console.error('postStatus error', error)
        setMsg(`Failed to post status: ${error.message}`)
        return
      }

      // optimistic UI: add to statuses
      setStatuses(s => [inserted, ...s])
      setMsg('✅ Status updated successfully!')
      
      // Send notification to company
      await NotificationService.notifyStatusUpdate(
        membership.company_id,
        user.id,
        profile?.full_name || user.email,
        type
      )
      
      // Log status update for security
      await SecurityService.logStatusUpdate(
        membership.company_id,
        user.id,
        type
      )
      
      // Clear message after 3 seconds
      setTimeout(() => setMsg(''), 3000)
    } catch (err) {
      console.error('postStatus exception', err)
      setMsg(err.message || 'Failed to post status.')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
            <p className="text-gray-600 mt-1">Update your status and stay connected with your team</p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={() => router.push('/analytics')}
              variant="outline"
              size="small"
            >
              📊 Analytics
            </Button>
            <Button
              onClick={() => router.push('/members')}
              variant="outline"
              size="small"
            >
              👥 Team Members
            </Button>
            <Button
              onClick={() => router.push('/schedule')}
              variant="outline"
              size="small"
            >
              📅 Schedule
            </Button>
            <Button onClick={logout} variant="outline" size="small">
              Logout
            </Button>
          </div>
        </motion.div>

        {/* User Info */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {(profile.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {profile.full_name || user?.email}
                  </h3>
                  <p className="text-sm text-gray-600">Team Member</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Company Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          {membership ? (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {company?.name || 'Company'}
                  </h3>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Role:</span> {membership.role}
                    </p>
                    {companyOwner && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">CEO:</span> {companyOwner.full_name || companyOwner.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-xs text-gray-500 mt-1">Active</p>
                </div>
              </div>
            </Card>
          ) : (
            <Alert variant="warning">
              <div>
                <h4 className="font-semibold mb-2">Not a member of any company</h4>
                {pendingRequests.length > 0 ? (
                  <p className="text-sm">
                    Pending request to join <strong>{pendingRequests[0].corp_companies?.name || 'a company'}</strong>
                  </p>
                ) : (
                  <p className="text-sm">
                    Use "Join Company" on the homepage to request joining.
                  </p>
                )}
              </div>
            </Alert>
          )}
        </motion.div>

        {/* Status Update Section */}
        {membership && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card>
              <Card.Header>
                <Card.Title>Update Your Status</Card.Title>
                <p className="text-sm text-gray-600 mt-2">
                  Let your team know how you're doing today
                </p>
              </Card.Header>
              
              <Card.Content>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {STATUS_TYPES.map((status, index) => (
                    <motion.div
                      key={status.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <StatusCard
                        status={status.key}
                        onClick={() => postStatus(status.key)}
                        disabled={loading}
                        loading={loading}
                      />
                    </motion.div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        )}

        {/* Message */}
        <AnimatePresence>
          {msg && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Alert variant={msg.includes('✅') ? 'success' : 'info'}>
                {msg}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <Card.Header>
              <Card.Title>Recent Updates</Card.Title>
              <p className="text-sm text-gray-600 mt-2">
                Your latest status updates and team activity
              </p>
            </Card.Header>
            
            <Card.Content>
              {statuses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No updates yet</h3>
                  <p className="text-gray-600">Start by updating your status above</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {statuses.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {(profile?.full_name || item.user_id || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">
                            {profile?.full_name || item.user_id}
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
      </div>
    </Layout>
  )
}

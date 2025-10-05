// pages/employee.js
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import supabase from '../lib/supabaseClient'

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

  useEffect(() => {
    let channel = null

    const init = async () => {
      // fetch current user + profile
      const { data: authData } = await supabase.auth.getUser()
      const currentUser = authData?.user
      setUser(currentUser)
      if (!currentUser) return

      const { data: prof } = await supabase
        .from('corp_profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle()
      setProfile(prof)

      // check membership
      const { data: mem } = await supabase
        .from('corp_memberships')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle()

      if (mem) {
        setMembership(mem)
        // fetch company
        const { data: comp } = await supabase
          .from('corp_companies')
          .select('*')
          .eq('id', mem.company_id)
          .maybeSingle()
        setCompany(comp || null)

        if (comp) {
          // fetch owner profile (CEO)
          const { data: owner } = await supabase
            .from('corp_profiles')
            .select('id, full_name, email')
            .eq('id', comp.owner_id)
            .maybeSingle()
          setCompanyOwner(owner || null)
        }

        // fetch user's last 10 statuses (My Updates)
        await fetchStatuses(comp?.id, currentUser.id)

        // subscribe to realtime statuses for this user (so "My Updates" updates instantly)
        channel = supabase
          .channel(`public:corp_statuses_user_${currentUser.id}`)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'corp_statuses' },
            payload => {
              if (payload.new.user_id === currentUser.id) {
                setStatuses(s => [payload.new, ...s])
              }
            }
          )
          .subscribe()
      } else {
        // no membership: check if there's any pending join requests by this user
        const { data: pendings } = await supabase
          .from('corp_join_requests')
          .select('*, corp_companies(id, name)')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false })

        setPendingRequests(pendings || [])
      }
    }

    init()

    return () => {
      if (channel) {
        try { channel.unsubscribe() } catch (e) { /* ignore */ }
      }
    }
  }, [])

  const fetchStatuses = async (companyId, userId) => {
    if (!companyId || !userId) return
    const { data } = await supabase
      .from('corp_statuses')
      .select('*, corp_profiles(id, full_name)')
      .eq('company_id', companyId)
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(10)
    setStatuses(data || [])
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

      if (error) throw error

      // optimistic UI: add to statuses
      setStatuses(s => [inserted, ...s])
      setMsg('Status posted.')
    } catch (err) {
      console.error('postStatus error', err)
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
    <div className='container'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-semibold'>Update Your Day</h2>
        <div>
          <button onClick={logout} className='text-sm px-3 py-1 border rounded'>Logout</button>
        </div>
      </div>

      {profile && (
        <div className='mb-4'>
          <div className='text-sm text-gray-600'>Signed in as <strong>{profile.full_name || user?.email}</strong></div>
        </div>
      )}

      {/* Company / membership info */}
      {membership ? (
        <div className='mb-4 p-3 bg-gray-50 border rounded'>
          <div className='text-sm'><strong>Company:</strong> {company?.name || '—'}</div>
          <div className='text-sm'><strong>Your role:</strong> {membership.role}</div>
          {companyOwner && <div className='text-sm'>CEO: {companyOwner.full_name || companyOwner.email}</div>}
        </div>
      ) : (
        <div className='mb-4 p-3 bg-yellow-50 border rounded'>
          <div className='text-sm'>Not a member of any company.</div>
          {pendingRequests.length > 0 ? (
            <div className='text-sm mt-2'>Pending request to join <strong>{pendingRequests[0].corp_companies?.name || 'a company'}</strong></div>
          ) : (
            <div className='text-sm mt-2'>Use "Join Company" on the homepage to request joining.</div>
          )}
        </div>
      )}

      {/* Status buttons */}
      <div className='grid grid-cols-2 gap-3 mb-4'>
        {STATUS_TYPES.map(s => (
          <button
            key={s.key}
            onClick={() => postStatus(s.key)}
            disabled={loading}
            className='border rounded p-3 text-left'
          >
            {s.label}
          </button>
        ))}
      </div>

      {msg && <div className='mb-4 text-sm text-gray-700'>{msg}</div>}

      {/* My Updates */}
      <div className='mt-6'>
        <h3 className='font-semibold mb-3'>My Updates</h3>
        {statuses.length === 0 ? (
          <div className='text-sm text-gray-600'>No updates yet.</div>
        ) : (
          <ul>
            {statuses.map(item => (
              <li key={item.id} className='border p-2 mb-2'>
                <div className='text-sm text-gray-600'>{new Date(item.timestamp).toLocaleString()}</div>
                <div><strong>{item.corp_profiles?.full_name || item.user_id}</strong> — {item.type} {item.message}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

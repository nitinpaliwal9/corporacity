// pages/schedule.js - Scheduling and Calendar Management
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import supabase from '../lib/supabaseClient'
import Layout from '../components/ui/Layout'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Alert from '../components/ui/Alert'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Modal from '../components/ui/Modal'

export default function SchedulePage() {
  const [schedules, setSchedules] = useState([])
  const [leaveRequests, setLeaveRequests] = useState([])
  const [company, setCompany] = useState(null)
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState('employee')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [leaveForm, setLeaveForm] = useState({
    start_date: '',
    end_date: '',
    reason: '',
    type: 'sick'
  })
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    start_time: '09:00',
    end_time: '17:00',
    type: 'work'
  })
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        if (!currentUser) {
          router.push('/')
          return
        }
        setUser(currentUser)

        // Get user's company and role
        const { data: membership } = await supabase
          .from('corp_memberships')
          .select(`
            company_id,
            role,
            corp_companies!inner(id, name, code, owner_id)
          `)
          .eq('user_id', currentUser.id)
          .single()

        if (!membership) {
          setError('You are not a member of any company')
          return
        }

        setCompany(membership.corp_companies)
        setUserRole(membership.role)

        // Load schedules and leave requests
        await Promise.all([
          loadSchedules(membership.company_id),
          loadLeaveRequests(membership.company_id, membership.role, currentUser.id)
        ])
      } catch (err) {
        console.error('Error loading schedule data:', err)
        setError('Failed to load schedule data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const loadSchedules = async (companyId) => {
    try {
      const { data, error } = await supabase
        .from('corp_schedules')
        .select(`
          *,
          corp_profiles!inner(full_name, email)
        `)
        .eq('company_id', companyId)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })

      if (error) {
        console.error('Error loading schedules:', error)
        return
      }

      setSchedules(data || [])
    } catch (err) {
      console.error('Error loading schedules:', err)
    }
  }

  const loadLeaveRequests = async (companyId, role, userId) => {
    try {
      let query = supabase
        .from('corp_leave_requests')
        .select(`
          *,
          corp_profiles!inner(full_name, email)
        `)
        .eq('company_id', companyId)

      // If user is not owner/manager, only show their own requests
      if (role === 'employee') {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading leave requests:', error)
        return
      }

      setLeaveRequests(data || [])
    } catch (err) {
      console.error('Error loading leave requests:', err)
    }
  }

  const submitLeaveRequest = async () => {
    if (!user || !company) return

    try {
      const { error } = await supabase
        .from('corp_leave_requests')
        .insert([{
          user_id: user.id,
          company_id: company.id,
          start_date: leaveForm.start_date,
          end_date: leaveForm.end_date,
          reason: leaveForm.reason,
          type: leaveForm.type,
          status: 'pending'
        }])

      if (error) {
        console.error('Error submitting leave request:', error)
        setError('Failed to submit leave request')
        return
      }

      setShowLeaveModal(false)
      setLeaveForm({ start_date: '', end_date: '', reason: '', type: 'sick' })
      await loadLeaveRequests(company.id, userRole, user.id)
    } catch (err) {
      console.error('Error submitting leave request:', err)
      setError('Failed to submit leave request')
    }
  }

  const approveLeaveRequest = async (requestId, status) => {
    try {
      const { error } = await supabase
        .from('corp_leave_requests')
        .update({ status })
        .eq('id', requestId)

      if (error) {
        console.error('Error updating leave request:', error)
        setError('Failed to update leave request')
        return
      }

      await loadLeaveRequests(company.id, userRole, user.id)
    } catch (err) {
      console.error('Error updating leave request:', err)
      setError('Failed to update leave request')
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', label: 'Pending', icon: '⏳' },
      approved: { variant: 'success', label: 'Approved', icon: '✅' },
      rejected: { variant: 'error', label: 'Rejected', icon: '❌' }
    }
    
    const config = statusConfig[status] || statusConfig.pending
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        config.variant === 'success' ? 'bg-green-100 text-green-800' :
        config.variant === 'warning' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {config.icon} {config.label}
      </span>
    )
  }

  const getLeaveTypeBadge = (type) => {
    const typeConfig = {
      sick: { label: 'Sick Leave', icon: '🤒' },
      vacation: { label: 'Vacation', icon: '🏖️' },
      personal: { label: 'Personal', icon: '👤' },
      emergency: { label: 'Emergency', icon: '🚨' }
    }
    
    const config = typeConfig[type] || typeConfig.personal
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {config.icon} {config.label}
      </span>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Alert variant="error">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Error Loading Schedule</h3>
              <p className="text-sm">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4"
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </Alert>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Schedule & Leave Management
                </h1>
                <p className="text-gray-600">
                  {company?.name} • Manage schedules and leave requests
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowLeaveModal(true)}
                  variant="primary"
                >
                  📅 Request Leave
                </Button>
                {userRole === 'owner' && (
                  <Button
                    onClick={() => setShowScheduleModal(true)}
                    variant="outline"
                  >
                    📋 Add Schedule
                  </Button>
                )}
                <Button
                  onClick={() => router.push('/ceo')}
                  variant="outline"
                >
                  ← Back to Dashboard
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Leave Requests */}
          <motion.div variants={itemVariants} className="mb-8">
            <Card>
              <Card.Header>
                <Card.Title>Leave Requests</Card.Title>
                <p className="text-sm text-gray-600 mt-2">
                  {userRole === 'owner' ? 'Manage team leave requests' : 'Your leave requests'}
                </p>
              </Card.Header>
              <Card.Content>
                {leaveRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📅</div>
                    <p className="text-gray-500">No leave requests found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {leaveRequests.map((request) => (
                      <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {request.corp_profiles?.full_name || 'Unknown User'}
                              </h3>
                              {getLeaveTypeBadge(request.type)}
                              {getStatusBadge(request.status)}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-700">
                              {request.reason}
                            </p>
                          </div>
                          {userRole === 'owner' && request.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => approveLeaveRequest(request.id, 'approved')}
                                variant="success"
                                size="small"
                              >
                                Approve
                              </Button>
                              <Button
                                onClick={() => approveLeaveRequest(request.id, 'rejected')}
                                variant="error"
                                size="small"
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Content>
            </Card>
          </motion.div>

          {/* Upcoming Schedules */}
          <motion.div variants={itemVariants}>
            <Card>
              <Card.Header>
                <Card.Title>Upcoming Schedules</Card.Title>
                <p className="text-sm text-gray-600 mt-2">
                  Team schedules and important dates
                </p>
              </Card.Header>
              <Card.Content>
                {schedules.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📋</div>
                    <p className="text-gray-500">No upcoming schedules</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {schedules.map((schedule) => (
                      <div key={schedule.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {schedule.title || 'Schedule Event'}
                              </h3>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                📅 {schedule.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {new Date(schedule.date).toLocaleDateString()} • {schedule.start_time} - {schedule.end_time}
                            </p>
                            {schedule.description && (
                              <p className="text-sm text-gray-700">
                                {schedule.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Content>
            </Card>
          </motion.div>
        </motion.div>

        {/* Leave Request Modal */}
        <Modal
          isOpen={showLeaveModal}
          onClose={() => setShowLeaveModal(false)}
          title="Request Leave"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={leaveForm.start_date}
                  onChange={(e) => setLeaveForm({ ...leaveForm, start_date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <Input
                  type="date"
                  value={leaveForm.end_date}
                  onChange={(e) => setLeaveForm({ ...leaveForm, end_date: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave Type
              </label>
              <select
                value={leaveForm.type}
                onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sick">Sick Leave</option>
                <option value="vacation">Vacation</option>
                <option value="personal">Personal</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason
              </label>
              <textarea
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Please provide a reason for your leave request..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowLeaveModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={submitLeaveRequest}
                variant="primary"
                disabled={!leaveForm.start_date || !leaveForm.end_date || !leaveForm.reason}
              >
                Submit Request
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  )
}

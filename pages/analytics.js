// pages/analytics.js - Advanced Analytics Dashboard
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import supabase from '../lib/supabaseClient'
import Layout from '../components/ui/Layout'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Alert from '../components/ui/Alert'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import AnimatedCounter from '../components/ui/AnimatedCounter'

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState({
    attendance: { present: 0, late: 0, leave: 0, visit: 0, total: 0 },
    trends: { daily: [], weekly: [], monthly: [] },
    insights: { avgAttendance: 0, mostActiveDay: '', topPerformers: [] },
    reports: { today: [], thisWeek: [], thisMonth: [] }
  })
  const [company, setCompany] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dateRange, setDateRange] = useState('week') // week, month, quarter
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

        // Get user's company
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

        // Load analytics data
        await loadAnalytics(membership.company_id)
      } catch (err) {
        console.error('Error loading analytics:', err)
        setError('Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router, dateRange])

  const loadAnalytics = async (companyId) => {
    try {
      // Get date ranges
      const today = new Date()
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const startOfQuarter = new Date(today.getFullYear(), today.getMonth() - (today.getMonth() % 3), 1)

      // Get attendance stats for today
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      
      const { data: todayStats } = await supabase
        .from('corp_statuses')
        .select('type, user_id, timestamp')
        .eq('company_id', companyId)
        .gte('timestamp', todayStart.toISOString())
        .order('timestamp', { ascending: false })

      // Calculate today's attendance
      const userLatestStatus = {}
      ;(todayStats || []).forEach((status) => {
        if (!userLatestStatus[status.user_id] || 
            new Date(status.timestamp) > new Date(userLatestStatus[status.user_id].timestamp)) {
          userLatestStatus[status.user_id] = status
        }
      })

      const attendance = { present: 0, late: 0, leave: 0, visit: 0, total: Object.keys(userLatestStatus).length }
      Object.values(userLatestStatus).forEach((status) => {
        if (attendance[status.type] !== undefined) {
          attendance[status.type]++
        }
      })

      // Get weekly trends
      const { data: weeklyData } = await supabase
        .from('corp_statuses')
        .select('type, timestamp')
        .eq('company_id', companyId)
        .gte('timestamp', startOfWeek.toISOString())
        .order('timestamp', { ascending: true })

      // Process weekly trends
      const weeklyTrends = {}
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      days.forEach(day => {
        weeklyTrends[day] = { present: 0, late: 0, leave: 0, visit: 0 }
      })

      ;(weeklyData || []).forEach((status) => {
        const day = new Date(status.timestamp).toLocaleDateString('en-US', { weekday: 'long' })
        if (weeklyTrends[day] && weeklyTrends[day][status.type] !== undefined) {
          weeklyTrends[day][status.type]++
        }
      })

      // Get member count
      const { data: members } = await supabase
        .from('corp_memberships')
        .select('user_id')
        .eq('company_id', companyId)

      const totalMembers = members?.length || 0
      const avgAttendance = totalMembers > 0 ? Math.round((attendance.present / totalMembers) * 100) : 0

      // Get top performers (most active users)
      const userActivity = {}
      ;(weeklyData || []).forEach((status) => {
        userActivity[status.user_id] = (userActivity[status.user_id] || 0) + 1
      })

      const topPerformers = Object.entries(userActivity)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([userId, count]) => ({ userId, count }))

      setAnalytics({
        attendance,
        trends: { weekly: Object.entries(weeklyTrends).map(([day, stats]) => ({ day, ...stats })) },
        insights: { 
          avgAttendance, 
          mostActiveDay: Object.entries(weeklyTrends).reduce((a, b) => 
            (a[1].present + a[1].late) > (b[1].present + b[1].late) ? a : b
          )[0],
          topPerformers
        },
        reports: { today: Object.values(userLatestStatus) }
      })
    } catch (err) {
      console.error('Error loading analytics:', err)
      setError('Failed to load analytics data')
    }
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
              <h3 className="font-semibold mb-2">Error Loading Analytics</h3>
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
                  Analytics Dashboard
                </h1>
                <p className="text-gray-600">
                  {company?.name} • Insights and trends
                </p>
              </div>
              <div className="flex space-x-3">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                </select>
                <Button
                  onClick={() => router.push('/ceo')}
                  variant="outline"
                >
                  ← Back to Dashboard
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Key Metrics */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <Card.Content>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      <AnimatedCounter from={0} to={analytics.attendance.present} duration={1} />
                    </div>
                    <p className="text-gray-600">Present Today</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {analytics.insights.avgAttendance}% of team
                    </p>
                  </div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Content>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">
                      <AnimatedCounter from={0} to={analytics.attendance.late} duration={1} />
                    </div>
                    <p className="text-gray-600">Late Today</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {analytics.attendance.total > 0 ? Math.round((analytics.attendance.late / analytics.attendance.total) * 100) : 0}% of active
                    </p>
                  </div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Content>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      <AnimatedCounter from={0} to={analytics.attendance.leave} duration={1} />
                    </div>
                    <p className="text-gray-600">On Leave</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {analytics.attendance.total > 0 ? Math.round((analytics.attendance.leave / analytics.attendance.total) * 100) : 0}% of active
                    </p>
                  </div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Content>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      <AnimatedCounter from={0} to={analytics.attendance.visit} duration={1} />
                    </div>
                    <p className="text-gray-600">On Visit</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {analytics.attendance.total > 0 ? Math.round((analytics.attendance.visit / analytics.attendance.total) * 100) : 0}% of active
                    </p>
                  </div>
                </Card.Content>
              </Card>
            </div>
          </motion.div>

          {/* Weekly Trends */}
          <motion.div variants={itemVariants} className="mb-8">
            <Card>
              <Card.Header>
                <Card.Title>Weekly Attendance Trends</Card.Title>
                <p className="text-sm text-gray-600 mt-2">
                  Daily breakdown of team attendance patterns
                </p>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  {analytics.trends.weekly.map((dayData, index) => (
                    <div key={dayData.day} className="text-center">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        {dayData.day.slice(0, 3)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-green-600">✅</span>
                          <span>{dayData.present}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-yellow-600">⏰</span>
                          <span>{dayData.late}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-red-600">🏠</span>
                          <span>{dayData.leave}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-blue-600">🚗</span>
                          <span>{dayData.visit}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </motion.div>

          {/* Insights */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <Card.Header>
                  <Card.Title>Key Insights</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Average Attendance</p>
                        <p className="text-sm text-gray-600">This week</p>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {analytics.insights.avgAttendance}%
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Most Active Day</p>
                        <p className="text-sm text-gray-600">This week</p>
                      </div>
                      <div className="text-lg font-semibold text-green-600">
                        {analytics.insights.mostActiveDay}
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title>Today's Activity</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-3">
                    {analytics.reports.today.length > 0 ? (
                      analytics.reports.today.slice(0, 5).map((status, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {status.user_id.slice(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                User {status.user_id.slice(0, 8)}...
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(status.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            status.type === 'present' ? 'bg-green-100 text-green-800' :
                            status.type === 'late' ? 'bg-yellow-100 text-yellow-800' :
                            status.type === 'leave' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {status.type}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No activity today</p>
                    )}
                  </div>
                </Card.Content>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  )
}

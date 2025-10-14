// pages/admin.js - Advanced Admin Panel
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
import Badge from '../components/ui/Badge'

export default function AdminPanel() {
  const [auditLogs, setAuditLogs] = useState([])
  const [securityMetrics, setSecurityMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    failedLogins: 0,
    suspiciousActivity: 0
  })
  const [company, setCompany] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [dateRange, setDateRange] = useState('7d')
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

        // Check if user is company owner
        const { data: membership } = await supabase
          .from('corp_memberships')
          .select(`
            company_id,
            role,
            corp_companies!inner(id, name, code, owner_id)
          `)
          .eq('user_id', currentUser.id)
          .single()

        if (!membership || membership.role !== 'owner') {
          setError('Access denied. Only company owners can access this panel.')
          return
        }

        setCompany(membership.corp_companies)

        // Load admin data
        await Promise.all([
          loadAuditLogs(membership.company_id),
          loadSecurityMetrics(membership.company_id)
        ])
      } catch (err) {
        console.error('Error loading admin data:', err)
        setError('Failed to load admin data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router, dateRange])

  const loadAuditLogs = async (companyId) => {
    try {
      const { data, error } = await supabase
        .from('corp_audit_logs')
        .select(`
          *,
          corp_profiles!inner(full_name, email)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) {
        console.error('Error loading audit logs:', error)
        return
      }

      setAuditLogs(data || [])
    } catch (err) {
      console.error('Error loading audit logs:', err)
    }
  }

  const loadSecurityMetrics = async (companyId) => {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('corp_memberships')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)

      // Get active users (users with recent activity)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const { count: activeUsers } = await supabase
        .from('corp_statuses')
        .select('user_id', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .gte('timestamp', sevenDaysAgo.toISOString())

      // Get failed logins (from audit logs)
      const { count: failedLogins } = await supabase
        .from('corp_audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .eq('action', 'login_failed')

      // Get suspicious activity
      const { count: suspiciousActivity } = await supabase
        .from('corp_audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .eq('severity', 'high')

      setSecurityMetrics({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        failedLogins: failedLogins || 0,
        suspiciousActivity: suspiciousActivity || 0
      })
    } catch (err) {
      console.error('Error loading security metrics:', err)
    }
  }

  const getSeverityBadge = (severity) => {
    const severityConfig = {
      low: { variant: 'secondary', label: 'Low', icon: '🟢' },
      medium: { variant: 'warning', label: 'Medium', icon: '🟡' },
      high: { variant: 'error', label: 'High', icon: '🔴' },
      critical: { variant: 'error', label: 'Critical', icon: '🚨' }
    }
    
    const config = severityConfig[severity] || severityConfig.low
    return (
      <Badge variant={config.variant} size="small">
        {config.icon} {config.label}
      </Badge>
    )
  }

  const getActionBadge = (action) => {
    const actionConfig = {
      login: { label: 'Login', icon: '🔐' },
      logout: { label: 'Logout', icon: '🚪' },
      login_failed: { label: 'Failed Login', icon: '❌' },
      status_update: { label: 'Status Update', icon: '📊' },
      join_request: { label: 'Join Request', icon: '👥' },
      approval: { label: 'Approval', icon: '✅' },
      data_access: { label: 'Data Access', icon: '📁' },
      permission_change: { label: 'Permission Change', icon: '🔑' }
    }
    
    const config = actionConfig[action] || { label: action, icon: '📝' }
    return (
      <Badge variant="info" size="small">
        {config.icon} {config.label}
      </Badge>
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
              <h3 className="font-semibold mb-2">Access Denied</h3>
              <p className="text-sm">{error}</p>
              <Button
                onClick={() => router.push('/ceo')}
                className="mt-4"
                variant="outline"
              >
                Back to Dashboard
              </Button>
            </div>
          </Alert>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-6">
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
                  🔒 Admin Panel
                </h1>
                <p className="text-gray-600">
                  {company?.name} • Security & Administration
                </p>
              </div>
              <div className="flex space-x-3">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
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

          {/* Tabs */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview', icon: '📊' },
                  { id: 'audit', label: 'Audit Logs', icon: '📋' },
                  { id: 'security', label: 'Security', icon: '🔒' },
                  { id: 'users', label: 'User Management', icon: '👥' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <Card.Content>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {securityMetrics.totalUsers}
                      </div>
                      <p className="text-gray-600">Total Users</p>
                    </div>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Content>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {securityMetrics.activeUsers}
                      </div>
                      <p className="text-gray-600">Active Users</p>
                    </div>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Content>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600 mb-2">
                        {securityMetrics.failedLogins}
                      </div>
                      <p className="text-gray-600">Failed Logins</p>
                    </div>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Content>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">
                        {securityMetrics.suspiciousActivity}
                      </div>
                      <p className="text-gray-600">Suspicious Activity</p>
                    </div>
                  </Card.Content>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Audit Logs Tab */}
          {activeTab === 'audit' && (
            <motion.div variants={itemVariants}>
              <Card>
                <Card.Header>
                  <Card.Title>Audit Logs</Card.Title>
                  <p className="text-sm text-gray-600 mt-2">
                    Complete activity log for security monitoring
                  </p>
                </Card.Header>
                <Card.Content>
                  {auditLogs.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">📋</div>
                      <p className="text-gray-500">No audit logs found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-gray-900">
                                  {log.corp_profiles?.full_name || 'Unknown User'}
                                </h3>
                                {getActionBadge(log.action)}
                                {getSeverityBadge(log.severity)}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {log.description || 'No description available'}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  {new Date(log.created_at).toLocaleString()}
                                </span>
                                {log.ip_address && (
                                  <span className="text-xs text-gray-500">
                                    IP: {log.ip_address}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Content>
              </Card>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <Card.Header>
                    <Card.Title>Security Settings</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-600">Require 2FA for all users</p>
                        </div>
                        <Button 
                          onClick={() => {
                            // In a real app, this would open configuration settings
                            alert('Configuration feature coming soon! This would open the database configuration panel.');
                          }}
                          variant="outline" 
                          size="small"
                        >
                          Configure
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Session Timeout</p>
                          <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
                        </div>
                        <Button 
                          onClick={() => {
                            // In a real app, this would open configuration settings
                            alert('Configuration feature coming soon! This would open the database configuration panel.');
                          }}
                          variant="outline" 
                          size="small"
                        >
                          Configure
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">IP Restrictions</p>
                          <p className="text-sm text-gray-600">Limit access by IP address</p>
                        </div>
                        <Button 
                          onClick={() => {
                            // In a real app, this would open configuration settings
                            alert('Configuration feature coming soon! This would open the database configuration panel.');
                          }}
                          variant="outline" 
                          size="small"
                        >
                          Configure
                        </Button>
                      </div>
                    </div>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Header>
                    <Card.Title>Security Alerts</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">🚨</span>
                          <span className="text-sm font-medium text-red-800">
                            Multiple failed login attempts detected
                          </span>
                        </div>
                        <p className="text-xs text-red-600 mt-1">
                          5 minutes ago
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-600">⚠️</span>
                          <span className="text-sm font-medium text-yellow-800">
                            Unusual login location detected
                          </span>
                        </div>
                        <p className="text-xs text-yellow-600 mt-1">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </div>
            </motion.div>
          )}

          {/* User Management Tab */}
          {activeTab === 'users' && (
            <motion.div variants={itemVariants}>
              <Card>
                <Card.Header>
                  <Card.Title>User Management</Card.Title>
                  <p className="text-sm text-gray-600 mt-2">
                    Manage user permissions and access
                  </p>
                </Card.Header>
                <Card.Content>
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">👥</div>
                    <p className="text-gray-500">User management features coming soon</p>
                    <p className="text-sm text-gray-400 mt-2">
                      This will include role management, permission changes, and user activity monitoring
                    </p>
                  </div>
                </Card.Content>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </Layout>
  )
}

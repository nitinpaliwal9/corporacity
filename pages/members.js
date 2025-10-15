// pages/members.js - Team Member Directory
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import supabase from '../lib/supabaseClient'
import Layout from '../components/ui/Layout'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Alert from '../components/ui/Alert'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Modal from '../components/ui/Modal'

export default function MembersDirectory() {
  const [members, setMembers] = useState([])
  const [company, setCompany] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [error, setError] = useState('')
  const [designations, setDesignations] = useState([])
  const [editingMember, setEditingMember] = useState(null)
  const [selectedDesignation, setSelectedDesignation] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
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

        // Get all company members and designations
        await Promise.all([
          fetchMembers(membership.company_id),
          fetchDesignations(membership.company_id)
        ])
      } catch (err) {
        // Error loading data - could add toast notification here
        setError('Failed to load member data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const fetchDesignations = async (companyId) => {
    try {
      const { data, error } = await supabase
        .from('corp_designations')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_active', true)
        .order('level', { ascending: true })

      if (error) {
        // Error fetching designations - could add toast notification here
        return
      }

      setDesignations(data || [])
    } catch (err) {
      // Error fetching designations - could add toast notification here
    }
  }

  const fetchMembers = async (companyId) => {
    try {
      // First, get all memberships for the company with designation info
      const { data: memberships, error: membershipsError } = await supabase
        .from('corp_memberships')
        .select(`
          id,
          user_id,
          role,
          designation_id,
          department,
          employee_id,
          hire_date,
          manager_id,
          is_active,
          created_at,
          corp_designations(name, department, level)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

      if (membershipsError) {
        // Error fetching memberships - could add toast notification here
        setError('Failed to fetch members')
        return
      }

      if (!memberships || memberships.length === 0) {
        setMembers([])
        return
      }

      // Get user IDs from memberships
      const userIds = memberships.map(m => m.user_id)

      // Fetch profiles for all users
      const { data: profiles, error: profilesError } = await supabase
        .from('corp_profiles')
        .select(`
          id,
          full_name,
          email,
          phone
        `)
        .in('id', userIds)

      if (profilesError) {
        // Error fetching profiles - could add toast notification here
        setError('Failed to fetch member profiles')
        return
      }

      // Combine memberships with profiles
      const membersWithProfiles = memberships.map(membership => {
        const profile = profiles?.find(p => p.id === membership.user_id)
        return {
          ...membership,
          corp_profiles: profile || { id: membership.user_id, full_name: null, email: null, phone: null }
        }
      })

      // Get current status for each member
      const membersWithStatus = await Promise.all(
        membersWithProfiles.map(async (member) => {
          const today = new Date()
          const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
          
          const { data: latestStatus } = await supabase
            .from('corp_statuses')
            .select('type, timestamp')
            .eq('user_id', member.user_id)
            .eq('company_id', companyId)
            .gte('timestamp', startOfDay)
            .order('timestamp', { ascending: false })
            .limit(1)
            .single()

          return {
            ...member,
            currentStatus: latestStatus?.type || 'not_updated',
            lastStatusTime: latestStatus?.timestamp || null
          }
        })
      )

      setMembers(membersWithStatus)
    } catch (err) {
      // Error fetching members with status - could add toast notification here
      setError('Failed to fetch member statuses')
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      present: { variant: 'success', label: 'Present', icon: '✅' },
      late: { variant: 'warning', label: 'Late', icon: '⏰' },
      leave: { variant: 'error', label: 'On Leave', icon: '🏠' },
      visit: { variant: 'info', label: 'On Visit', icon: '🚗' },
      not_updated: { variant: 'secondary', label: 'Not Updated', icon: '❓' }
    }
    
    const config = statusConfig[status] || statusConfig.not_updated
    return (
      <Badge variant={config.variant} size="small">
        {config.icon} {config.label}
      </Badge>
    )
  }

  const getRoleBadge = (role) => {
    const roleConfig = {
      owner: { variant: 'primary', label: 'CEO/Owner' },
      manager: { variant: 'info', label: 'Manager' },
      employee: { variant: 'secondary', label: 'Employee' }
    }
    
    const config = roleConfig[role] || roleConfig.employee
    return (
      <Badge variant={config.variant} size="small">
        {config.label}
      </Badge>
    )
  }

  const handleMemberDoubleClick = (member) => {
    // Only allow owners and managers to edit designations
    if (user?.id !== company?.owner_id && user?.role !== 'manager') {
      return
    }
    
    setEditingMember(member)
    setSelectedDesignation(member.designation_id || '')
    setIsModalOpen(true)
  }

  const handleUpdateDesignation = async () => {
    if (!editingMember || !selectedDesignation) return

    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from('corp_memberships')
        .update({ designation_id: selectedDesignation })
        .eq('id', editingMember.id)

      if (error) {
        // Error updating designation - could add toast notification here
        setError('Failed to update designation')
        return
      }

      // Update local state
      setMembers(prev => prev.map(member => 
        member.id === editingMember.id 
          ? { ...member, designation_id: selectedDesignation }
          : member
      ))

      setIsModalOpen(false)
      setEditingMember(null)
      setSelectedDesignation('')
    } catch (err) {
      // Error updating designation - could add toast notification here
      setError('Failed to update designation')
    } finally {
      setIsUpdating(false)
    }
  }

  const getDesignationName = (member) => {
    if (member.corp_designations) {
      return member.corp_designations.name
    }
    return 'No Designation'
  }

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.corp_profiles.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.corp_profiles.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || member.role === filterRole
    const matchesStatus = filterStatus === 'all' || member.currentStatus === filterStatus
    
    return matchesSearch && matchesRole && matchesStatus
  })

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
              <h3 className="font-semibold mb-2">Error Loading Members</h3>
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
                  Team Members
                </h1>
                <p className="text-gray-600">
                  {company?.name} • {members.length} member{members.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => router.push('/ceo')}
                  variant="outline"
                >
                  ← Back to Dashboard
                </Button>
                <Button
                  onClick={() => fetchMembers(company.id)}
                  variant="outline"
                >
                  🔄 Refresh
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div variants={itemVariants} className="mb-6">
            <Card>
              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Members
                    </label>
                    <Input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Role
                    </label>
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Roles</option>
                      <option value="owner">CEO/Owner</option>
                      <option value="manager">Manager</option>
                      <option value="employee">Employee</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="present">Present</option>
                      <option value="late">Late</option>
                      <option value="leave">On Leave</option>
                      <option value="visit">On Visit</option>
                      <option value="not_updated">Not Updated</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={() => {
                        setSearchTerm('')
                        setFilterRole('all')
                        setFilterStatus('all')
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </motion.div>

          {/* Members Grid */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <motion.div
                  key={member.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <Card.Content>
                      <div className="flex items-start space-x-4">
                        <Avatar
                          name={member.corp_profiles.full_name || member.corp_profiles.email}
                          size="large"
                          status={member.currentStatus === 'present' ? 'online' : 'offline'}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 
                              className={`text-lg font-semibold text-gray-900 truncate ${
                                (user?.id === company?.owner_id || user?.role === 'manager') 
                                  ? 'cursor-pointer hover:text-blue-600 transition-colors' 
                                  : ''
                              }`}
                              onDoubleClick={() => handleMemberDoubleClick(member)}
                              title={
                                (user?.id === company?.owner_id || user?.role === 'manager') 
                                  ? 'Double-click to edit designation' 
                                  : ''
                              }
                            >
                              {member.corp_profiles.full_name || 'No Name'}
                            </h3>
                            {getRoleBadge(member.role)}
                          </div>
                          
                          <p className="text-sm text-gray-500 mb-1 truncate">
                            {getDesignationName(member)}
                          </p>
                          
                          <p className="text-sm text-gray-600 mb-2 truncate">
                            {member.corp_profiles.email}
                          </p>
                          
                          {member.corp_profiles.phone && (
                            <p className="text-sm text-gray-500 mb-3">
                              📞 {member.corp_profiles.phone}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div>
                              {getStatusBadge(member.currentStatus)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {member.lastStatusTime ? (
                                new Date(member.lastStatusTime).toLocaleTimeString()
                              ) : (
                                'No status today'
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                              Joined: {new Date(member.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Empty State */}
          {filteredMembers.length === 0 && (
            <motion.div variants={itemVariants} className="text-center py-12">
              <Card>
                <Card.Content>
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No members found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'No members have been added to this company yet'
                    }
                  </p>
                  {(searchTerm || filterRole !== 'all' || filterStatus !== 'all') && (
                    <Button
                      onClick={() => {
                        setSearchTerm('')
                        setFilterRole('all')
                        setFilterStatus('all')
                      }}
                      variant="outline"
                    >
                      Clear Filters
                    </Button>
                  )}
                </Card.Content>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Designation Edit Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <Modal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false)
                setEditingMember(null)
                setSelectedDesignation('')
              }}
              title="Update Designation"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {editingMember?.corp_profiles?.full_name || 'No Name'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {editingMember?.corp_profiles?.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Designation
                  </label>
                  <p className="text-sm text-gray-600">
                    {editingMember ? getDesignationName(editingMember) : 'No Designation'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select New Designation
                  </label>
                  <select
                    value={selectedDesignation}
                    onChange={(e) => setSelectedDesignation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">No Designation</option>
                    {designations.map((designation) => (
                      <option key={designation.id} value={designation.id}>
                        {designation.name} {designation.department ? `(${designation.department})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    onClick={() => {
                      setIsModalOpen(false)
                      setEditingMember(null)
                      setSelectedDesignation('')
                    }}
                    variant="outline"
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateDesignation}
                    variant="primary"
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Updating...' : 'Update Designation'}
                  </Button>
                </div>
              </div>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  )
}

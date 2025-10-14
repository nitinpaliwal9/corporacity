// pages/create-company.js
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
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'

export default function CreateCompany() {
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [generatedCode, setGeneratedCode] = useState('')
  const router = useRouter()

  useEffect(() => {
    // robust session load: try getUser then getSession
    const loadUser = async () => {
      try {
        // prefer getUser if available
        if (supabase.auth.getUser) {
          const maybe = await supabase.auth.getUser()
          const found = maybe?.data?.user ?? maybe?.user ?? null
          if (found) {
            setUser(found)
            return
          }
        }
      } catch (e) {
        console.debug('getUser() failed', e)
      }

      // fallback: wait for session to be restored
      for (let i = 0; i < 10; i++) {
        try {
          const { data: sessionData } = await supabase.auth.getSession()
          const currentUser = sessionData?.session?.user || null
          if (currentUser) {
            setUser(currentUser)
            return
          }
        } catch (e) {
          console.debug('getSession() attempt failed', e)
        }
        await new Promise((r) => setTimeout(r, 200))
      }

      setMsg('⚠️ No active session found. Please sign in again.')
    }
    loadUser()
  }, [])

  // Generate preview code when name changes
  useEffect(() => {
    if (name.trim()) {
      const previewCode = 
        name.split(' ')[0].toUpperCase().slice(0, 5) +
        Math.random().toString(36).slice(2, 7).toUpperCase()
      setGeneratedCode(previewCode)
    } else {
      setGeneratedCode('')
    }
  }, [name])

  const validateForm = () => {
    const newErrors = {}
    
    if (!name.trim()) {
      newErrors.name = 'Company name is required'
    } else if (name.trim().length < 2) {
      newErrors.name = 'Company name must be at least 2 characters'
    } else if (name.trim().length > 50) {
      newErrors.name = 'Company name must be less than 50 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const create = async () => {
    setMsg('')
    if (!user) return setMsg('Please sign in first.')
    
    if (!validateForm()) {
      setMsg('Please fix the errors below')
      return
    }

    setLoading(true)
    setMsg('Creating your company...')

    try {
      // generate unique company code
      const code =
        name.trim().split(' ')[0].toUpperCase().slice(0, 5) +
        Math.random().toString(36).slice(2, 7).toUpperCase()

      // try insert company (owner_id set)
      const { data, error } = await supabase
        .from('corp_companies')
        .insert([{ name: name.trim(), code, owner_id: user.id }])
        .select()
        .single()

      if (error) {
        console.error('Insert company error:', error)
        setMsg(
          error?.message
            ? `Failed to create company: ${error.message}`
            : 'Failed to create company. Please try again.'
        )
        return
      }

      // create CEO membership
      const { error: memErr } = await supabase
        .from('corp_memberships')
        .insert([{ user_id: user.id, company_id: data.id, role: 'owner' }])

      if (memErr) {
        console.error('Insert membership error:', memErr)
        setMsg(`Company created but membership setup failed: ${memErr.message || 'Please contact support'}`)
        setTimeout(() => router.push('/ceo'), 2000)
        return
      }

      setMsg(`✅ Company created successfully! Redirecting to your CEO dashboard...`)

      // short delay so message is visible before redirect
      setTimeout(() => router.push('/ceo'), 2000)
    } catch (err) {
      console.error('create-company exception:', err)
      setMsg(err?.message || 'Failed to create company. Please try again.')
    } finally {
      setLoading(false)
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-2xl"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-2xl">C</span>
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Corporacity
                </h1>
                <p className="text-sm text-gray-500 -mt-1">Team Status Management</p>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Create Your Company
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
              Start your own company and become the CEO. You'll get a unique company code to share with your team.
            </p>
          </motion.div>

          {/* User Info */}
          {user && (
            <motion.div variants={itemVariants} className="mb-8">
              <Card className="bg-white/80 backdrop-blur-sm border-blue-200 max-w-md mx-auto">
                <div className="flex items-center space-x-4">
                  <Avatar 
                    name={user.email} 
                    size="large"
                    status="online"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.user_metadata?.full_name || user.email}
                    </h3>
                    <p className="text-sm text-gray-600">Future CEO</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Company Creation Form */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
              <Card.Header>
                <Card.Title>Company Details</Card.Title>
                <p className="text-sm text-gray-600 mt-2">
                  Enter your company name. We'll generate a unique code for your team to join.
                </p>
              </Card.Header>
              
              <Card.Content>
                <div className="space-y-6">
                  {/* Company Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your company name"
                      error={errors.name}
                      className="w-full"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      This will be visible to all team members
                    </p>
                  </div>

                  {/* Generated Code Preview */}
                  {generatedCode && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">
                            Your Company Code
                          </h4>
                          <p className="text-xs text-gray-600">
                            Share this code with team members to join your company
                          </p>
                        </div>
                        <Badge variant="primary" size="large" animated>
                          {generatedCode}
                        </Badge>
                      </div>
                    </motion.div>
                  )}

                  {/* Features Preview */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900">
                      What you'll get as CEO:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span className="text-gray-600">Unique company code</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span className="text-gray-600">Team management dashboard</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span className="text-gray-600">Approve join requests</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span className="text-gray-600">Real-time team status</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={create}
              loading={loading}
              size="large"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {loading ? 'Creating Company...' : 'Create My Company'}
            </Button>
            
            <Button
              onClick={() => router.push('/onboarding')}
              variant="outline"
              size="large"
              className="px-8 py-3"
            >
              Back to Options
            </Button>
          </motion.div>

          {/* Message Display */}
          {msg && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 max-w-md mx-auto"
            >
              <Alert variant={msg.includes('✅') ? 'success' : msg.includes('Failed') ? 'error' : 'info'}>
                {msg}
              </Alert>
            </motion.div>
          )}

          {/* Help Section */}
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <Card className="bg-white/60 backdrop-blur-sm border-gray-200 max-w-xl mx-auto">
              <div className="p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Need Help?
                </h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>• Choose a clear, professional company name</p>
                  <p>• Your company code will be generated automatically</p>
                  <p>• You can always change settings later in your CEO dashboard</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  )
}

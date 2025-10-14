// pages/join.js
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

export default function JoinCompany() {
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [companyInfo, setCompanyInfo] = useState(null)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    const boot = async () => {
      try {
        // Try v2 getUser shape
        const maybe = await supabase.auth.getUser?.()
        const u = maybe?.data?.user ?? maybe?.user ?? null

        // Fallback to getSession (older/newer shapes)
        if (!u) {
          const maybeSession = await supabase.auth.getSession?.()
          const session = maybeSession?.data?.session ?? maybeSession?.session ?? null
          if (session?.user) {
            if (mounted) setUser(session.user)
            return
          }
        }

        if (u && mounted) setUser(u)
      } catch (err) {
        console.debug('auth bootstrap error (non-fatal):', err)
      }
    }

    boot()
    return () => { mounted = false }
  }, [])

  // Validate company code format
  const validateCode = (code) => {
    const trimmed = code.trim()
    if (!trimmed) return 'Company code is required'
    if (trimmed.length < 5) return 'Company code must be at least 5 characters'
    if (trimmed.length > 10) return 'Company code must be less than 10 characters'
    if (!/^[A-Z0-9]+$/.test(trimmed)) return 'Company code must contain only uppercase letters and numbers'
    return null
  }

  // Check company when code changes
  useEffect(() => {
    const checkCompany = async () => {
      if (!code.trim() || validateCode(code)) {
        setCompanyInfo(null)
        return
      }

      try {
        const { data: company, error } = await supabase
          .from('corp_companies')
          .select('*')
          .eq('code', code.trim().toUpperCase())
          .maybeSingle()

        if (!error && company) {
          setCompanyInfo(company)
        } else {
          setCompanyInfo(null)
        }
      } catch (err) {
        console.debug('Company check error:', err)
        setCompanyInfo(null)
      }
    }

    const timeoutId = setTimeout(checkCompany, 500)
    return () => clearTimeout(timeoutId)
  }, [code])

  const requestJoin = async () => {
    if (!user) return setMsg('Please sign in first on the homepage.')
    
    const codeError = validateCode(code)
    if (codeError) {
      setErrors({ code: codeError })
      setMsg('Please fix the errors below')
      return
    }

    setLoading(true)
    setMsg('Sending join request...')
    setErrors({})

    try {
      // Step 1: find company by code
      const { data: company, error: companyErr } = await supabase
        .from('corp_companies')
        .select('*')
        .eq('code', code.trim().toUpperCase())
        .maybeSingle()

      if (companyErr) {
        console.error('company lookup error', companyErr)
        setMsg('Error while checking company. Please try again.')
        setLoading(false)
        return
      }

      if (!company) {
        setMsg('❌ Company not found. Check the code and try again.')
        setLoading(false)
        return
      }

      // Step 2: check if already member
      const { data: member, error: memberErr } = await supabase
        .from('corp_memberships')
        .select('*')
        .eq('user_id', user.id)
        .eq('company_id', company.id)
        .maybeSingle()

      if (memberErr) {
        console.error('membership check error', memberErr)
        setMsg('Error checking membership. Please try again.')
        setLoading(false)
        return
      }

      if (member) {
        setMsg('You are already a member of this company.')
        setLoading(false)
        return
      }

      // Step 3: check if a join request already exists
      const { data: existing, error: existingErr } = await supabase
        .from('corp_join_requests')
        .select('*')
        .eq('company_id', company.id)
        .eq('user_id', user.id)
        .maybeSingle()

      if (existingErr) {
        console.error('existing request check error', existingErr)
        setMsg('Error checking existing requests. Please try again.')
        setLoading(false)
        return
      }

      if (existing) {
        setMsg('You already have a pending join request for this company.')
        setLoading(false)
        return
      }

      // Step 4: insert new join request
      const { data: insertData, error: insertErr } = await supabase
        .from('corp_join_requests')
        .insert([
          {
            company_id: company.id,
            user_id: user.id,
            message: 'Request to join this company',
          },
        ])

      if (insertErr) {
        console.error('join request insert error', insertErr)
        const friendly = insertErr.message || 'Failed to send join request. Please try again.'
        setMsg(`❌ ${friendly}`)
        setLoading(false)
        return
      }

      setMsg(`✅ Join request sent to ${company.name}! Redirecting to your dashboard...`)

      setTimeout(() => {
        router.push('/employee')
      }, 2000)
    } catch (err) {
      console.error('join-company unexpected error:', err)
      setMsg(err?.message || 'Something went wrong. Please try again.')
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
              Join a Company
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
              Enter your company code to request joining an existing team. Your request will be sent to the CEO for approval.
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
                    <p className="text-sm text-gray-600">Ready to join a team</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Join Form */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
              <Card.Header>
                <Card.Title>Company Code</Card.Title>
                <p className="text-sm text-gray-600 mt-2">
                  Ask your team lead or CEO for the company code to join their team.
                </p>
              </Card.Header>
              
              <Card.Content>
                <div className="space-y-6">
                  {/* Company Code Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Code <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="Enter company code (e.g., ABC123)"
                      error={errors.code}
                      className="w-full font-mono text-center text-lg tracking-wider"
                    />
                    {errors.code && (
                      <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Company codes are usually 5-10 characters long
                    </p>
                  </div>

                  {/* Company Info Preview */}
                  {companyInfo && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">
                            Company Found
                          </h4>
                          <p className="text-sm text-gray-600">
                            {companyInfo.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Code: {companyInfo.code}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="success" size="medium" animated>
                            Valid
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Process Steps */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900">
                      What happens next:
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">1</div>
                        <span className="text-gray-600">Send join request to company</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xs font-semibold">2</div>
                        <span className="text-gray-600">Wait for CEO approval</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold">3</div>
                        <span className="text-gray-600">Start collaborating with your team</span>
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
              onClick={requestJoin}
              loading={loading}
              disabled={!companyInfo}
              size="large"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Sending Request...' : 'Request to Join'}
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
              <Alert variant={msg.includes('✅') ? 'success' : msg.includes('❌') ? 'error' : 'info'}>
                {msg}
              </Alert>
            </motion.div>
          )}

          {/* Help Section */}
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <Card className="bg-white/60 backdrop-blur-sm border-gray-200 max-w-xl mx-auto">
              <div className="p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Don't have a company code?
                </h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>• Ask your team lead or CEO for the company code</p>
                  <p>• Company codes are usually shared via email or team chat</p>
                  <p>• If you're starting a new team, consider creating a company instead</p>
                </div>
                <div className="mt-3">
                  <Button
                    onClick={() => router.push('/create-company')}
                    variant="outline"
                    size="small"
                    className="text-xs"
                  >
                    Create Company Instead
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  )
}

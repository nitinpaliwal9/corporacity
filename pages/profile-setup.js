// pages/profile-setup.js
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

export default function ProfileSetup() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setFullName(data.user?.user_metadata?.full_name || data.user?.user_metadata?.name || '')
    })
  }, [])

  const validateForm = () => {
    const newErrors = {}
    
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters'
    }
    
    if (phone && !/^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const saveProfile = async () => {
    if (!user) return setMsg('Please sign in first.')
    
    if (!validateForm()) {
      setMsg('Please fix the errors below')
      return
    }

    setLoading(true)
    setMsg('')
    
    try {
      await supabase.from('corp_profiles').upsert([{
        id: user.id,
        email: user.email,
        full_name: fullName.trim(),
        phone: phone.trim() || null
      }])

      // After profile saved, go to onboarding so user creates/join
      router.push('/onboarding')
    } catch (err) {
      console.error('saveProfile error', err)
      setMsg('Failed to save profile. Please try again.')
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
    <Layout showHeader={false} showFooter={false}>
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
              Complete Your Profile
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
              Let's set up your profile so your team can recognize you and stay connected.
            </p>
          </motion.div>

          {/* User Info Preview */}
          {user && (
            <motion.div variants={itemVariants} className="mb-8">
              <Card className="bg-white/80 backdrop-blur-sm border-blue-200 max-w-md mx-auto">
                <div className="flex items-center space-x-4">
                  <Avatar 
                    name={fullName || user.email} 
                    size="large"
                    status="online"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {fullName || 'Your Name'}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">Profile Preview</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Profile Form */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
              <Card.Header>
                <Card.Title>Profile Information</Card.Title>
                <p className="text-sm text-gray-600 mt-2">
                  This information will be visible to your team members and help them identify you.
                </p>
              </Card.Header>
              
              <Card.Content>
                <div className="space-y-6">
                  {/* Full Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      error={errors.fullName}
                      className="w-full"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-gray-400">(Optional)</span>
                    </label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      error={errors.phone}
                      className="w-full"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Include country code for international numbers (e.g., +1 555 123 4567)
                    </p>
                  </div>

                  {/* Email Display (Read-only) */}
                  {user && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full bg-gray-50"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        This is your sign-in email and cannot be changed here.
                      </p>
                    </div>
                  )}
                </div>
              </Card.Content>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={saveProfile}
              loading={loading}
              size="large"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {loading ? 'Saving Profile...' : 'Save & Continue'}
            </Button>
            
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              size="large"
              className="px-8 py-3"
            >
              Cancel
            </Button>
          </motion.div>

          {/* Message Display */}
          {msg && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 max-w-md mx-auto"
            >
              <Alert variant={msg.includes('Failed') ? 'error' : 'info'}>
                {msg}
              </Alert>
            </motion.div>
          )}

          {/* Help Section */}
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <Card className="bg-white/60 backdrop-blur-sm border-gray-200 max-w-xl mx-auto">
              <div className="p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Why do we need this information?
                </h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>• Your full name helps team members identify you in status updates</p>
                  <p>• Phone number is optional but useful for emergency contact</p>
                  <p>• All information is secure and only visible to your team</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  )
}

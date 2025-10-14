// pages/onboarding.js
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import supabase from '../lib/supabaseClient'
import Layout from '../components/ui/Layout'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'

export default function Onboarding() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
          console.error('Error loading user:', error)
          setMsg('Error loading user data. Please refresh the page.')
        } else {
          setUser(data.user)
        }
      } catch (err) {
        console.error('Exception loading user:', err)
        setMsg('Error loading user data. Please refresh the page.')
      }
    }
    
    loadUser()
  }, [])

  const handleCreateCompany = () => {
    router.push('/create-company')
  }

  const handleJoinCompany = () => {
    router.push('/join')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
          className="w-full max-w-4xl"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-12">
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
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Your Team Hub
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Let's get you set up! Choose how you'd like to get started with Corporacity.
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
                    <p className="text-sm text-gray-600">Ready to get started</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Options Grid */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {/* Create Company Option */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-3xl">🏢</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Create a Company
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Start your own company and invite team members. You'll be the CEO with full control over your organization.
                  </p>
                  
                  <div className="space-y-3 mb-6 text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Generate unique company code</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Invite team members</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Manage join requests</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleCreateCompany}
                    size="large"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Create My Company
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Join Company Option */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-3xl">👥</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Join a Company
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Already have a company code? Join an existing team and start collaborating with your colleagues.
                  </p>
                  
                  <div className="space-y-3 mb-6 text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Enter company code</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Send join request</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Wait for approval</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleJoinCompany}
                    variant="outline"
                    size="large"
                    className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Join Existing Company
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Help Section */}
          <motion.div variants={itemVariants} className="mt-12 text-center">
            <Card className="bg-white/60 backdrop-blur-sm border-gray-200 max-w-2xl mx-auto">
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Need Help Getting Started?
                </h4>
                <p className="text-gray-600 mb-4">
                  If you're not sure which option to choose, here's a quick guide:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <strong className="text-blue-600">Create Company:</strong> Choose this if you're starting a new team or organization.
                  </div>
                  <div className="text-left">
                    <strong className="text-green-600">Join Company:</strong> Choose this if you have a company code from your team lead.
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {msg && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 max-w-md mx-auto"
            >
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
                {msg}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </Layout>
  )
}

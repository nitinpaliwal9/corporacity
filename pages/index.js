'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import supabase from '../lib/supabaseClient'
import Link from 'next/link'
import Layout from '../components/ui/Layout'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import AnimatedCounter from '../components/ui/AnimatedCounter'

export default function Home() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ companies: 0, users: 0, statuses: 0 })

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      // placeholder - you can use this to route users after login
    })
    return () => {
      listener?.subscription?.unsubscribe()
    }
  }, [])

  // Mock stats for demo
  useEffect(() => {
    setStats({ companies: 1247, users: 8934, statuses: 45678 })
  }, [])

  const signInWithGoogle = async () => {
    setLoading(true)
    setMessage('')
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://corporacity.hustlehackai.in'
      }
    })
    
    if (error) {
      console.error('OAuth error', error)
      setMessage(error.message)
    }
    
    setLoading(false)
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
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <motion.div variants={itemVariants} className="mb-8">
                <div className="inline-flex items-center space-x-3 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <span className="text-white font-bold text-2xl">C</span>
                  </div>
                  <div className="text-left">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      Corporacity
                    </h1>
                    <p className="text-sm text-gray-500 -mt-1">Team Status Management</p>
                  </div>
                </div>
              </motion.div>

              <motion.h2 
                variants={itemVariants}
                className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
              >
                Keep Your Team
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  In Sync
                </span>
              </motion.h2>

              <motion.p 
                variants={itemVariants}
                className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
              >
                Real-time status updates, seamless collaboration, and powerful insights. 
                The simplest way to manage your team's daily status and boost productivity.
              </motion.p>

              <motion.div variants={itemVariants} className="mb-12">
                <Button
                  onClick={signInWithGoogle}
                  loading={loading}
                  size="large"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  {loading ? 'Signing in...' : 'Get Started with Google'}
                </Button>
              </motion.div>

              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
                >
                  {message}
                </motion.div>
              )}

              {/* Stats */}
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    <AnimatedCounter value={stats.companies} />
                  </div>
                  <div className="text-gray-600">Active Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    <AnimatedCounter value={stats.users} />
                  </div>
                  <div className="text-gray-600">Team Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    <AnimatedCounter value={stats.statuses} />
                  </div>
                  <div className="text-gray-600">Status Updates</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Everything you need to manage your team
              </h3>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Powerful features designed to streamline team communication and boost productivity
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: '⚡',
                  title: 'Real-time Updates',
                  description: 'Instant status updates across your entire team with live notifications'
                },
                {
                  icon: '🔒',
                  title: 'Secure & Private',
                  description: 'Enterprise-grade security with Row Level Security and data encryption'
                },
                {
                  icon: '📊',
                  title: 'Analytics Dashboard',
                  description: 'Comprehensive insights into team productivity and attendance patterns'
                },
                {
                  icon: '👥',
                  title: 'Easy Team Management',
                  description: 'Simple company creation and employee invitation system'
                },
                {
                  icon: '📱',
                  title: 'Mobile Ready',
                  description: 'Responsive design that works perfectly on all devices'
                },
                {
                  icon: '🚀',
                  title: 'Lightning Fast',
                  description: 'Optimized performance with instant loading and smooth animations'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full text-center hover:shadow-xl transition-shadow duration-300">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to transform your team management?
              </h3>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of teams already using Corporacity to stay connected and productive
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={signInWithGoogle}
                  loading={loading}
                  variant="secondary"
                  size="large"
                  className="bg-white text-blue-600 hover:bg-gray-50"
                >
                  Start Free Trial
                </Button>
                <Link href="/create-company">
                  <Button
                    variant="outline"
                    size="large"
                    className="border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    Create Company
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Demo Links */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Try the Demo
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <Link href="/employee">
                  <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <div className="text-2xl mb-2">👤</div>
                    <h4 className="font-semibold text-gray-900 mb-2">Employee Dashboard</h4>
                    <p className="text-sm text-gray-600">Update your status and view team updates</p>
                  </Card>
                </Link>
                <Link href="/ceo">
                  <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <div className="text-2xl mb-2">👑</div>
                    <h4 className="font-semibold text-gray-900 mb-2">CEO Dashboard</h4>
                    <p className="text-sm text-gray-600">Manage team and approve join requests</p>
                  </Card>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

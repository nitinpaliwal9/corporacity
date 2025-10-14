'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Head from 'next/head'
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
    
    try {
      console.log('Starting Google sign-in...')
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/onboarding`
        }
      })
      
      console.log('Google sign-in result:', { data, error })
      
      if (error) {
        console.error('Google sign-in error:', error)
        setMessage(`Sign in failed: ${error.message}`)
      } else {
        console.log('Google sign-in initiated successfully')
      }
    } catch (err) {
      console.error('Google sign-in exception:', err)
      setMessage(`Sign in failed: ${err.message}`)
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
    <>
      <Head>
        {/* SEO Meta Tags for Google */}
        <title>Corporacity - AI-Powered Team Management & Status Tracking</title>
        <meta name="description" content="Transform team data into strategic intelligence with Corporacity. AI-powered analytics, smart scheduling, and real-time team status tracking for modern businesses." />
        <meta name="keywords" content="team management, status tracking, AI analytics, team productivity, attendance tracking, workforce management, team collaboration" />
        <meta name="author" content="Corporacity" />
        
        {/* Open Graph Meta Tags for Social Media */}
        <meta property="og:title" content="Corporacity - AI-Powered Team Management & Status Tracking" />
        <meta property="og:description" content="Transform team data into strategic intelligence with AI-powered analytics, smart scheduling, and real-time team status tracking." />
        <meta property="og:image" content="/logo.webp" />
        <meta property="og:url" content="https://corporacity.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Corporacity" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Corporacity - AI-Powered Team Management" />
        <meta name="twitter:description" content="Transform team data into strategic intelligence with AI-powered analytics and real-time tracking." />
        <meta name="twitter:image" content="/logo.webp" />
        
        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href="https://corporacity.com" />
        
        {/* Favicon */}
        <link rel="icon" type="image/webp" href="/logo.webp" />
        <link rel="shortcut icon" href="/logo.webp" />
      </Head>
      
      <Layout showHeader={true} showFooter={false}>
        <div className="min-h-screen scroll-smooth">
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-screen flex items-center">
          {/* Enhanced Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 dark:from-blue-900/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-100/20 dark:from-indigo-900/20 via-transparent to-transparent" />
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-10 left-20 w-72 h-72 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
          
          {/* Floating Icons */}
          <div className="absolute top-32 left-1/4 text-4xl opacity-10 animate-bounce" style={{ animationDelay: '1s' }}>📊</div>
          <div className="absolute top-48 right-1/4 text-4xl opacity-10 animate-bounce" style={{ animationDelay: '3s' }}>👥</div>
          <div className="absolute bottom-20 left-1/3 text-4xl opacity-10 animate-bounce" style={{ animationDelay: '5s' }}>⚡</div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
                <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8 p-3 sm:p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-xl">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300 p-2">
                    <img 
                      src="/logo.webp" 
                      alt="Corporacity Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
                      Corporacity
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 font-medium">Team Status Management</p>
                  </div>
                </div>
              </motion.div>

              <motion.h2 
                variants={itemVariants}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 leading-[1.4] pb-2"
              >
                Transform Team Data Into
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent pb-1">
                  Strategic Intelligence
                </span>
              </motion.h2>

              <motion.p 
                variants={itemVariants}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed font-medium px-4"
              >
                The world's first AI-powered team intelligence platform. Beyond status tracking - 
                predict productivity patterns, prevent burnout, and optimize your workforce for maximum ROI.
              </motion.p>

              <motion.div variants={itemVariants} className="mb-12 sm:mb-16">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <Button
                    onClick={signInWithGoogle}
                    loading={loading}
                    size="large"
                    className="premium-button bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-0 relative overflow-hidden w-full sm:w-auto touch-target"
                  >
                    {loading ? 'Signing in...' : '🚀 Start Free Trial'}
                  </Button>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 text-center">
                    <span className="text-sm">✨</span>
                    <span className="text-xs sm:text-sm font-medium">Free forever • No credit card required</span>
                  </div>
                </div>
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

              {/* AI-Powered Insights Stats */}
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
              >
                <div className="text-center p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl border border-white/30 dark:border-slate-700/30 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-3xl">🧠</span>
                  </div>
                  <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-3">
                    <AnimatedCounter value={stats.companies} />
                  </div>
                  <div className="text-gray-800 dark:text-white font-semibold text-lg mb-2">AI-Powered Companies</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm">Generating strategic insights</div>
                </div>
                <div className="text-center p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl border border-white/30 dark:border-slate-700/30 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-3xl">⚡</span>
                  </div>
                  <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400 mb-3">
                    <AnimatedCounter value={stats.users} />
                  </div>
                  <div className="text-gray-800 dark:text-white font-semibold text-lg mb-2">Optimized Team Members</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm">Peak performance achieved</div>
                </div>
                <div className="text-center p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl border border-white/30 dark:border-slate-700/30 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-violet-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-3xl">📈</span>
                  </div>
                  <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-3">
                    <AnimatedCounter value={stats.statuses} />
                  </div>
                  <div className="text-gray-800 dark:text-white font-semibold text-lg mb-2">Data Points Analyzed</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm">Predictive patterns identified</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span>✨</span>
                <span>Features</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-[1.5] pb-2">
                Enterprise-Grade Intelligence 
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent pb-1">
                  Features
                </span>
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Advanced AI algorithms, predictive analytics, and enterprise integrations that transform 
                simple status updates into strategic business intelligence
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: '🧠',
                  title: 'AI-Powered Analytics',
                  description: 'Predictive insights that identify productivity patterns, burnout risks, and optimization opportunities before they impact your team',
                  gradient: 'from-blue-500 to-indigo-600',
                  badge: 'AI'
                },
                {
                  icon: '📈',
                  title: 'Strategic Intelligence',
                  description: 'Transform status data into actionable business intelligence with ROI tracking, performance correlation, and strategic recommendations',
                  gradient: 'from-emerald-500 to-teal-600',
                  badge: 'Premium'
                },
                {
                  icon: '⚡',
                  title: 'Smart Scheduling',
                  description: 'AI-optimized meeting times based on team energy levels, availability patterns, and productivity peaks for maximum efficiency',
                  gradient: 'from-purple-500 to-violet-600',
                  badge: 'AI'
                },
                {
                  icon: '🛡️',
                  title: 'Team Health Monitoring',
                  description: 'Advanced wellness tracking with engagement scoring, retention risk alerts, and proactive intervention recommendations',
                  gradient: 'from-rose-500 to-pink-600',
                  badge: 'Enterprise'
                },
                {
                  icon: '🔗',
                  title: 'Enterprise Integrations',
                  description: 'Seamless connectivity with Salesforce, Jira, Slack, and 50+ tools. Custom workflows and automated data synchronization',
                  gradient: 'from-amber-500 to-orange-600',
                  badge: 'Integration'
                },
                {
                  icon: '🔒',
                  title: 'Advanced Security',
                  description: 'Enterprise-grade security with audit trails, GDPR compliance, role-based access, and SOC 2 Type II certification',
                  gradient: 'from-cyan-500 to-blue-600',
                  badge: 'Security'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className="h-full text-center hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm group relative overflow-hidden">
                    {/* Premium gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 dark:from-slate-700/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="p-8 relative z-10">
                      {/* Feature badge */}
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 text-gray-700 dark:text-gray-300">
                        {feature.badge}
                      </div>
                      
                      <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                        <span className="text-3xl">{feature.icon}</span>
                      </div>
                      
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                      {feature.title}
                    </h4>
                      
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                      
                      {/* Learn more link */}
                      <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                          Learn more
                          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* Enhanced Demo Links */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50/50 dark:from-blue-900/20 via-transparent to-transparent" />
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-2xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-200/20 dark:bg-indigo-800/20 rounded-full blur-2xl" />
          
          <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span>🎯</span>
                <span>Try the Demo</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-[1.5] pb-2">
                Experience the 
                <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent pb-1">
                  Power
                </span>
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                See how Corporacity works in action. Try our interactive demos and discover the features that will transform your team management.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                <Link href="/employee">
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="group cursor-pointer"
                  >
                    <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm group-hover:bg-white dark:group-hover:bg-slate-800">
                      <div className="p-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                          <span className="text-2xl">👤</span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Employee Dashboard</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">Update status and view team updates</p>
                        <div className="inline-flex items-center space-x-2 text-green-600 dark:text-green-400 font-semibold text-sm group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                          <span>Try Demo</span>
                          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Link>
                
                <Link href="/analytics">
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="group cursor-pointer"
                  >
                    <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm group-hover:bg-white dark:group-hover:bg-slate-800">
                      <div className="p-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                          <span className="text-2xl">🧠</span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">AI Analytics</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">Predictive insights and strategic intelligence</p>
                        <div className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                          <span>Try Demo</span>
                          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Link>

                <Link href="/schedule">
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="group cursor-pointer"
                  >
                    <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm group-hover:bg-white dark:group-hover:bg-slate-800">
                      <div className="p-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                          <span className="text-2xl">⚡</span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Smart Schedule</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">AI-optimized meeting times</p>
                        <div className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-semibold text-sm group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                          <span>Try Demo</span>
                          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Link>
                
                <Link href="/ceo">
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="group cursor-pointer"
                  >
                    <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm group-hover:bg-white dark:group-hover:bg-slate-800">
                      <div className="p-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                          <span className="text-2xl">👑</span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">CEO Panel</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">Team management and approvals</p>
                        <div className="inline-flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-semibold text-sm group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                          <span>Try Demo</span>
                          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Testimonials Section */}
        <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-50/50 dark:from-purple-900/20 via-transparent to-transparent" />
          <div className="absolute top-20 right-20 w-32 h-32 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-2xl" />
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-pink-200/20 dark:bg-pink-800/20 rounded-full blur-2xl" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span>💬</span>
                <span>Testimonials</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-[1.5] pb-2">
                Trusted by Teams 
                <span className="block bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent pb-1">
                  Worldwide
                </span>
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                See what our users have to say about their experience with Corporacity
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Chen",
                  role: "CTO, TechStart Solutions",
                  content: "Corporacity has revolutionized how we manage our distributed teams. The AI insights have helped us identify productivity patterns we never knew existed. Game-changer!",
                  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150&q=80",
                  rating: 5,
                  company: "TechStart Solutions"
                },
                {
                  name: "Michael Rodriguez",
                  role: "Operations Manager, InnovateCorp",
                  content: "The predictive analytics feature is incredible. We can now anticipate team workload and prevent burnout before it happens. Our employee satisfaction has increased by 40%.",
                  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150&q=80",
                  rating: 5,
                  company: "InnovateCorp"
                },
                {
                  name: "Emily Johnson",
                  role: "Team Lead, FutureWorks Inc",
                  content: "Simple, intuitive, and powerful. Our team adopted it immediately and productivity has increased significantly since implementation. The ROI was evident within the first month.",
                  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150&q=80",
                  rating: 5,
                  company: "FutureWorks Inc"
                },
                {
                  name: "David Kim",
                  role: "VP of Engineering, CloudFirst Technologies",
                  content: "The AI-powered insights have transformed our team management approach. We can now predict and prevent issues before they impact productivity. Absolutely revolutionary!",
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150&q=80",
                  rating: 5,
                  company: "CloudFirst Technologies"
                },
                {
                  name: "Lisa Martinez",
                  role: "HR Director, DataDriven Systems",
                  content: "Corporacity has streamlined our entire workflow. The approval system is seamless, and the analytics help us understand team dynamics like never before. Essential tool!",
                  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150&q=80",
                  rating: 5,
                  company: "DataDriven Systems"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full text-center hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm group">
                    <div className="p-4 sm:p-6 lg:p-8">
                      {/* Rating Stars */}
                      <div className="flex justify-center mb-3 sm:mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-lg sm:text-xl">⭐</span>
                        ))}
                      </div>
                      
                      {/* Avatar */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 overflow-hidden border-4 border-white dark:border-slate-700">
                        <img 
                          src={testimonial.avatar} 
                          alt={`${testimonial.name} profile`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=6366f1&color=fff&size=150&bold=true`;
                          }}
                        />
                      </div>
                      
                      {/* Quote */}
                      <div className="relative mb-4 sm:mb-6">
                        <div className="text-2xl sm:text-3xl lg:text-4xl text-purple-200 absolute -top-1 sm:-top-2 -left-1 sm:-left-2">"</div>
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed relative z-10 italic px-2">
                          {testimonial.content}
                        </p>
                        <div className="text-2xl sm:text-3xl lg:text-4xl text-purple-200 absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2">"</div>
                      </div>
                      
                      {/* Author Info */}
                      <div className="border-t border-gray-100 dark:border-slate-700 pt-4 sm:pt-6">
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">{testimonial.name}</h4>
                        <p className="text-purple-600 dark:text-purple-400 font-semibold text-xs sm:text-sm mb-1">{testimonial.role}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{testimonial.company}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Preview Section */}
        <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-[1.4]">
                Enterprise-Grade Pricing
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Choose the perfect plan for your team. From AI-powered insights to enterprise integrations, 
                scale with confidence as your business grows.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Starter",
                  price: "Free",
                  description: "Perfect for small teams getting started",
                  features: [
                    "Up to 10 team members",
                    "Basic status updates",
                    "Real-time notifications",
                    "Mobile app access",
                    "Email support"
                  ],
                  cta: "Get Started Free",
                  popular: false
                },
                {
                  name: "Professional",
                  price: "$9",
                  period: "/month",
                  description: "Ideal for growing teams",
                  features: [
                    "Up to 50 team members",
                    "Advanced analytics",
                    "Custom company branding",
                    "Priority support",
                    "API access",
                    "Team scheduling"
                  ],
                  cta: "Start Free Trial",
                  popular: true
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  description: "For large organizations",
                  features: [
                    "Unlimited team members",
                    "Advanced security features",
                    "Custom integrations",
                    "Dedicated support",
                    "On-premise deployment",
                    "Custom reporting"
                  ],
                  cta: "Contact Sales",
                  popular: false
                }
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative ${plan.popular ? 'transform scale-105' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <Card className={`h-full dark:bg-slate-800/90 ${plan.popular ? 'border-blue-500 shadow-xl' : ''}`}>
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h4>
                      <div className="mb-2">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                        {plan.period && <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{plan.description}</p>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <span className="text-green-500 mr-3">✓</span>
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/create-company" className="w-full">
                      <Button
                        className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                        variant={plan.popular ? 'primary' : 'outline'}
                        size="large"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced FAQ Section */}
        <section id="faq" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 relative overflow-hidden scroll-mt-20">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-50/50 dark:from-blue-900/20 via-transparent to-transparent" />
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-2xl" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-200/20 dark:bg-cyan-800/20 rounded-full blur-2xl" />
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span>❓</span>
                <span>FAQ</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-[1.5] pb-2">
                Frequently Asked 
                <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent pb-1">
                  Questions
                </span>
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Everything you need to know about Corporacity
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  question: "How does Corporacity work?",
                  answer: "Corporacity is a team status management platform that allows team members to update their daily status (present, late, on leave, etc.) and enables managers to track team activity in real-time. It's designed to improve communication and productivity in both remote and office environments.",
                  icon: "⚙️"
                },
                {
                  question: "Is my data secure?",
                  answer: "Yes, absolutely. We use enterprise-grade security with Row Level Security (RLS), data encryption, and comply with industry standards. Your data is stored securely and only accessible to authorized team members.",
                  icon: "🔒"
                },
                {
                  question: "Can I use Corporacity for remote teams?",
                  answer: "Yes! Corporacity is perfect for remote teams. It provides real-time status updates, team activity feeds, and helps maintain connection and visibility across distributed teams.",
                  icon: "🌐"
                },
                {
                  question: "How do I invite team members?",
                  answer: "Team members can join by using your company code, or you can send them direct invitations. As a CEO/manager, you'll receive join requests that you can approve or deny from your dashboard.",
                  icon: "👥"
                },
                {
                  question: "Is there a mobile app?",
                  answer: "Yes! Corporacity is fully responsive and works great on mobile devices. You can access all features through your mobile browser, and we're working on dedicated mobile apps.",
                  icon: "📱"
                },
                {
                  question: "What's the difference between the free and paid plans?",
                  answer: "The free plan supports up to 10 team members with basic features. Paid plans offer more team members, advanced analytics, custom branding, priority support, and additional features like API access and team scheduling.",
                  icon: "💎"
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <Card className="hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm group">
                    <div className="p-8">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 flex-shrink-0">
                          <span className="text-xl">{faq.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {faq.question}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.3] drop-shadow-lg">
                Ready to Get Started?
              </h3>
              <p className="text-xl md:text-2xl text-white/95 mb-10 leading-relaxed font-medium drop-shadow-md">
                Join thousands of teams already using Corporacity to stay connected and productive
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <button
                  onClick={signInWithGoogle}
                  disabled={loading}
                  className="premium-button bg-white text-gray-900 hover:bg-gray-50 font-bold shadow-2xl border-0 px-6 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-3xl w-full sm:w-auto touch-target"
                >
                  {loading ? 'Signing in...' : '🚀 Start Free Trial'}
                </button>
                <Link href="/create-company" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="large"
                    className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold shadow-2xl bg-white/10 hover:bg-white hover:shadow-3xl px-6 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm w-full touch-target"
                  >
                    🏢 Create Company
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm p-1">
                  <img 
                    src="/logo.webp" 
                    alt="Corporacity Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Corporacity</h3>
                  <p className="text-sm text-gray-400">Team Status Management</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The simplest way to manage your team's daily status and boost productivity. 
                Real-time updates, seamless collaboration, and powerful insights.
              </p>
              <div className="flex space-x-4">
                <a href="https://twitter.com/corporacity" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="https://linkedin.com/company/corporacity" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://github.com/corporacity" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="/employee" className="text-gray-400 hover:text-white transition-colors">Employee Dashboard</a></li>
                <li><a href="/ceo" className="text-gray-400 hover:text-white transition-colors">CEO Dashboard</a></li>
                <li><a href="/analytics" className="text-gray-400 hover:text-white transition-colors">Analytics</a></li>
                <li><a href="/schedule" className="text-gray-400 hover:text-white transition-colors">Schedule</a></li>
                <li><a href="/integrations" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="/support" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 Corporacity. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="/terms-of-service" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
                <a href="/cookie-policy" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </Layout>
    </>
  )
}

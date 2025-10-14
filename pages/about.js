import React from 'react';
import Head from 'next/head';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - Corporacity</title>
        <meta name="description" content="Learn about Corporacity's mission to transform team management with AI-powered analytics and real-time status tracking." />
        <meta name="robots" content="index, follow" />
      </Head>
      
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-900/20 dark:to-purple-900/20"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-[1.4]">
                  About <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">Corporacity</span>
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                  Transforming team management through AI-powered insights and real-time collaboration
                </p>
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="py-16 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Mission
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                  We believe that every team deserves intelligent tools that help them work smarter, not harder. 
                  Our mission is to democratize advanced team management capabilities, making AI-powered insights 
                  accessible to organizations of all sizes.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="p-8 text-center hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Innovation</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We leverage cutting-edge AI and machine learning to provide insights that were previously 
                    only available to large enterprises.
                  </p>
                </Card>

                <Card className="p-8 text-center hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Collaboration</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We build tools that bring teams together, fostering transparency, communication, 
                    and collective success.
                  </p>
                </Card>

                <Card className="p-8 text-center hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Excellence</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We're committed to delivering exceptional user experiences and reliable, 
                    enterprise-grade solutions.
                  </p>
                </Card>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="py-16 sm:py-20 bg-white dark:bg-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    Our Story
                  </h2>
                  <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>
                      Corporacity was born from a simple observation: most team management tools are either 
                      too complex for small teams or too basic for growing organizations. We saw an opportunity 
                      to bridge this gap with intelligent, user-friendly solutions.
                    </p>
                    <p>
                      Founded in 2024, our team combines decades of experience in enterprise software, 
                      AI research, and user experience design. We've worked at companies like Google, 
                      Microsoft, and Salesforce, and we've seen firsthand what works and what doesn't.
                    </p>
                    <p>
                      Today, we're proud to serve thousands of teams worldwide, from startups to Fortune 500 
                      companies, helping them unlock their full potential through better team management.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                    <h3 className="text-2xl font-bold mb-4">Our Impact</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-3xl font-bold">10,000+</div>
                        <div className="text-blue-100">Teams Served</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold">50M+</div>
                        <div className="text-blue-100">Status Updates</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold">99.9%</div>
                        <div className="text-blue-100">Uptime</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold">4.9/5</div>
                        <div className="text-blue-100">User Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="py-16 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Values
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  These core values guide everything we do at Corporacity
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Security First</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Enterprise-grade security and privacy protection for all our users
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">User-Centric</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Every feature is designed with our users' needs and feedback in mind
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Innovation</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Constantly pushing boundaries with cutting-edge technology and AI
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Transparency</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Open communication and honest relationships with our users and team
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="py-16 sm:py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to Join Our Mission?
              </h2>
              <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
                Experience the future of team management with Corporacity
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <a
                  href="/create-company"
                  className="bg-white text-blue-600 hover:bg-gray-50 px-8 sm:px-12 py-4 sm:py-6 rounded-xl text-lg sm:text-xl font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto text-center"
                >
                  🚀 Start Free Trial
                </a>
                <a
                  href="/contact"
                  className="bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white/20 px-8 sm:px-12 py-4 sm:py-6 rounded-xl text-lg sm:text-xl font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto text-center"
                >
                  💬 Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

import React from 'react';
import Head from 'next/head';
import Layout from '../../components/ui/Layout';
import Card from '../../components/ui/Card';

export default function BlogPost6() {
  return (
    <>
      <Head>
        <title>Scaling Team Management: From Startup to Enterprise - Corporacity Blog</title>
        <meta name="description" content="Learn the essential strategies for scaling team management processes as your organization grows from startup to enterprise level." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Scaling Team Management: From Startup to Enterprise" />
        <meta property="og:description" content="Learn the essential strategies for scaling team management processes as your organization grows from startup to enterprise level." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Scaling Team Management: From Startup to Enterprise" />
        <meta name="twitter:description" content="Learn the essential strategies for scaling team management processes as your organization grows from startup to enterprise level." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop" />
      </Head>
      
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-pink-600/20 dark:from-orange-900/20 dark:to-pink-900/20"></div>
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
              <div className="text-center">
                <div className="mb-6">
                  <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-sm font-medium px-3 py-1 rounded-full">
                    Growth
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.4]">
                  Scaling Team Management: From Startup to Enterprise
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
                  Learn the essential strategies for scaling team management processes as your organization grows
                </p>
                <div className="flex items-center justify-center space-x-6 text-white/80">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      JS
                    </div>
                    <div>
                      <p className="text-sm font-medium">James Smith</p>
                      <p className="text-xs">Growth Strategy Expert</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p>January 3, 2024</p>
                    <p>10 min read</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="py-16 sm:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 sm:p-12">
                  
                  <div className="mb-8">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop" 
                      alt="Scaling team management"
                      className="w-full h-64 sm:h-80 object-cover rounded-xl mb-8"
                    />
                  </div>

                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                    Scaling team management is one of the most critical challenges organizations face as they grow. What works for a 10-person startup will inevitably break down as you reach 100, 500, or 1000+ employees. The key is understanding how to evolve your management practices at each stage of growth.
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    Having worked with dozens of companies through their scaling journey, I've identified the key inflection points and strategies that separate successful scaling organizations from those that struggle. The companies that thrive are those that proactively adapt their team management approaches rather than reactively fixing problems as they arise.
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">The Scaling Stages</h2>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Understanding the different stages of organizational growth is crucial for implementing the right team management strategies at the right time. Each stage presents unique challenges and opportunities.
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Startup (1-20 people)</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Focus on agility, direct communication, and building culture. Everyone knows everyone, and decisions happen quickly.
                      </p>
                    </Card>

                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Growth (20-100 people)</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Introduce structure, formal processes, and middle management. Balance agility with consistency and accountability.
                      </p>
                    </Card>

                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Enterprise (100+ people)</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Implement sophisticated systems, clear hierarchies, and standardized processes while maintaining innovation and culture.
                      </p>
                    </Card>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Key Scaling Challenges</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    As organizations scale, they face predictable challenges that can derail growth if not addressed proactively. Here are the most common issues and how to solve them:
                  </p>

                  <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Common Scaling Challenges</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Communication Breakdown</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          As teams grow, information silos develop and communication becomes fragmented. What used to be a quick hallway conversation now requires formal processes.
                        </p>
                        <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                          Solution: Implement structured communication channels, regular all-hands meetings, and transparent information sharing systems.
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Loss of Culture</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          The intimate, values-driven culture that defined your startup can erode as new people join and processes become more formal.
                        </p>
                        <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                          Solution: Codify your culture, invest in onboarding, and create rituals that reinforce your values at scale.
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Decision-Making Bottlenecks</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          What used to be quick decisions now require multiple approvals and can slow down execution significantly.
                        </p>
                        <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                          Solution: Delegate decision-making authority, create clear decision frameworks, and establish escalation processes.
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Scaling Strategies by Stage</h2>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Startup Stage (1-20 people)</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    At this stage, focus on building strong foundations that will support future growth:
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Hire for Culture Fit</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Every early hire significantly impacts your culture. Focus on finding people who share your values and can grow with the company.
                      </p>
                    </Card>

                    <Card className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Document Everything</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Start documenting processes, decisions, and learnings early. This knowledge will be invaluable as you scale and new people join.
                      </p>
                    </Card>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Growth Stage (20-100 people)</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    This is where most companies struggle. The key is introducing structure without losing agility:
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Introduce Middle Management</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Develop your first layer of managers from within. These people understand your culture and can help maintain it as you grow.
                      </p>
                    </Card>

                    <Card className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Implement Systems</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Invest in tools and systems that can scale with you. This includes HR systems, project management tools, and communication platforms.
                      </p>
                    </Card>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Enterprise Stage (100+ people)</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    At this stage, focus on maintaining culture while implementing sophisticated management systems:
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Develop Leadership Pipeline</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Create formal leadership development programs to ensure you have the management talent needed for continued growth.
                      </p>
                    </Card>

                    <Card className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Standardize Processes</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Implement standardized processes across all departments while maintaining flexibility for innovation and adaptation.
                      </p>
                    </Card>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Technology as a Scaling Enabler</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    The right technology stack can make or break your scaling efforts. Here's how to choose and implement tools that grow with you:
                  </p>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Technology Scaling Principles</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Start Simple, Scale Smart</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          Begin with tools that are easy to implement and use, but have clear upgrade paths as you grow.
                        </p>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Integration is Key</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Choose tools that integrate well with each other to avoid data silos and workflow fragmentation.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">User Adoption Matters</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          The best tool is useless if your team doesn't use it. Prioritize user experience and change management.
                        </p>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Data-Driven Decisions</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Implement tools that provide insights into team performance and help you make informed scaling decisions.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Measuring Scaling Success</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    How do you know if your scaling efforts are working? Here are the key metrics to track at each stage:
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Productivity Metrics</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Track output per employee, project completion rates, and time-to-market to ensure scaling doesn't hurt performance.
                      </p>
                    </Card>

                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Culture Metrics</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Monitor employee satisfaction, retention rates, and engagement scores to ensure culture scales with growth.
                      </p>
                    </Card>

                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Efficiency Metrics</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Measure decision-making speed, communication effectiveness, and process efficiency to identify scaling bottlenecks.
                      </p>
                    </Card>
                  </div>

                  <div className="bg-gradient-to-r from-orange-600 to-pink-600 rounded-xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Ready to Scale Your Team Management?</h3>
                    <p className="text-orange-100 mb-6">
                      Use Corporacity's scalable team management platform to grow from startup to enterprise while maintaining culture and performance.
                    </p>
                    <a
                      href="/create-company"
                      className="bg-white text-orange-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-block"
                    >
                      Start Your Free Trial
                    </a>
                  </div>

                  <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                          JS
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">James Smith</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Growth Strategy Expert at Corporacity</p>
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <a href="https://twitter.com/corporacity" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        </a>
                        <a href="https://linkedin.com/company/corporacity" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

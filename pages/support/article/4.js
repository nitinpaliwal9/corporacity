import React from 'react';
import Head from 'next/head';
import Layout from '../../../components/ui/Layout';
import Card from '../../../components/ui/Card';

export default function SupportArticle4() {
  return (
    <>
      <Head>
        <title>Understanding AI Analytics - Support Center</title>
        <meta name="description" content="Learn how to use Corporacity's AI-powered analytics to gain insights into your team's performance and productivity." />
        <meta name="robots" content="index, follow" />
      </Head>
      
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 dark:from-indigo-900/20 dark:to-cyan-900/20"></div>
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
              <div className="text-center">
                <div className="mb-6">
                  <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm font-medium px-3 py-1 rounded-full">
                    Features
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.4]">
                  Understanding AI Analytics
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
                  Learn how to use AI-powered analytics to gain insights into your team's performance and productivity
                </p>
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
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop" 
                      alt="AI Analytics dashboard"
                      className="w-full h-64 sm:h-80 object-cover rounded-xl mb-8"
                    />
                  </div>

                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                    Corporacity's AI Analytics feature transforms raw team data into actionable insights that help you make informed decisions about your team's productivity, collaboration patterns, and overall performance. This guide will help you understand and make the most of these powerful analytics.
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">What is AI Analytics?</h2>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    AI Analytics uses machine learning algorithms to analyze your team's behavior patterns, communication frequency, project progress, and productivity metrics. It then provides intelligent recommendations and insights to help optimize your team's performance.
                  </p>

                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Analytics Features</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Performance Insights</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                          <li>• Individual and team productivity trends</li>
                          <li>• Task completion patterns</li>
                          <li>• Time allocation analysis</li>
                          <li>• Goal achievement tracking</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Collaboration Analysis</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                          <li>• Communication frequency and patterns</li>
                          <li>• Cross-team collaboration metrics</li>
                          <li>• Knowledge sharing indicators</li>
                          <li>• Team cohesion measurements</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">How to Access Analytics</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Accessing your team's AI analytics is simple and can be done from multiple locations in the Corporacity platform.
                  </p>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <Card className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Dashboard Access</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Navigate to the Analytics section from your main dashboard. You'll see an overview of key metrics and insights.
                      </p>
                    </Card>

                    <Card className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Detailed Reports</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Access detailed analytics reports with customizable time periods, team segments, and specific metrics.
                      </p>
                    </Card>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Understanding the Metrics</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Here's what each key metric means and how to interpret the data:
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Productivity Score</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        A composite score based on task completion, time efficiency, and goal achievement. Higher scores indicate better productivity.
                      </p>
                    </Card>

                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Collaboration Index</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Measures how actively team members communicate, share knowledge, and work together on projects.
                      </p>
                    </Card>

                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Engagement Level</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Tracks how actively team members participate in status updates, meetings, and team activities.
                      </p>
                    </Card>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">AI Recommendations</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    One of the most powerful features of AI Analytics is the intelligent recommendations it provides based on your team's data patterns.
                  </p>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Types of Recommendations</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Workload Optimization</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Suggestions for redistributing tasks based on individual capacity, skills, and current workload.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Communication Improvements</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Recommendations for improving team communication patterns and reducing information silos.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Process Enhancements</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Suggestions for streamlining workflows and eliminating bottlenecks in your team's processes.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Team Development</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Recommendations for training, mentoring, or skill development opportunities for team members.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Best Practices</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    To get the most value from AI Analytics, follow these best practices:
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Regular Review</h3>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li>• Check analytics weekly for trends</li>
                        <li>• Review monthly reports with your team</li>
                        <li>• Set up automated alerts for key metrics</li>
                        <li>• Track progress on recommendations</li>
                      </ul>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Data Quality</h3>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li>• Ensure consistent status updates</li>
                        <li>• Encourage detailed project tracking</li>
                        <li>• Maintain accurate team information</li>
                        <li>• Use all available features</li>
                      </ul>
                    </Card>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Ready to Explore Analytics?</h3>
                    <p className="text-indigo-100 mb-6">
                      Start using AI Analytics today to gain deeper insights into your team's performance and unlock new levels of productivity.
                    </p>
                    <a
                      href="/analytics"
                      className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-block"
                    >
                      View Analytics
                    </a>
                  </div>

                  <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Was this article helpful?</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Let us know how we can improve this guide</p>
                      </div>
                      <div className="flex space-x-4">
                        <button className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          👍 Yes
                        </button>
                        <button className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          👎 No
                        </button>
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

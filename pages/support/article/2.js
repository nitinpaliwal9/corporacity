import React from 'react';
import Head from 'next/head';
import Layout from '../../../components/ui/Layout';
import Card from '../../../components/ui/Card';

export default function SupportArticle2() {
  return (
    <>
      <Head>
        <title>How to Update Your Team Status - Support Center</title>
        <meta name="description" content="Learn how to update your team status in Corporacity. Complete guide to status updates and team communication." />
        <meta name="robots" content="index, follow" />
      </Head>
      
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-teal-600/20 dark:from-green-900/20 dark:to-teal-900/20"></div>
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
              <div className="text-center">
                <div className="mb-6">
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-medium px-3 py-1 rounded-full">
                    Features
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.4]">
                  How to Update Your Team Status
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
                  Complete guide to updating your status and keeping your team informed about your progress
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
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop" 
                      alt="Team status updates"
                      className="w-full h-64 sm:h-80 object-cover rounded-xl mb-8"
                    />
                  </div>

                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                    Regular status updates are the foundation of effective team communication. This guide will show you how to update your status, what information to include, and how to make the most of this feature to keep your team aligned and productive.
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Understanding Status Updates</h2>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Status updates in Corporacity help your team understand what you're working on, what you've completed, and any challenges you're facing. They're essential for maintaining transparency and ensuring everyone stays on the same page.
                  </p>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Types of Status Updates</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Daily Updates</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                          <li>• What you accomplished today</li>
                          <li>• What you're planning to work on next</li>
                          <li>• Any blockers or challenges</li>
                          <li>• Questions or help needed</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Project Updates</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                          <li>• Progress on specific projects</li>
                          <li>• Milestone completions</li>
                          <li>• Timeline adjustments</li>
                          <li>• Resource requirements</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">How to Update Your Status</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Updating your status is simple and can be done in just a few clicks. Here's the step-by-step process:
                  </p>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <Card className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Step 1: Access Status Update</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Navigate to your dashboard and click the "Update Status" button. You can also use the quick update feature from the main navigation.
                      </p>
                    </Card>

                    <Card className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Step 2: Fill Out Information</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Complete the status form with your current work status, accomplishments, and any relevant notes for your team.
                      </p>
                    </Card>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Best Practices for Status Updates</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    To make your status updates most effective, follow these best practices:
                  </p>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Effective Status Update Guidelines</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Be Specific and Actionable</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Instead of "Working on project," say "Completed user authentication module and starting on payment integration."
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Include Context</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Help your team understand the bigger picture by explaining how your work fits into overall project goals.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Highlight Blockers Early</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Don't wait until you're stuck to mention challenges. Flag potential issues as soon as you see them.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Ask for Help When Needed</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Be specific about what kind of help you need and from whom. This makes it easier for others to assist you.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Status Update Templates</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Here are some templates to help you structure your status updates effectively:
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Update Template</h3>
                      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <p><strong>Yesterday:</strong> [What you completed]</p>
                        <p><strong>Today:</strong> [What you're working on]</p>
                        <p><strong>Blockers:</strong> [Any challenges or help needed]</p>
                        <p><strong>Notes:</strong> [Additional context or updates]</p>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Update Template</h3>
                      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <p><strong>Project:</strong> [Project name]</p>
                        <p><strong>Progress:</strong> [Percentage or milestone]</p>
                        <p><strong>Next Steps:</strong> [What's coming up]</p>
                        <p><strong>Timeline:</strong> [Expected completion]</p>
                      </div>
                    </Card>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Advanced Features</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Corporacity offers several advanced features to make status updates more effective:
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quick Updates</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Use pre-defined templates for common status types to save time while maintaining consistency.
                      </p>
                    </Card>

                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 5h6V3H4v2zM4 11h6V9H4v2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Smart Reminders</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Get intelligent reminders based on your work patterns and team expectations.
                      </p>
                    </Card>

                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Analytics Integration</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Your status updates feed into team analytics to provide insights and recommendations.
                      </p>
                    </Card>
                  </div>

                  <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Ready to Start Updating?</h3>
                    <p className="text-green-100 mb-6">
                      Start keeping your team informed with regular status updates. It's the key to better collaboration and project success.
                    </p>
                    <a
                      href="/employee"
                      className="bg-white text-green-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-block"
                    >
                      Go to Dashboard
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

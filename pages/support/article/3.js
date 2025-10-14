import React from 'react';
import Head from 'next/head';
import Layout from '../../../components/ui/Layout';
import Card from '../../../components/ui/Card';

export default function SupportArticle3() {
  return (
    <>
      <Head>
        <title>Setting Up Slack Integration - Support Center</title>
        <meta name="description" content="Learn how to integrate Corporacity with Slack for seamless team communication and status updates." />
        <meta name="robots" content="index, follow" />
      </Head>
      
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-rose-600/20 dark:from-purple-900/20 dark:to-rose-900/20"></div>
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
              <div className="text-center">
                <div className="mb-6">
                  <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm font-medium px-3 py-1 rounded-full">
                    Integrations
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.4]">
                  Setting Up Slack Integration
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
                  Connect Corporacity with Slack for seamless team communication and automated status updates
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
                      src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop" 
                      alt="Slack integration setup"
                      className="w-full h-64 sm:h-80 object-cover rounded-xl mb-8"
                    />
                  </div>

                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                    Integrating Corporacity with Slack brings your team management directly into your existing communication workflow. This guide will walk you through the setup process and show you how to make the most of this powerful integration.
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Benefits of Slack Integration</h2>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    The Slack integration offers several powerful features that enhance your team's productivity and communication:
                  </p>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <Card className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Automated Status Updates</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Status updates are automatically posted to designated Slack channels, keeping everyone informed without extra effort.
                      </p>
                    </Card>

                    <Card className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Slash Commands</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Use simple slash commands in Slack to update your status, check team progress, and access Corporacity features.
                      </p>
                    </Card>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Setup Process</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Setting up the Slack integration is straightforward and takes just a few minutes. Follow these steps:
                  </p>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Step-by-Step Setup</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                          <span className="text-white font-bold text-sm">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Access Integration Settings</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Go to your Corporacity dashboard and navigate to Settings > Integrations.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                          <span className="text-white font-bold text-sm">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Connect Slack Workspace</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Click "Connect Slack" and authorize Corporacity to access your Slack workspace.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                          <span className="text-white font-bold text-sm">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Configure Channels</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Select which Slack channels should receive status updates and notifications.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                          <span className="text-white font-bold text-sm">4</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Test Integration</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Send a test status update to verify everything is working correctly.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Available Features</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Once connected, you'll have access to several powerful features that enhance your team's Slack experience:
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Status Notifications</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Automatic notifications when team members update their status or complete important tasks.
                      </p>
                    </Card>

                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Slash Commands</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Use /corporacity commands to quickly update status, check team progress, and access features.
                      </p>
                    </Card>

                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Team Insights</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Get team performance summaries and insights delivered directly to your Slack channels.
                      </p>
                    </Card>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Slash Commands Reference</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Here are the available slash commands you can use in Slack:
                  </p>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Command List</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <code className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-sm font-mono mr-4 flex-shrink-0">/corporacity status</code>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Update your current status and share what you're working on.</p>
                      </div>
                      <div className="flex items-start">
                        <code className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-sm font-mono mr-4 flex-shrink-0">/corporacity team</code>
                        <p className="text-sm text-gray-600 dark:text-gray-300">View your team's current status and recent updates.</p>
                      </div>
                      <div className="flex items-start">
                        <code className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-sm font-mono mr-4 flex-shrink-0">/corporacity help</code>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Get help and see all available commands.</p>
                      </div>
                      <div className="flex items-start">
                        <code className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-sm font-mono mr-4 flex-shrink-0">/corporacity settings</code>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Access your Corporacity settings and preferences.</p>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Troubleshooting</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    If you encounter any issues with the Slack integration, here are some common solutions:
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Integration Not Working</h3>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li>• Verify Slack workspace permissions</li>
                        <li>• Check if Corporacity app is installed</li>
                        <li>• Ensure proper channel permissions</li>
                        <li>• Try disconnecting and reconnecting</li>
                      </ul>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Missing Notifications</h3>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li>• Check notification settings in Slack</li>
                        <li>• Verify channel selection in Corporacity</li>
                        <li>• Ensure team members have proper roles</li>
                        <li>• Test with a manual status update</li>
                      </ul>
                    </Card>
                  </div>

                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Ready to Connect Slack?</h3>
                    <p className="text-purple-100 mb-6">
                      Set up the Slack integration now and start enjoying seamless team communication and automated updates.
                    </p>
                    <a
                      href="/integrations"
                      className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-block"
                    >
                      Go to Integrations
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

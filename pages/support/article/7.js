import React from 'react';
import Head from 'next/head';
import Layout from '../../../components/ui/Layout';
import Card from '../../../components/ui/Card';

export default function SupportArticle7() {
  return (
    <>
      <Head>
        <title>API Documentation Overview - Support Center</title>
        <meta name="description" content="Complete guide to Corporacity's API for developers. Learn how to integrate with our platform programmatically." />
        <meta name="robots" content="index, follow" />
      </Head>
      
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-pink-600/20 dark:from-indigo-900/20 dark:to-pink-900/20"></div>
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
              <div className="text-center">
                <div className="mb-6">
                  <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm font-medium px-3 py-1 rounded-full">
                    API & Developers
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.4]">
                  API Documentation Overview
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
                  Complete guide to Corporacity's API for developers and technical integrations
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
                      src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop" 
                      alt="API documentation"
                      className="w-full h-64 sm:h-80 object-cover rounded-xl mb-8"
                    />
                  </div>

                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                    The Corporacity API provides powerful programmatic access to all platform features, allowing you to build custom integrations, automate workflows, and extend the platform's capabilities. This guide will help you get started with our RESTful API.
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Getting Started</h2>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Before you can start using the Corporacity API, you'll need to set up authentication and understand the basic structure of our API endpoints.
                  </p>

                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">API Basics</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Base URL</h4>
                        <code className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-sm font-mono">
                          https://api.corporacity.com/v1
                        </code>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                          All API requests should be made to this base URL with the appropriate endpoint appended.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Authentication</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Use API keys or OAuth 2.0 for authentication. Include your API key in the Authorization header.
                        </p>
                        <code className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-sm font-mono mt-2 block">
                          Authorization: Bearer YOUR_API_KEY
                        </code>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Authentication Methods</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Corporacity supports multiple authentication methods to suit different use cases:
                  </p>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <Card className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">API Keys</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                        Simple authentication method for server-to-server communication and automated scripts.
                      </p>
                      <div className="text-xs text-gray-500">
                        Best for: Automated tools, server applications, batch processing
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">OAuth 2.0</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                        Secure authentication for third-party applications that need user consent and access delegation.
                      </p>
                      <div className="text-xs text-gray-500">
                        Best for: Third-party apps, user-facing integrations, mobile apps
                      </div>
                    </Card>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Core API Endpoints</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Here are the main API endpoints you'll use to interact with Corporacity:
                  </p>

                  <div className="space-y-6 mb-8">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Users & Teams</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">GET /users</code>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">List all users in your organization</p>
                        </div>
                        <div>
                          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">GET /users/{id}</code>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Get specific user details</p>
                        </div>
                        <div>
                          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">POST /users</code>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Create a new user</p>
                        </div>
                        <div>
                          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">PUT /users/{id}</code>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Update user information</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Status Updates</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">GET /status</code>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Get team status updates</p>
                        </div>
                        <div>
                          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">POST /status</code>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Create a status update</p>
                        </div>
                        <div>
                          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">GET /status/{id}</code>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Get specific status update</p>
                        </div>
                        <div>
                          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">DELETE /status/{id}</code>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Delete a status update</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Analytics</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">GET /analytics/team</code>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Get team performance metrics</p>
                        </div>
                        <div>
                          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">GET /analytics/user/{id}</code>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Get individual user analytics</p>
                        </div>
                        <div>
                          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">GET /analytics/export</code>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Export analytics data</p>
                        </div>
                        <div>
                          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">GET /analytics/insights</code>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Get AI-generated insights</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Example API Calls</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Here are some practical examples of how to use the Corporacity API:
                  </p>

                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Get Team Status Updates</h3>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`curl -X GET "https://api.corporacity.com/v1/status" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                    </pre>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
                      This request retrieves all recent status updates from your team.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create a Status Update</h3>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`curl -X POST "https://api.corporacity.com/v1/status" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "Completed the quarterly report analysis",
    "status": "completed",
    "project": "Q4 Analysis",
    "tags": ["report", "analysis"]
  }'`}
                    </pre>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
                      This creates a new status update with project information and tags.
                    </p>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Rate Limits & Best Practices</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    To ensure fair usage and optimal performance, the Corporacity API implements rate limiting and best practices:
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Rate Limits</h3>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li>• 1000 requests per hour per API key</li>
                        <li>• 100 requests per minute per endpoint</li>
                        <li>• Burst limit: 20 requests per second</li>
                        <li>• Rate limit headers included in responses</li>
                      </ul>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Best Practices</h3>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li>• Implement exponential backoff for retries</li>
                        <li>• Cache responses when appropriate</li>
                        <li>• Use pagination for large datasets</li>
                        <li>• Monitor rate limit headers</li>
                      </ul>
                    </Card>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Webhooks</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Corporacity supports webhooks to notify your application of real-time events:
                  </p>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Webhook Events</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">User Events</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• user.created</li>
                          <li>• user.updated</li>
                          <li>• user.deleted</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Status Events</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• status.created</li>
                          <li>• status.updated</li>
                          <li>• status.deleted</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Ready to Start Building?</h3>
                    <p className="text-indigo-100 mb-6">
                      Get your API key and start integrating with Corporacity today. Check out our full API documentation for detailed examples and reference.
                    </p>
                    <a
                      href="/contact"
                      className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-block"
                    >
                      Get API Access
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

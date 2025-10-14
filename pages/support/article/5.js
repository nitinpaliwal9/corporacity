import React from 'react';
import Head from 'next/head';
import Layout from '../../../components/ui/Layout';
import Card from '../../../components/ui/Card';

export default function SupportArticle5() {
  return (
    <>
      <Head>
        <title>Managing User Permissions - Support Center</title>
        <meta name="description" content="Learn how to manage user permissions and roles in Corporacity to control access to features and data." />
        <meta name="robots" content="index, follow" />
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
                    Account & Billing
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.4]">
                  Managing User Permissions
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
                  Learn how to control access to features and data with comprehensive user permission management
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
                      src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop" 
                      alt="User permissions management"
                      className="w-full h-64 sm:h-80 object-cover rounded-xl mb-8"
                    />
                  </div>

                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                    Proper user permission management is essential for maintaining security and ensuring that team members have appropriate access to the features and data they need. This guide will help you understand and configure user permissions effectively.
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Understanding User Roles</h2>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Corporacity offers several predefined roles with different levels of access and permissions. Understanding these roles is the first step in effective permission management.
                  </p>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <Card className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Admin</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Full access to all features, user management, billing, and company settings. Can invite/remove users and modify all permissions.
                      </p>
                    </Card>

                    <Card className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Manager</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Can view team analytics, manage projects, and access most features. Cannot modify billing or company-wide settings.
                      </p>
                    </Card>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <Card className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Employee</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Standard team member with access to personal dashboard, status updates, and basic team features. Limited analytics access.
                      </p>
                    </Card>

                    <Card className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Viewer</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Read-only access to team information and basic analytics. Cannot modify data or access sensitive information.
                      </p>
                    </Card>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">How to Manage Permissions</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Managing user permissions is straightforward through the Corporacity admin interface. Here's how to do it:
                  </p>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Permission Management Steps</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                          <span className="text-white font-bold text-sm">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Access User Management</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Go to Settings &gt; Team Management to view all team members and their current roles.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                          <span className="text-white font-bold text-sm">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Select User</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Click on any team member to view their current permissions and role assignments.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                          <span className="text-white font-bold text-sm">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Modify Permissions</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Change the user's role or customize individual permissions as needed.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                          <span className="text-white font-bold text-sm">4</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Save Changes</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Confirm the changes and notify the user of any permission updates.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Custom Permission Sets</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    For more granular control, you can create custom permission sets that combine specific features and access levels.
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Analytics Access</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Control who can view team analytics, export reports, and access performance insights.
                      </p>
                    </Card>

                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Team Management</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Define who can invite new members, modify team settings, and manage user roles.
                      </p>
                    </Card>

                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Integration Control</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Manage who can set up integrations, modify API settings, and access external tool connections.
                      </p>
                    </Card>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Security Best Practices</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Follow these security best practices to ensure your team's data remains secure:
                  </p>

                  <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Guidelines</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Principle of Least Privilege</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Grant users only the minimum permissions they need to perform their job functions effectively.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Regular Permission Reviews</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Conduct quarterly reviews of user permissions to ensure they remain appropriate as roles evolve.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Immediate Access Revocation</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Remove or modify permissions immediately when team members change roles or leave the company.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Audit Trail</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Monitor permission changes and maintain logs of who made changes and when for security auditing.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-600 to-pink-600 rounded-xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Need Help with Permissions?</h3>
                    <p className="text-orange-100 mb-6">
                      Our support team can help you set up the perfect permission structure for your team's needs.
                    </p>
                    <a
                      href="/contact"
                      className="bg-white text-orange-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-block"
                    >
                      Contact Support
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

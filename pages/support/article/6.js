import React from 'react';
import Head from 'next/head';
import Layout from '../../../components/ui/Layout';
import Card from '../../../components/ui/Card';

export default function SupportArticle6() {
  return (
    <>
      <Head>
        <title>Troubleshooting Login Issues - Support Center</title>
        <meta name="description" content="Common login issues and solutions for Corporacity. Get help with authentication problems and account access." />
        <meta name="robots" content="index, follow" />
      </Head>
      
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-pink-600 to-purple-600 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-purple-600/20 dark:from-red-900/20 dark:to-purple-900/20"></div>
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
              <div className="text-center">
                <div className="mb-6">
                  <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm font-medium px-3 py-1 rounded-full">
                    Troubleshooting
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.4]">
                  Troubleshooting Login Issues
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
                  Common login issues and solutions to help you get back into your Corporacity account
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
                      alt="Login troubleshooting"
                      className="w-full h-64 sm:h-80 object-cover rounded-xl mb-8"
                    />
                  </div>

                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                    Having trouble logging into your Corporacity account? This comprehensive troubleshooting guide will help you resolve the most common login issues and get you back to managing your team effectively.
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Common Login Issues</h2>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Here are the most frequently encountered login problems and their solutions:
                  </p>

                  <div className="space-y-6 mb-8">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">"Invalid Email or Password" Error</h3>
                      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <p><strong>Possible Causes:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Typo in email address or password</li>
                          <li>Password was changed recently</li>
                          <li>Account was created with a different email</li>
                          <li>Caps Lock is enabled</li>
                        </ul>
                        <p><strong>Solutions:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Double-check your email address and password</li>
                          <li>Try using the "Forgot Password" feature</li>
                          <li>Check if you're using the correct email address</li>
                          <li>Ensure Caps Lock is disabled</li>
                        </ul>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Google Sign-In Not Working</h3>
                      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <p><strong>Possible Causes:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Browser pop-up blockers</li>
                          <li>Third-party cookies disabled</li>
                          <li>Multiple Google accounts signed in</li>
                          <li>Browser cache issues</li>
                        </ul>
                        <p><strong>Solutions:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Allow pop-ups for Corporacity</li>
                          <li>Enable third-party cookies</li>
                          <li>Sign out of other Google accounts</li>
                          <li>Clear browser cache and cookies</li>
                        </ul>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Account Locked or Suspended</h3>
                      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <p><strong>Possible Causes:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Multiple failed login attempts</li>
                          <li>Security policy violations</li>
                          <li>Account inactivity</li>
                          <li>Administrative action</li>
                        </ul>
                        <p><strong>Solutions:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Wait 15 minutes and try again</li>
                          <li>Contact your team administrator</li>
                          <li>Use the account recovery process</li>
                          <li>Contact support for assistance</li>
                        </ul>
                      </div>
                    </Card>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Step-by-Step Troubleshooting</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Follow these steps in order to resolve your login issues:
                  </p>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Troubleshooting Checklist</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                          <span className="text-white font-bold text-sm">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Verify Your Credentials</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Double-check your email address and password. Make sure there are no extra spaces or typos.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                          <span className="text-white font-bold text-sm">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Try Password Reset</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Use the "Forgot Password" link to reset your password if you're unsure about the current one.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                          <span className="text-white font-bold text-sm">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Clear Browser Data</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Clear your browser's cache, cookies, and stored data for Corporacity.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                          <span className="text-white font-bold text-sm">4</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Try Different Browser</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Test logging in with a different browser or incognito/private mode.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                          <span className="text-white font-bold text-sm">5</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Check Network Connection</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Ensure you have a stable internet connection and try disabling VPN if you're using one.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Browser-Specific Solutions</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Different browsers may have specific issues. Here are solutions for the most common browsers:
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Chrome</h3>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li>• Clear browsing data: Settings &gt; Privacy &gt; Clear browsing data</li>
                        <li>• Disable extensions temporarily</li>
                        <li>• Check if JavaScript is enabled</li>
                        <li>• Update to the latest version</li>
                      </ul>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Firefox</h3>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li>• Clear cookies and site data</li>
                        <li>• Disable tracking protection temporarily</li>
                        <li>• Check pop-up blocker settings</li>
                        <li>• Reset Firefox to default settings</li>
                      </ul>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Safari</h3>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li>• Clear website data: Safari &gt; Preferences &gt; Privacy</li>
                        <li>• Disable content blockers</li>
                        <li>• Allow pop-ups for Corporacity</li>
                        <li>• Update Safari to latest version</li>
                      </ul>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Edge</h3>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li>• Clear browsing data: Settings &gt; Privacy &gt; Clear browsing data</li>
                        <li>• Disable tracking prevention</li>
                        <li>• Check pop-up blocker settings</li>
                        <li>• Update Edge to latest version</li>
                      </ul>
                    </Card>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">When to Contact Support</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    If you've tried all the troubleshooting steps above and still can't log in, it's time to contact our support team. Here's what information to include:
                  </p>

                  <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Information to Include</h3>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                      <li>• Your email address associated with the account</li>
                      <li>• The exact error message you're seeing</li>
                      <li>• Browser name and version</li>
                      <li>• Operating system (Windows, Mac, etc.)</li>
                      <li>• Steps you've already tried</li>
                      <li>• Screenshots of any error messages</li>
                      <li>• Time and date when the issue started</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-red-600 to-purple-600 rounded-xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Still Having Issues?</h3>
                    <p className="text-red-100 mb-6">
                      Our support team is here to help you get back into your account quickly and securely.
                    </p>
                    <a
                      href="/contact"
                      className="bg-white text-red-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-block"
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

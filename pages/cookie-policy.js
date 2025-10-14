import React from 'react';
import Head from 'next/head';
import Layout from '../components/ui/Layout';

export default function CookiePolicy() {
  return (
    <>
      <Head>
        <title>Cookie Policy - Corporacity</title>
        <meta name="description" content="Learn about how Corporacity uses cookies and similar technologies to enhance your experience." />
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
                  Cookie <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">Policy</span>
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                  Learn about how we use cookies to improve your experience
                </p>
                <p className="text-sm text-white/70 mt-4">
                  Last updated: January 15, 2024
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="py-16 sm:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 sm:p-12">
                  
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">1. What Are Cookies?</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Cookies are small text files that are stored on your device when you visit our website. 
                    They help us provide you with a better experience by remembering your preferences and 
                    enabling certain functionality. Cookies can be "session" cookies (temporary) or "persistent" 
                    cookies (stored for a longer period).
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">2. How We Use Cookies</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    We use cookies and similar technologies for several purposes to enhance your experience 
                    with our Service and to help us understand how our Service is being used.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">3. Types of Cookies We Use</h2>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3.1 Essential Cookies</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    These cookies are necessary for the Service to function properly. They enable basic functions 
                    like page navigation, access to secure areas, and authentication. The Service cannot function 
                    properly without these cookies.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                    <li>Authentication and session management</li>
                    <li>Security and fraud prevention</li>
                    <li>Load balancing and performance</li>
                    <li>User interface preferences</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3.2 Functional Cookies</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    These cookies enable enhanced functionality and personalization. They remember choices you 
                    make and provide improved features.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                    <li>Language and region preferences</li>
                    <li>Theme and display settings</li>
                    <li>Customized dashboard layouts</li>
                    <li>Notification preferences</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3.3 Analytics Cookies</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    These cookies help us understand how visitors interact with our Service by collecting and 
                    reporting information anonymously.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                    <li>Page views and user journeys</li>
                    <li>Feature usage and engagement</li>
                    <li>Performance monitoring</li>
                    <li>Error tracking and debugging</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3.4 Marketing Cookies</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    These cookies are used to track visitors across websites to display relevant and engaging 
                    advertisements. They may be set by us or by third-party advertising partners.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                    <li>Ad targeting and personalization</li>
                    <li>Campaign performance measurement</li>
                    <li>Cross-site tracking</li>
                    <li>Social media integration</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">4. Third-Party Cookies</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    We may use third-party services that set their own cookies. These include:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                    <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                    <li><strong>Intercom:</strong> For customer support and chat functionality</li>
                    <li><strong>Stripe:</strong> For payment processing and billing</li>
                    <li><strong>Mixpanel:</strong> For product analytics and user behavior tracking</li>
                    <li><strong>Hotjar:</strong> For user experience research and heatmaps</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">5. Cookie Duration</h2>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-slate-700">
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Cookie Type</th>
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Duration</th>
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Purpose</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Session Cookies</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Until browser closes</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Essential functionality</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Authentication</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">30 days</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">User login status</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Preferences</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">1 year</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">User settings</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Analytics</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">2 years</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Usage tracking</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">6. Managing Your Cookie Preferences</h2>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">6.1 Browser Settings</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    You can control and manage cookies through your browser settings. Most browsers allow you to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                    <li>View and delete cookies</li>
                    <li>Block cookies from specific websites</li>
                    <li>Block third-party cookies</li>
                    <li>Clear all cookies when you close your browser</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">6.2 Cookie Consent</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    When you first visit our website, you'll see a cookie consent banner. You can choose to 
                    accept all cookies, reject non-essential cookies, or customize your preferences. You can 
                    change your preferences at any time by clicking the cookie settings link in our footer.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">7. Impact of Disabling Cookies</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    If you choose to disable cookies, some features of our Service may not function properly:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                    <li>You may need to log in repeatedly</li>
                    <li>Your preferences may not be saved</li>
                    <li>Some features may be unavailable</li>
                    <li>Performance may be affected</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">8. Updates to This Policy</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    We may update this Cookie Policy from time to time to reflect changes in our practices 
                    or for other operational, legal, or regulatory reasons. We will notify you of any material 
                    changes by posting the updated policy on our website and updating the "Last updated" date.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">9. Contact Us</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    If you have any questions about our use of cookies or this Cookie Policy, please contact us:
                  </p>
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      <strong>Email:</strong> privacy@corporacity.com
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      <strong>Address:</strong> 123 Innovation Drive, San Francisco, CA 94105
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Phone:</strong> +1 (555) 123-4567
                    </p>
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

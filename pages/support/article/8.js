import React from 'react';
import Head from 'next/head';
import Layout from '../../../components/ui/Layout';
import Card from '../../../components/ui/Card';

export default function SupportArticle8() {
  return (
    <>
      <Head>
        <title>Billing and Subscription Management - Support Center</title>
        <meta name="description" content="Learn how to manage your Corporacity billing, subscription, and payment information. Complete guide to account billing." />
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
                    Account & Billing
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.4]">
                  Billing and Subscription Management
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
                  Complete guide to managing your Corporacity billing, subscription, and payment information
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
                      src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop" 
                      alt="Billing and subscription management"
                      className="w-full h-64 sm:h-80 object-cover rounded-xl mb-8"
                    />
                  </div>

                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                    Managing your Corporacity subscription and billing is straightforward with our comprehensive billing dashboard. This guide will help you understand your subscription options, manage payments, and handle billing-related tasks efficiently.
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Subscription Plans</h2>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Corporacity offers flexible subscription plans to meet the needs of teams of all sizes. Here's an overview of our available plans:
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6 text-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Starter</h3>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Free</div>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                        <li>• Up to 5 team members</li>
                        <li>• Basic status updates</li>
                        <li>• Standard analytics</li>
                        <li>• Email support</li>
                      </ul>
                      <div className="text-xs text-gray-500">Perfect for small teams getting started</div>
                    </Card>

                    <Card className="p-6 text-center border-2 border-blue-500">
                      <div className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">Most Popular</div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Professional</h3>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">$12<span className="text-lg text-gray-500">/user/month</span></div>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                        <li>• Up to 50 team members</li>
                        <li>• Advanced analytics</li>
                        <li>• AI-powered insights</li>
                        <li>• Priority support</li>
                        <li>• Custom integrations</li>
                      </ul>
                      <div className="text-xs text-gray-500">Ideal for growing teams</div>
                    </Card>

                    <Card className="p-6 text-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Enterprise</h3>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Custom</div>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                        <li>• Unlimited team members</li>
                        <li>• Advanced security</li>
                        <li>• Custom features</li>
                        <li>• Dedicated support</li>
                        <li>• On-premise deployment</li>
                      </ul>
                      <div className="text-xs text-gray-500">For large organizations</div>
                    </Card>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Managing Your Subscription</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    You can manage your subscription settings directly from your Corporacity dashboard. Here's how to access and modify your billing information:
                  </p>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Accessing Billing Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                          <span className="text-white font-bold text-sm">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Navigate to Settings</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Go to your dashboard and click on Settings in the navigation menu.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                          <span className="text-white font-bold text-sm">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Select Billing</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Click on the "Billing & Subscription" tab to access your billing dashboard.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                          <span className="text-white font-bold text-sm">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Manage Your Plan</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">View your current plan, usage, and make changes as needed.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Payment Methods</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Corporacity accepts various payment methods for your convenience. You can manage your payment information securely through our billing dashboard.
                  </p>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <Card className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Credit/Debit Cards</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                        We accept all major credit and debit cards including Visa, Mastercard, American Express, and Discover.
                      </p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>• Secure payment processing</li>
                        <li>• Automatic recurring billing</li>
                        <li>• Instant payment confirmation</li>
                      </ul>
                    </Card>

                    <Card className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Bank Transfer</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                        For Enterprise customers, we offer bank transfer payment options with net payment terms.
                      </p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>• Available for Enterprise plans</li>
                        <li>• Net 30 payment terms</li>
                        <li>• Invoice-based billing</li>
                      </ul>
                    </Card>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Billing Operations</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Here are the common billing operations you can perform through your Corporacity account:
                  </p>

                  <div className="space-y-6 mb-8">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Upgrading Your Plan</h3>
                      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <p>To upgrade your subscription plan:</p>
                        <ol className="list-decimal list-inside ml-4 space-y-1">
                          <li>Go to Settings > Billing & Subscription</li>
                          <li>Click "Upgrade Plan" next to your current plan</li>
                          <li>Select your new plan and confirm the changes</li>
                          <li>Your new plan will be effective immediately</li>
                        </ol>
                        <p className="text-xs text-gray-500 mt-2">Note: You'll be charged the prorated amount for the remaining billing period.</p>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Downgrading Your Plan</h3>
                      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <p>To downgrade your subscription plan:</p>
                        <ol className="list-decimal list-inside ml-4 space-y-1">
                          <li>Go to Settings > Billing & Subscription</li>
                          <li>Click "Change Plan" and select a lower tier</li>
                          <li>Confirm the downgrade</li>
                          <li>Changes take effect at your next billing cycle</li>
                        </ol>
                        <p className="text-xs text-gray-500 mt-2">Note: Downgrades are effective at the next billing cycle to avoid service interruption.</p>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Canceling Your Subscription</h3>
                      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <p>To cancel your subscription:</p>
                        <ol className="list-decimal list-inside ml-4 space-y-1">
                          <li>Go to Settings > Billing & Subscription</li>
                          <li>Click "Cancel Subscription"</li>
                          <li>Follow the cancellation process</li>
                          <li>Your account will remain active until the end of the billing period</li>
                        </ol>
                        <p className="text-xs text-gray-500 mt-2">Note: You can reactivate your subscription at any time before the end of the billing period.</p>
                      </div>
                    </Card>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Billing Invoices</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    All billing invoices are automatically generated and can be accessed through your billing dashboard:
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Accessing Invoices</h3>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li>• View all invoices in your billing dashboard</li>
                        <li>• Download PDF copies for your records</li>
                        <li>• Email invoices to your accounting team</li>
                        <li>• Set up automatic invoice delivery</li>
                      </ul>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Invoice Details</h3>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li>• Detailed breakdown of charges</li>
                        <li>• Usage metrics and overages</li>
                        <li>• Tax information (where applicable)</li>
                        <li>• Payment method and transaction ID</li>
                      </ul>
                    </Card>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Billing Support</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    If you have questions about your billing or need assistance with payment issues, our support team is here to help:
                  </p>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Billing Support Options</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Contact Methods</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                          <li>• Email: billing@corporacity.com</li>
                          <li>• Live chat support</li>
                          <li>• Phone support for Enterprise</li>
                          <li>• Help center documentation</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Common Issues</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                          <li>• Payment method updates</li>
                          <li>• Billing cycle changes</li>
                          <li>• Invoice disputes</li>
                          <li>• Refund requests</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Need Billing Help?</h3>
                    <p className="text-green-100 mb-6">
                      Our billing support team is available to help you with any subscription or payment questions.
                    </p>
                    <a
                      href="/contact"
                      className="bg-white text-green-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-block"
                    >
                      Contact Billing Support
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

import React from 'react';
import Head from 'next/head';
import Layout from '../components/ui/Layout';

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service - Corporacity</title>
        <meta name="description" content="Read Corporacity's Terms of Service to understand your rights and responsibilities when using our platform." />
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
                  Terms of <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">Service</span>
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                  Please read these terms carefully before using our service
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
                  
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">1. Acceptance of Terms</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    By accessing and using Corporacity ("the Service"), you accept and agree to be bound by the 
                    terms and provision of this agreement. If you do not agree to abide by the above, please 
                    do not use this service.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">2. Description of Service</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Corporacity provides a team management platform that includes status tracking, AI-powered 
                    analytics, scheduling tools, and collaboration features. The Service is provided on a 
                    subscription basis with various pricing tiers and features.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">3. User Accounts</h2>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3.1 Account Creation</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    To use the Service, you must create an account by providing accurate and complete information. 
                    You are responsible for maintaining the confidentiality of your account credentials.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3.2 Account Responsibilities</h3>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                    <li>You are responsible for all activities that occur under your account</li>
                    <li>You must notify us immediately of any unauthorized use of your account</li>
                    <li>You must provide accurate and up-to-date information</li>
                    <li>You may not share your account credentials with others</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">4. Acceptable Use</h2>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">4.1 Permitted Uses</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    You may use the Service for lawful business purposes only. You agree to use the Service 
                    in accordance with all applicable laws and regulations.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">4.2 Prohibited Uses</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    You agree not to use the Service to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Transmit or store malicious code or harmful content</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Interfere with or disrupt the Service</li>
                    <li>Use the Service for any illegal or unauthorized purpose</li>
                    <li>Harass, abuse, or harm other users</li>
                    <li>Violate intellectual property rights</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">5. Subscription and Payment</h2>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">5.1 Subscription Plans</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    The Service is offered on a subscription basis with different pricing tiers. 
                    Current pricing and features are available on our website and may be updated from time to time.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">5.2 Payment Terms</h3>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                    <li>Subscription fees are billed in advance on a monthly or annual basis</li>
                    <li>All fees are non-refundable except as required by law</li>
                    <li>You are responsible for all applicable taxes</li>
                    <li>We may change our pricing with 30 days' notice</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">6. Intellectual Property</h2>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">6.1 Our Rights</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    The Service and its original content, features, and functionality are owned by Corporacity 
                    and are protected by international copyright, trademark, patent, trade secret, and other 
                    intellectual property laws.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">6.2 Your Content</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    You retain ownership of any content you upload or create using the Service. By using the 
                    Service, you grant us a limited license to use, store, and process your content as necessary 
                    to provide the Service.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">7. Privacy and Data Protection</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Your privacy is important to us. Our collection and use of personal information is governed 
                    by our Privacy Policy, which is incorporated into these Terms by reference. By using the 
                    Service, you consent to the collection and use of information as described in our Privacy Policy.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">8. Service Availability</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    We strive to maintain high service availability but do not guarantee uninterrupted access. 
                    The Service may be temporarily unavailable due to maintenance, updates, or circumstances 
                    beyond our control. We will make reasonable efforts to provide advance notice of planned downtime.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">9. Termination</h2>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">9.1 Termination by You</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    You may terminate your account at any time by contacting our support team. 
                    Termination will be effective at the end of your current billing period.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">9.2 Termination by Us</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    We may terminate or suspend your account immediately, without prior notice, for conduct 
                    that we believe violates these Terms or is harmful to other users, us, or third parties.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">10. Disclaimers and Limitations</h2>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">10.1 Service Disclaimer</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                    EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, 
                    FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">10.2 Limitation of Liability</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, CORPORACITY SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                    INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, 
                    LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">11. Indemnification</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    You agree to defend, indemnify, and hold harmless Corporacity and its officers, directors, 
                    employees, and agents from and against any claims, damages, obligations, losses, liabilities, 
                    costs, or debt, and expenses (including attorney's fees) arising from your use of the Service 
                    or violation of these Terms.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">12. Governing Law</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    These Terms shall be governed by and construed in accordance with the laws of the State of 
                    California, without regard to its conflict of law provisions. Any disputes arising from 
                    these Terms or your use of the Service shall be subject to the exclusive jurisdiction of 
                    the courts in San Francisco, California.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">13. Changes to Terms</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    We reserve the right to modify these Terms at any time. We will notify users of any 
                    material changes by email or through the Service. Your continued use of the Service 
                    after such modifications constitutes acceptance of the updated Terms.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">14. Contact Information</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      <strong>Email:</strong> legal@corporacity.com
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

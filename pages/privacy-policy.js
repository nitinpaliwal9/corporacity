import React from 'react';
import Head from 'next/head';
import Layout from '../components/ui/Layout';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Corporacity</title>
        <meta name="description" content="Learn how Corporacity collects, uses, and protects your personal information and data." />
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
                  Privacy <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">Policy</span>
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                  Your privacy is important to us. Learn how we protect your data.
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
                  
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">1. Introduction</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Welcome to Corporacity ("we," "our," or "us"). This Privacy Policy explains how we collect, 
                    use, disclose, and safeguard your information when you use our team management platform 
                    and related services (collectively, the "Service").
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    By using our Service, you agree to the collection and use of information in accordance 
                    with this Privacy Policy. If you do not agree with the terms of this Privacy Policy, 
                    please do not access the Service.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">2. Information We Collect</h2>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2.1 Personal Information</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    We may collect personal information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                    <li>Name and contact information (email address, phone number)</li>
                    <li>Company information and job title</li>
                    <li>Profile information and preferences</li>
                    <li>Team status updates and work-related communications</li>
                    <li>Payment and billing information</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2.2 Usage Information</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    We automatically collect certain information about your use of the Service, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage patterns and feature interactions</li>
                    <li>Log data and analytics information</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">3. How We Use Your Information</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                    <li>Provide, maintain, and improve our Service</li>
                    <li>Process transactions and send related information</li>
                    <li>Send technical notices, updates, and support messages</li>
                    <li>Respond to your comments and questions</li>
                    <li>Generate AI-powered insights and analytics</li>
                    <li>Ensure security and prevent fraud</li>
                    <li>Comply with legal obligations</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">4. Information Sharing and Disclosure</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    We do not sell, trade, or otherwise transfer your personal information to third parties, 
                    except in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                    <li>With your explicit consent</li>
                    <li>To service providers who assist us in operating our Service</li>
                    <li>To comply with legal obligations or court orders</li>
                    <li>To protect our rights, property, or safety</li>
                    <li>In connection with a business transfer or acquisition</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">5. Data Security</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    We implement appropriate technical and organizational security measures to protect your 
                    personal information against unauthorized access, alteration, disclosure, or destruction. 
                    This includes encryption, secure servers, and regular security audits.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">6. Data Retention</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    We retain your personal information for as long as necessary to provide our Service 
                    and fulfill the purposes outlined in this Privacy Policy, unless a longer retention 
                    period is required or permitted by law.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">7. Your Rights and Choices</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Depending on your location, you may have certain rights regarding your personal information, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                    <li>The right to access and update your information</li>
                    <li>The right to delete your account and data</li>
                    <li>The right to restrict or object to certain processing</li>
                    <li>The right to data portability</li>
                    <li>The right to withdraw consent</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">8. Cookies and Tracking Technologies</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    We use cookies and similar tracking technologies to enhance your experience, analyze usage, 
                    and provide personalized content. You can control cookie settings through your browser preferences.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">9. International Data Transfers</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Your information may be transferred to and processed in countries other than your own. 
                    We ensure appropriate safeguards are in place to protect your information in accordance 
                    with applicable data protection laws.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">10. Children's Privacy</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Our Service is not intended for children under 13 years of age. We do not knowingly 
                    collect personal information from children under 13. If you are a parent or guardian 
                    and believe your child has provided us with personal information, please contact us.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">11. Changes to This Privacy Policy</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of any changes 
                    by posting the new Privacy Policy on this page and updating the "Last updated" date. 
                    Your continued use of the Service after any modifications constitutes acceptance of the updated Privacy Policy.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">12. Contact Us</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    If you have any questions about this Privacy Policy or our privacy practices, please contact us:
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

import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useToast, ToastContainer } from '../components/ui/Toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const { toasts, success, removeToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    success('Thank you for your message! We\'ll get back to you soon.');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Head>
        <title>Contact Us - Corporacity</title>
        <meta name="description" content="Get in touch with our team. We're here to help you transform your team management with AI-powered insights." />
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
                  Get in <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">Touch</span>
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                  We're here to help you transform your team management
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form & Info */}
          <div className="py-16 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Send us a message</h2>
                  <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Company
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                          placeholder="Your company name"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Subject *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="sales">Sales Question</option>
                          <option value="support">Technical Support</option>
                          <option value="partnership">Partnership</option>
                          <option value="media">Media Inquiry</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                          placeholder="Tell us how we can help you..."
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        Send Message
                      </Button>
                    </form>
                  </Card>
                </div>

                {/* Contact Information */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Contact Information</h2>
                  
                  <div className="space-y-8">
                    <Card className="p-6">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-1">General inquiries</p>
                          <a href="mailto:hello@corporacity.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                            hello@corporacity.com
                          </a>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                          <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Phone</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-1">Mon-Fri 9AM-6PM PST</p>
                          <a href="tel:+1-555-123-4567" className="text-blue-600 dark:text-blue-400 hover:underline">
                            +1 (555) 123-4567
                          </a>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
                          <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Office</h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            123 Innovation Drive<br />
                            San Francisco, CA 94105<br />
                            United States
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-4">
                          <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Response Time</h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            We typically respond within 24 hours during business days. 
                            For urgent matters, please call us directly.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="py-16 sm:py-20 bg-white dark:bg-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Quick answers to common questions about our platform
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    How quickly can I get started?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    You can create your account and start using Corporacity in under 5 minutes. 
                    Our onboarding process is designed to get you up and running quickly.
                  </p>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Do you offer custom integrations?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Yes! We offer custom integrations with popular tools like Slack, Microsoft Teams, 
                    and many others. Contact our sales team to discuss your specific needs.
                  </p>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    What kind of support do you provide?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We provide 24/7 email support, comprehensive documentation, video tutorials, 
                    and priority support for enterprise customers.
                  </p>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Is my data secure?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Absolutely. We use enterprise-grade security with end-to-end encryption, 
                    SOC 2 compliance, and regular security audits to protect your data.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
        
        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </Layout>
    </>
  );
}

import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Support() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: '📚' },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'account', name: 'Account & Billing', icon: '💳' },
    { id: 'features', name: 'Features', icon: '⚡' },
    { id: 'integrations', name: 'Integrations', icon: '🔗' },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: '🔧' },
    { id: 'api', name: 'API & Developers', icon: '👨‍💻' }
  ];

  const articles = [
    {
      id: 1,
      title: "Getting Started with Corporacity",
      category: "getting-started",
      description: "Learn how to set up your account, create your first company, and invite team members.",
      readTime: "5 min read",
      popular: true
    },
    {
      id: 2,
      title: "How to Update Your Team Status",
      category: "features",
      description: "Step-by-step guide on how to update your daily status and keep your team informed.",
      readTime: "3 min read",
      popular: true
    },
    {
      id: 3,
      title: "Setting Up Slack Integration",
      category: "integrations",
      description: "Connect Corporacity with Slack to receive status updates directly in your workspace.",
      readTime: "7 min read",
      popular: false
    },
    {
      id: 4,
      title: "Understanding AI Analytics",
      category: "features",
      description: "Learn how to interpret and use AI-powered insights to improve team productivity.",
      readTime: "8 min read",
      popular: true
    },
    {
      id: 5,
      title: "Managing User Permissions",
      category: "account",
      description: "Configure roles and permissions for different team members and departments.",
      readTime: "6 min read",
      popular: false
    },
    {
      id: 6,
      title: "Troubleshooting Login Issues",
      category: "troubleshooting",
      description: "Common solutions for login problems and account access issues.",
      readTime: "4 min read",
      popular: false
    },
    {
      id: 7,
      title: "API Documentation Overview",
      category: "api",
      description: "Introduction to our REST API and how to authenticate your requests.",
      readTime: "10 min read",
      popular: false
    },
    {
      id: 8,
      title: "Billing and Subscription Management",
      category: "account",
      description: "How to manage your subscription, update payment methods, and view invoices.",
      readTime: "5 min read",
      popular: false
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Head>
        <title>Support Center - Corporacity</title>
        <meta name="description" content="Get help with Corporacity. Find answers to common questions, tutorials, and contact our support team." />
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
                  Support <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">Center</span>
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
                  Find answers, get help, and make the most of Corporacity
                </p>
                
                {/* Search Bar */}
                <div className="max-w-2xl mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for help articles, tutorials, or FAQs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-6 py-4 pl-12 pr-4 text-lg rounded-xl border-0 focus:ring-2 focus:ring-white/50 focus:outline-none"
                    />
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Help Section */}
          <div className="py-16 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Quick Help
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Get instant answers to the most common questions
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Getting Started</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Set up your account and invite your team</p>
                </Card>

                <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Features Guide</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Learn about all our powerful features</p>
                </Card>

                <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔗</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Integrations</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Connect with your favorite tools</p>
                </Card>

                <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔧</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Troubleshooting</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Fix common issues and problems</p>
                </Card>
              </div>
            </div>
          </div>

          {/* Help Articles */}
          <div className="py-16 sm:py-20 bg-white dark:bg-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Categories Sidebar */}
                <div className="lg:w-1/4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                          selectedCategory === category.id
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span className="mr-3">{category.icon}</span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Articles List */}
                <div className="lg:w-3/4">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Help Articles ({filteredArticles.length})
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {filteredArticles.map((article) => (
                      <Card key={article.id} className="p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mr-3">
                                {article.title}
                              </h4>
                              {article.popular && (
                                <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs font-medium px-2 py-1 rounded-full">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                              {article.description}
                            </p>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <span>{article.readTime}</span>
                              <span className="mx-2">•</span>
                              <span className="capitalize">{article.category.replace('-', ' ')}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => window.open(`/support/article/${article.id}`, '_blank')}
                            className="ml-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                          >
                            Read →
                          </button>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {filteredArticles.length === 0 && (
                    <Card className="p-12 text-center">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No articles found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Try adjusting your search terms or browse different categories.
                      </p>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="py-16 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Still Need Help?
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Our support team is here to help you succeed
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Email Support</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Get help via email. We typically respond within 24 hours.
                  </p>
                  <a href="mailto:support@corporacity.com" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    support@corporacity.com
                  </a>
                </Card>

                <Card className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Live Chat</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Chat with our support team in real-time during business hours.
                  </p>
                  <Button 
                    onClick={() => {
                      // In a real app, this would open a chat widget
                      alert('Chat feature coming soon! For now, please email us at support@corporacity.com');
                    }}
                    className="w-full"
                  >
                    Start Chat
                  </Button>
                </Card>

                <Card className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Phone Support</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Call us for urgent issues. Available Mon-Fri 9AM-6PM PST.
                  </p>
                  <a href="tel:+1-555-123-4567" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    +1 (555) 123-4567
                  </a>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

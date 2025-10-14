import React from 'react';
import Head from 'next/head';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Team Management: AI-Powered Insights",
      excerpt: "Discover how artificial intelligence is revolutionizing the way teams collaborate and manage their daily workflows.",
      author: "Sarah Chen",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "AI & Technology",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
      featured: true
    },
    {
      id: 2,
      title: "5 Strategies for Remote Team Success",
      excerpt: "Learn proven techniques to keep your remote team engaged, productive, and connected across different time zones.",
      author: "Michael Rodriguez",
      date: "2024-01-12",
      readTime: "7 min read",
      category: "Remote Work",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop",
      featured: false
    },
    {
      id: 3,
      title: "Building a Culture of Transparency in Your Organization",
      excerpt: "Explore how open communication and transparent processes can transform your team's productivity and morale.",
      author: "Emily Watson",
      date: "2024-01-10",
      readTime: "6 min read",
      category: "Leadership",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
      featured: false
    },
    {
      id: 4,
      title: "Data-Driven Decision Making for Modern Teams",
      excerpt: "Understand how to leverage team analytics and metrics to make informed decisions that drive business growth.",
      author: "David Kim",
      date: "2024-01-08",
      readTime: "8 min read",
      category: "Analytics",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
      featured: false
    },
    {
      id: 5,
      title: "The Psychology of Team Collaboration",
      excerpt: "Dive into the psychological factors that influence team dynamics and learn how to foster better collaboration.",
      author: "Lisa Thompson",
      date: "2024-01-05",
      readTime: "9 min read",
      category: "Psychology",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
      featured: false
    },
    {
      id: 6,
      title: "Scaling Your Team Management Processes",
      excerpt: "As your organization grows, learn how to scale your team management practices without losing efficiency.",
      author: "James Wilson",
      date: "2024-01-03",
      readTime: "6 min read",
      category: "Growth",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
      featured: false
    }
  ];

  const categories = ["All", "AI & Technology", "Remote Work", "Leadership", "Analytics", "Psychology", "Growth"];

  return (
    <>
      <Head>
        <title>Blog - Corporacity</title>
        <meta name="description" content="Insights, tips, and best practices for team management, remote work, and AI-powered collaboration." />
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
                  Our <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">Blog</span>
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                  Insights, tips, and best practices for modern team management
                </p>
              </div>
            </div>
          </div>

          {/* Featured Post */}
          <div className="py-16 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">Featured Article</h2>
                {blogPosts.filter(post => post.featured).map(post => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="md:flex">
                      <div className="md:w-1/2">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-64 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-1/2 p-8">
                        <div className="flex items-center mb-4">
                          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full">
                            {post.category}
                          </span>
                          <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">{post.readTime}</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {post.author.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{post.author}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{post.date}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                          >
                            Read More
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Category Filter */}
              <div className="mb-12">
                <div className="flex flex-wrap gap-3 justify-center">
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                        category === 'All' 
                          ? 'bg-blue-600 text-white shadow-lg' 
                          : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Blog Posts Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.filter(post => !post.featured).map(post => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="relative">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 dark:bg-slate-800/90 text-gray-800 dark:text-gray-200 text-sm font-medium px-3 py-1 rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{post.readTime}</span>
                        <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{post.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {post.author.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">{post.author}</span>
                        </div>
                        <button 
                          onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-200"
                        >
                          Read More →
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Newsletter Signup */}
              <div className="mt-16">
                <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 sm:p-12 text-center">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4">Stay Updated</h3>
                  <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                    Get the latest insights on team management, remote work, and AI-powered collaboration delivered to your inbox.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <button 
                      onClick={() => {
                        const email = document.querySelector('input[type="email"]').value;
                        if (email) {
                          alert(`Thank you for subscribing with ${email}! We'll send you updates soon.`);
                          document.querySelector('input[type="email"]').value = '';
                        } else {
                          alert('Please enter your email address first.');
                        }
                      }}
                      className="bg-white text-blue-600 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Subscribe
                    </button>
                  </div>
                  <p className="text-blue-200 text-sm mt-4">
                    No spam, unsubscribe at any time.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

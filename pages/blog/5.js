import React from 'react';
import Head from 'next/head';
import Layout from '../../components/ui/Layout';
import Card from '../../components/ui/Card';

export default function BlogPost5() {
  return (
    <>
      <Head>
        <title>The Psychology of Team Collaboration - Corporacity Blog</title>
        <meta name="description" content="Dive into the psychological factors that influence team dynamics and learn how to foster better collaboration through understanding human behavior." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="The Psychology of Team Collaboration" />
        <meta property="og:description" content="Dive into the psychological factors that influence team dynamics and learn how to foster better collaboration." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Psychology of Team Collaboration" />
        <meta name="twitter:description" content="Dive into the psychological factors that influence team dynamics and learn how to foster better collaboration." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop" />
      </Head>
      
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-rose-600 to-red-600 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-red-600/20 dark:from-pink-900/20 dark:to-red-900/20"></div>
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
              <div className="text-center">
                <div className="mb-6">
                  <span className="bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 text-sm font-medium px-3 py-1 rounded-full">
                    Psychology
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.4]">
                  The Psychology of Team Collaboration
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
                  Dive into the psychological factors that influence team dynamics and learn how to foster better collaboration
                </p>
                <div className="flex items-center justify-center space-x-6 text-white/80">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      LT
                    </div>
                    <div>
                      <p className="text-sm font-medium">Lisa Thompson</p>
                      <p className="text-xs">Organizational Psychologist</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p>January 5, 2024</p>
                    <p>9 min read</p>
                  </div>
                </div>
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
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop" 
                      alt="Team collaboration psychology"
                      className="w-full h-64 sm:h-80 object-cover rounded-xl mb-8"
                    />
                  </div>

                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                    Understanding the psychological underpinnings of team collaboration is crucial for building high-performing teams. While technology and processes are important, the human element—how people think, feel, and interact—ultimately determines whether a team succeeds or fails.
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    Research in organizational psychology reveals fascinating insights about what drives effective collaboration. By understanding these psychological principles, leaders can create environments that naturally encourage cooperation, innovation, and mutual support.
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">The Social Psychology of Teams</h2>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Teams are fundamentally social systems, and understanding the psychological dynamics at play can help predict and influence team behavior. Here are the key psychological factors that shape team collaboration:
                  </p>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <Card className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Social Identity Theory</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        People naturally form group identities and work harder when they feel part of a cohesive team with shared values and goals.
                      </p>
                    </Card>

                    <Card className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Psychological Safety</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Teams perform best when members feel safe to express ideas, ask questions, and admit mistakes without fear of judgment.
                      </p>
                    </Card>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">The Role of Cognitive Diversity</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    One of the most important psychological factors in team success is cognitive diversity—the variety of thinking styles, perspectives, and problem-solving approaches within a team.
                  </p>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Types of Cognitive Diversity</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Perspective Diversity</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          Different ways of viewing problems and opportunities based on background, experience, and expertise.
                        </p>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Process Diversity</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Varied approaches to problem-solving, decision-making, and information processing.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Knowledge Diversity</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          Different areas of expertise, skills, and domain knowledge that complement each other.
                        </p>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Motivational Diversity</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Different drivers and incentives that motivate team members to contribute their best work.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">The Psychology of Trust</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Trust is the foundation of effective collaboration, but it's not just about believing that team members will do their jobs. Psychological research identifies three distinct types of trust that are crucial for team success:
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Competence Trust</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Confidence that team members have the skills, knowledge, and ability to perform their roles effectively.
                      </p>
                    </Card>

                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Benevolence Trust</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Belief that team members care about each other's welfare and will act in the team's best interest.
                      </p>
                    </Card>

                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Integrity Trust</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Confidence that team members will follow through on commitments and adhere to shared values and principles.
                      </p>
                    </Card>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Motivation and Team Dynamics</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Understanding what motivates team members is crucial for fostering collaboration. Different people are driven by different factors, and effective teams leverage this diversity of motivation.
                  </p>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Motivational Factors in Teams</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Intrinsic Motivation</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                          <li>• Autonomy: The desire to have control over one's work</li>
                          <li>• Mastery: The drive to improve skills and expertise</li>
                          <li>• Purpose: The need to contribute to something meaningful</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Extrinsic Motivation</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                          <li>• Recognition: Public acknowledgment of contributions</li>
                          <li>• Rewards: Financial or material incentives</li>
                          <li>• Status: Advancement and career opportunities</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">The Impact of Group Dynamics</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Group dynamics play a crucial role in team collaboration. Understanding these dynamics can help leaders create environments that promote positive interactions and minimize conflict.
                  </p>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Positive Dynamics</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600 dark:text-gray-300 text-sm">Constructive conflict that leads to better solutions</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600 dark:text-gray-300 text-sm">Shared leadership and distributed expertise</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600 dark:text-gray-300 text-sm">Mutual support and knowledge sharing</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600 dark:text-gray-300 text-sm">Collective accountability for outcomes</span>
                        </li>
                      </ul>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Negative Dynamics</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600 dark:text-gray-300 text-sm">Groupthink that stifles innovation</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600 dark:text-gray-300 text-sm">Social loafing and free-riding behavior</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600 dark:text-gray-300 text-sm">Dominant personalities suppressing others</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600 dark:text-gray-300 text-sm">Unhealthy competition and territorial behavior</span>
                        </li>
                      </ul>
                    </Card>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Practical Applications</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    How can you apply these psychological insights to improve team collaboration? Here are some evidence-based strategies:
                  </p>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Evidence-Based Strategies</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Create Psychological Safety</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Encourage open communication, acknowledge mistakes as learning opportunities, and create forums for honest feedback without judgment.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Leverage Cognitive Diversity</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Intentionally build teams with diverse thinking styles and backgrounds, and create processes that ensure all voices are heard.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Build Trust Systematically</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Start with small, low-risk collaborations to build competence trust, then gradually increase the stakes as trust develops.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Align Individual and Team Goals</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Help team members see how their personal motivations and career goals align with team objectives and organizational mission.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-pink-600 to-red-600 rounded-xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Ready to Apply Psychology to Your Team?</h3>
                    <p className="text-pink-100 mb-6">
                      Use Corporacity's team management platform to understand and optimize the psychological dynamics of your team collaboration.
                    </p>
                    <a
                      href="/create-company"
                      className="bg-white text-pink-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-block"
                    >
                      Start Your Free Trial
                    </a>
                  </div>

                  <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                          LT
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Lisa Thompson</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Organizational Psychologist at Corporacity</p>
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <a href="https://twitter.com/corporacity" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        </a>
                        <a href="https://linkedin.com/company/corporacity" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
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

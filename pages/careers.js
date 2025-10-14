import React from 'react';
import Head from 'next/head';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';

export default function Careers() {
  const openPositions = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      experience: "5+ years",
      description: "Join our frontend team to build beautiful, responsive user interfaces for our team management platform.",
      requirements: [
        "5+ years of experience with React, Next.js, and TypeScript",
        "Strong understanding of modern CSS frameworks (Tailwind CSS)",
        "Experience with state management libraries (Redux, Zustand)",
        "Knowledge of testing frameworks (Jest, React Testing Library)",
        "Experience with responsive design and mobile-first development"
      ],
      benefits: ["Competitive salary", "Stock options", "Health insurance", "Flexible PTO", "Remote work"]
    },
    {
      id: 2,
      title: "AI/ML Engineer",
      department: "Engineering",
      location: "Remote / New York",
      type: "Full-time",
      experience: "3+ years",
      description: "Help us build the next generation of AI-powered team analytics and insights.",
      requirements: [
        "3+ years of experience in machine learning and data science",
        "Proficiency in Python, TensorFlow, and PyTorch",
        "Experience with natural language processing",
        "Knowledge of cloud platforms (AWS, GCP, Azure)",
        "Strong understanding of statistical analysis and data visualization"
      ],
      benefits: ["Competitive salary", "Stock options", "Health insurance", "Learning budget", "Conference attendance"]
    },
    {
      id: 3,
      title: "Product Manager",
      department: "Product",
      location: "Remote / Austin",
      type: "Full-time",
      experience: "4+ years",
      description: "Lead product strategy and roadmap for our team management platform.",
      requirements: [
        "4+ years of product management experience",
        "Experience with B2B SaaS products",
        "Strong analytical and problem-solving skills",
        "Experience with user research and A/B testing",
        "Excellent communication and leadership skills"
      ],
      benefits: ["Competitive salary", "Stock options", "Health insurance", "Flexible schedule", "Professional development"]
    },
    {
      id: 4,
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote / Seattle",
      type: "Full-time",
      experience: "3+ years",
      description: "Create intuitive and beautiful user experiences for our team management tools.",
      requirements: [
        "3+ years of UX/UI design experience",
        "Proficiency in Figma, Sketch, or Adobe Creative Suite",
        "Experience with user research and usability testing",
        "Strong portfolio showcasing B2B product design",
        "Knowledge of design systems and component libraries"
      ],
      benefits: ["Competitive salary", "Stock options", "Health insurance", "Design tools budget", "Creative freedom"]
    },
    {
      id: 5,
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote / Chicago",
      type: "Full-time",
      experience: "2+ years",
      description: "Help our customers achieve success with our platform and grow their teams.",
      requirements: [
        "2+ years of customer success or account management experience",
        "Experience with B2B SaaS products",
        "Strong communication and relationship-building skills",
        "Analytical mindset with attention to detail",
        "Experience with CRM systems (Salesforce, HubSpot)"
      ],
      benefits: ["Competitive salary", "Stock options", "Health insurance", "Performance bonuses", "Career growth"]
    },
    {
      id: 6,
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote / Denver",
      type: "Full-time",
      experience: "4+ years",
      description: "Build and maintain our cloud infrastructure and deployment pipelines.",
      requirements: [
        "4+ years of DevOps or infrastructure experience",
        "Experience with AWS, Docker, and Kubernetes",
        "Knowledge of CI/CD pipelines and automation",
        "Experience with monitoring and logging tools",
        "Strong scripting skills (Bash, Python, or similar)"
      ],
      benefits: ["Competitive salary", "Stock options", "Health insurance", "Infrastructure budget", "Learning opportunities"]
    }
  ];

  const benefits = [
    {
      icon: "💰",
      title: "Competitive Compensation",
      description: "We offer competitive salaries, stock options, and performance bonuses."
    },
    {
      icon: "🏥",
      title: "Health & Wellness",
      description: "Comprehensive health, dental, and vision insurance for you and your family."
    },
    {
      icon: "🏠",
      title: "Remote-First",
      description: "Work from anywhere with flexible hours and a home office stipend."
    },
    {
      icon: "📚",
      title: "Learning & Development",
      description: "Annual learning budget, conference attendance, and professional development opportunities."
    },
    {
      icon: "⏰",
      title: "Flexible Time Off",
      description: "Unlimited PTO policy with mandatory minimums to ensure you take time to recharge."
    },
    {
      icon: "👶",
      title: "Family-Friendly",
      description: "Paid parental leave, childcare assistance, and family-friendly policies."
    }
  ];

  return (
    <>
      <Head>
        <title>Careers - Corporacity</title>
        <meta name="description" content="Join our team and help build the future of team management. Explore open positions and learn about our culture." />
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
                  Join Our <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">Team</span>
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
                  Help us build the future of team management and collaboration
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="#open-positions"
                    className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-xl text-lg font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                  >
                    View Open Positions
                  </a>
                  <a
                    href="#culture"
                    className="bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white/20 px-8 py-4 rounded-xl text-lg font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                  >
                    Learn About Our Culture
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Culture Section */}
          <div id="culture" className="py-16 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Culture
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  We're building more than just a product - we're creating a workplace where innovation, 
                  collaboration, and growth thrive.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {benefits.map((benefit, index) => (
                  <Card key={index} className="p-8 text-center hover:shadow-xl transition-all duration-300">
                    <div className="text-4xl mb-4">{benefit.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{benefit.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
                  </Card>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 sm:p-12 text-white text-center">
                <h3 className="text-2xl sm:text-3xl font-bold mb-6">Why Work at Corporacity?</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <div className="text-3xl font-bold mb-2">100%</div>
                    <div className="text-blue-100">Remote-First</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">50+</div>
                    <div className="text-blue-100">Team Members</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">$5M</div>
                    <div className="text-blue-100">Series A Funding</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Open Positions */}
          <div id="open-positions" className="py-16 sm:py-20 bg-white dark:bg-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Open Positions
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Join our growing team and help shape the future of team management
                </p>
              </div>

              <div className="space-y-8">
                {openPositions.map((position) => (
                  <Card key={position.id} className="p-8 hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {position.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {position.department}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {position.location}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {position.type}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                            </svg>
                            {position.experience}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                          {position.description}
                        </p>
                      </div>
                      <div className="lg:ml-8 lg:flex-shrink-0">
                        <button 
                          onClick={() => {
                            const subject = `Application for ${position.title}`;
                            const body = `Dear Hiring Team,\n\nI am interested in applying for the ${position.title} position at Corporacity. Please find my application details below:\n\n[Your application details here]\n\nBest regards,\n[Your name]`;
                            window.open(`mailto:careers@corporacity.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                          }}
                          className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Requirements</h4>
                        <ul className="space-y-2">
                          {position.requirements.map((req, index) => (
                            <li key={index} className="flex items-start text-gray-600 dark:text-gray-300">
                              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Benefits</h4>
                        <ul className="space-y-2">
                          {position.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start text-gray-600 dark:text-gray-300">
                              <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="py-16 sm:py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Don't See Your Role?
              </h2>
              <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
                We're always looking for talented individuals to join our team. 
                Send us your resume and let us know how you'd like to contribute.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <a
                  href="mailto:careers@corporacity.com"
                  className="bg-white text-blue-600 hover:bg-gray-50 px-8 sm:px-12 py-4 sm:py-6 rounded-xl text-lg sm:text-xl font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto text-center"
                >
                  📧 Send Your Resume
                </a>
                <a
                  href="/contact"
                  className="bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white/20 px-8 sm:px-12 py-4 sm:py-6 rounded-xl text-lg sm:text-xl font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto text-center"
                >
                  💬 Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

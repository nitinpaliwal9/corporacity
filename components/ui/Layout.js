import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import NotificationCenter from './NotificationCenter';
import MobileAppInstall from './MobileAppInstall';
import supabase from '../../lib/supabaseClient';

const Layout = ({ 
  children, 
  title = 'Corporacity',
  showHeader = true,
  showFooter = true,
  className = ''
}) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        // Get user's company
        const { data: membership } = await supabase
          .from('corp_memberships')
          .select('company_id')
          .eq('user_id', user.id)
          .single();
        
        if (membership) {
          setCompanyId(membership.company_id);
        }
      }
    };

    getUser();
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 ${className}`}>
      {showHeader && (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-slate-700/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              <div className="flex items-center space-x-4">
                <Link 
                  href="/" 
                  className="flex items-center space-x-2 sm:space-x-3 group"
                  onClick={(e) => {
                    if (router.pathname === '/') {
                      e.preventDefault()
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                  }}
                >
                  <div className="w-7 h-7 sm:w-10 sm:h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 p-1">
                    <img 
                      src="/logo.webp" 
                      alt="Corporacity Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Corporacity
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Team Status Management</p>
                  </div>
                  <div className="sm:hidden">
                    <h1 className="text-sm font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Corporacity
                    </h1>
                  </div>
                </Link>
              </div>
              
              <nav className="hidden md:flex items-center space-x-8">
                {router.pathname === '/' ? (
                  // Homepage navigation
                  <>
                    <a 
                      href="#features" 
                      className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById('features')?.scrollIntoView({ 
                          behavior: 'smooth',
                          block: 'start'
                        })
                      }}
                    >
                      Features
                    </a>
                    <a 
                      href="#pricing" 
                      className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById('pricing')?.scrollIntoView({ 
                          behavior: 'smooth',
                          block: 'start'
                        })
                      }}
                    >
                      Pricing
                    </a>
                    <a 
                      href="#faq" 
                      className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById('faq')?.scrollIntoView({ 
                          behavior: 'smooth',
                          block: 'start'
                        })
                      }}
                    >
                      FAQ
                    </a>
                    <Link 
                      href="/employee" 
                      className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      Demo
                    </Link>
                  </>
                ) : (
                  // App navigation
                  <>
                    <Link 
                      href="/employee" 
                      className={`text-sm font-medium transition-colors duration-200 ${
                        router.pathname === '/employee' 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/analytics" 
                      className={`text-sm font-medium transition-colors duration-200 ${
                        router.pathname === '/analytics' 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      AI Analytics
                    </Link>
                    <Link 
                      href="/schedule" 
                      className={`text-sm font-medium transition-colors duration-200 ${
                        router.pathname === '/schedule' 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      Smart Schedule
                    </Link>
                    <Link 
                      href="/team-health" 
                      className={`text-sm font-medium transition-colors duration-200 ${
                        router.pathname === '/team-health' 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      Team Health
                    </Link>
                    <Link 
                      href="/integrations" 
                      className={`text-sm font-medium transition-colors duration-200 ${
                        router.pathname === '/integrations' 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      Integrations
                    </Link>
                    <Link 
                      href="/security" 
                      className={`text-sm font-medium transition-colors duration-200 ${
                        router.pathname === '/security' 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      Security
                    </Link>
                    <Link 
                      href="/mobile" 
                      className={`text-sm font-medium transition-colors duration-200 ${
                        router.pathname === '/mobile' 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      Mobile
                    </Link>
                    <Link 
                      href="/ceo" 
                      className={`text-sm font-medium transition-colors duration-200 ${
                        router.pathname === '/ceo' 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      CEO Panel
                    </Link>
                  </>
                )}
              </nav>

              <div className="flex items-center space-x-2 sm:space-x-4">
                {user && companyId && (
                  <NotificationCenter user={user} companyId={companyId} />
                )}
                <ThemeToggle />
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Live
                  </div>
                </div>
                {router.pathname === '/' && !user && (
                  <Link 
                    href="/create-company"
                    className="hidden sm:block bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Get Started
                  </Link>
                )}
                
                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 touch-target min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Mobile menu */}
            {mobileMenuOpen && (
              <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
                <div className="px-4 py-4 space-y-2">
                  {router.pathname === '/' ? (
                    // Homepage mobile navigation
                    <>
                      <a 
                        href="#features" 
                        className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-3 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-target min-h-[44px] flex items-center"
                        onClick={(e) => {
                          e.preventDefault()
                          setMobileMenuOpen(false)
                          document.getElementById('features')?.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                          })
                        }}
                      >
                        Features
                      </a>
                      <a 
                        href="#pricing" 
                        className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-3 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-target min-h-[44px] flex items-center"
                        onClick={(e) => {
                          e.preventDefault()
                          setMobileMenuOpen(false)
                          document.getElementById('pricing')?.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                          })
                        }}
                      >
                        Pricing
                      </a>
                      <a 
                        href="#faq" 
                        className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-3 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-target min-h-[44px] flex items-center"
                        onClick={(e) => {
                          e.preventDefault()
                          setMobileMenuOpen(false)
                          document.getElementById('faq')?.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                          })
                        }}
                      >
                        FAQ
                      </a>
                      <Link 
                        href="/employee" 
                        className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-3 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-target min-h-[44px] flex items-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Demo
                      </Link>
                    </>
                  ) : (
                    // App mobile navigation
                    <>
                      <Link 
                        href="/employee" 
                        className={`block py-3 px-2 rounded-lg transition-colors duration-200 touch-target min-h-[44px] flex items-center ${
                          router.pathname === '/employee' 
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                            : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        href="/analytics" 
                        className={`block py-3 px-2 rounded-lg transition-colors duration-200 touch-target min-h-[44px] flex items-center ${
                          router.pathname === '/analytics' 
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                            : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        AI Analytics
                      </Link>
                      <Link 
                        href="/schedule" 
                        className={`block py-3 px-2 rounded-lg transition-colors duration-200 touch-target min-h-[44px] flex items-center ${
                          router.pathname === '/schedule' 
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                            : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Smart Schedule
                      </Link>
                      <Link 
                        href="/team-health" 
                        className={`block py-3 px-2 rounded-lg transition-colors duration-200 touch-target min-h-[44px] flex items-center ${
                          router.pathname === '/team-health' 
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                            : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Team Health
                      </Link>
                      <Link 
                        href="/integrations" 
                        className={`block py-3 px-2 rounded-lg transition-colors duration-200 touch-target min-h-[44px] flex items-center ${
                          router.pathname === '/integrations' 
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                            : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Integrations
                      </Link>
                      <Link 
                        href="/security" 
                        className={`block py-3 px-2 rounded-lg transition-colors duration-200 touch-target min-h-[44px] flex items-center ${
                          router.pathname === '/security' 
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                            : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Security
                      </Link>
                      <Link 
                        href="/mobile" 
                        className={`block py-3 px-2 rounded-lg transition-colors duration-200 touch-target min-h-[44px] flex items-center ${
                          router.pathname === '/mobile' 
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                            : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Mobile
                      </Link>
                      <Link 
                        href="/ceo" 
                        className={`block py-3 px-2 rounded-lg transition-colors duration-200 touch-target min-h-[44px] flex items-center ${
                          router.pathname === '/ceo' 
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                            : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        CEO Panel
                      </Link>
                    </>
                  )}
                  
                  {router.pathname === '/' && !user && (
                    <Link 
                      href="/create-company"
                      className="block bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 text-center mt-4 touch-target min-h-[44px] flex items-center justify-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>
      )}

      <main className="flex-1">
        {children}
      </main>

      {showFooter && (
        <footer className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-t border-gray-200/50 dark:border-slate-700/50 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center shadow-sm p-1">
                    <img 
                      src="/logo.webp" 
                      alt="Corporacity Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Corporacity</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm max-w-md">
                  The simplest way to keep your team in sync. Real-time status updates, 
                  seamless collaboration, and powerful insights for modern teams.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><Link href="/employee" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link></li>
                  <li><Link href="/ceo" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">CEO Panel</Link></li>
                  <li><Link href="/create-company" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Create Company</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-slate-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © 2024 Corporacity. Built with ❤️ for modern teams.
              </p>
              <div className="flex space-x-6 mt-4 sm:mt-0">
                <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy</a>
                <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms</a>
                <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Security</a>
              </div>
            </div>
          </div>
        </footer>
      )}
      
      {/* Mobile App Install Prompt */}
      <MobileAppInstall />
    </div>
  );
};

export default Layout;

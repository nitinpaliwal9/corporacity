import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

const Layout = ({ 
  children, 
  title = 'Corporacity',
  showHeader = true,
  showFooter = true,
  className = ''
}) => {
  const router = useRouter();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ${className}`}>
      {showHeader && (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <span className="text-white font-bold text-lg">C</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      Corporacity
                    </h1>
                    <p className="text-xs text-gray-500 -mt-1">Team Status Management</p>
                  </div>
                </Link>
              </div>
              
              <nav className="hidden md:flex items-center space-x-8">
                <Link 
                  href="/employee" 
                  className={`text-sm font-medium transition-colors duration-200 ${
                    router.pathname === '/employee' 
                      ? 'text-blue-600' 
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/ceo" 
                  className={`text-sm font-medium transition-colors duration-200 ${
                    router.pathname === '/ceo' 
                      ? 'text-blue-600' 
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  CEO Panel
                </Link>
              </nav>

              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="text-sm text-gray-500">
                    Live
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1">
        {children}
      </main>

      {showFooter && (
        <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200/50 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">C</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">Corporacity</span>
                </div>
                <p className="text-gray-600 text-sm max-w-md">
                  The simplest way to keep your team in sync. Real-time status updates, 
                  seamless collaboration, and powerful insights for modern teams.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><Link href="/employee" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Dashboard</Link></li>
                  <li><Link href="/ceo" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">CEO Panel</Link></li>
                  <li><Link href="/create-company" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Create Company</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-gray-500">
                © 2024 Corporacity. Built with ❤️ for modern teams.
              </p>
              <div className="flex space-x-6 mt-4 sm:mt-0">
                <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Privacy</a>
                <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Terms</a>
                <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Security</a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;

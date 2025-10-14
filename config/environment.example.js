// Environment configuration example
// Copy this file to config/environment.js and fill in your values

export const environment = {
  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-ref.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key-here',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key-here'
  },

  // Application Configuration
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    environment: process.env.NODE_ENV || 'development',
    name: 'Corporacity',
    version: '1.0.0'
  },

  // Feature Flags
  features: {
    analytics: process.env.NODE_ENV === 'production',
    errorReporting: process.env.NODE_ENV === 'production',
    rateLimiting: true,
    realTimeUpdates: true
  },

  // Rate Limiting Configuration
  rateLimits: {
    general: { requests: 100, window: 15 * 60 * 1000 }, // 15 minutes
    auth: { requests: 10, window: 15 * 60 * 1000 },
    statusUpdate: { requests: 20, window: 60 * 1000 }, // 1 minute
    companyOperations: { requests: 10, window: 60 * 1000 },
    joinRequests: { requests: 5, window: 60 * 1000 }
  },

  // Security Configuration
  security: {
    corsOrigins: [
      'http://localhost:3000',
      'https://corporacity.hustlehackai.in',
      // Add your production domains here
    ],
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000 // 15 minutes
  },

  // Database Configuration
  database: {
    maxConnections: 20,
    connectionTimeout: 30000,
    queryTimeout: 10000
  },

  // Real-time Configuration
  realtime: {
    maxConnections: 100,
    heartbeatInterval: 30000,
    reconnectInterval: 5000
  }
}

export default environment

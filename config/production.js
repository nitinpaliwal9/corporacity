// Production Configuration for Corporacity
// This file contains production-specific settings and optimizations

export const productionConfig = {
  // Database Configuration
  database: {
    // Enable connection pooling for production
    poolSize: 20,
    // Connection timeout
    connectionTimeout: 30000,
    // Query timeout
    queryTimeout: 60000,
    // Enable SSL
    ssl: true,
    // Retry configuration
    retryAttempts: 3,
    retryDelay: 1000
  },

  // Security Configuration
  security: {
    // Enable all security features
    encryptionEnabled: true,
    auditLoggingEnabled: true,
    securityMonitoringEnabled: true,
    rateLimitingEnabled: true,
    
    // Session configuration
    sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
    maxSessionsPerUser: 3,
    
    // Rate limiting
    rateLimits: {
      login: { requests: 5, window: 60 * 60 * 1000 }, // 5 per hour
      api: { requests: 100, window: 60 * 60 * 1000 }, // 100 per hour
      dataAccess: { requests: 1000, window: 60 * 60 * 1000 } // 1000 per hour
    },
    
    // Encryption settings
    encryption: {
      algorithm: 'AES-256-CBC',
      keyRotationDays: 90,
      masterKeyRotationDays: 365
    }
  },

  // Performance Configuration
  performance: {
    // Enable caching
    cachingEnabled: true,
    cacheTTL: 5 * 60 * 1000, // 5 minutes
    
    // Database query optimization
    queryOptimization: true,
    connectionPooling: true,
    
    // Image optimization
    imageOptimization: true,
    maxImageSize: 5 * 1024 * 1024, // 5MB
    
    // CDN configuration
    cdnEnabled: true,
    cdnUrl: process.env.CDN_URL || 'https://cdn.corporacity.com'
  },

  // Monitoring Configuration
  monitoring: {
    // Enable performance monitoring
    performanceMonitoring: true,
    
    // Error tracking
    errorTracking: true,
    errorReporting: true,
    
    // Analytics
    analyticsEnabled: true,
    
    // Health checks
    healthCheckInterval: 30 * 1000, // 30 seconds
    healthCheckTimeout: 10 * 1000 // 10 seconds
  },

  // Logging Configuration
  logging: {
    // Log levels
    level: 'info',
    
    // Log destinations
    console: false, // Disable console logging in production
    file: true,
    remote: true,
    
    // Log retention
    retentionDays: 30,
    
    // Sensitive data filtering
    filterSensitiveData: true,
    
    // Log formats
    format: 'json'
  },

  // Feature Flags
  features: {
    // Core features
    realTimeChat: true,
    announcements: true,
    analytics: true,
    securityDashboard: true,
    
    // Advanced features
    encryption: true,
    auditLogging: true,
    privacyControls: true,
    dataRetention: true,
    
    // Experimental features
    aiInsights: true,
    predictiveAnalytics: true,
    automatedResponses: true
  },

  // API Configuration
  api: {
    // Rate limiting
    rateLimitEnabled: true,
    
    // CORS settings
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://corporacity.com'],
      credentials: true
    },
    
    // Request size limits
    maxRequestSize: '10mb',
    
    // Timeout settings
    timeout: 30 * 1000, // 30 seconds
    
    // Compression
    compressionEnabled: true
  },

  // Email Configuration
  email: {
    // Email service
    service: 'sendgrid',
    
    // Templates
    templates: {
      welcome: 'welcome-template-id',
      passwordReset: 'password-reset-template-id',
      securityAlert: 'security-alert-template-id'
    },
    
    // Rate limiting
    rateLimit: {
      requests: 100,
      window: 60 * 60 * 1000 // 1 hour
    }
  },

  // File Storage Configuration
  storage: {
    // Storage provider
    provider: 'supabase',
    
    // File size limits
    maxFileSize: 10 * 1024 * 1024, // 10MB
    
    // Allowed file types
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    
    // Storage paths
    paths: {
      avatars: 'avatars/',
      attachments: 'attachments/',
      exports: 'exports/',
      backups: 'backups/'
    }
  },

  // Backup Configuration
  backup: {
    // Enable automated backups
    enabled: true,
    
    // Backup frequency
    frequency: 'daily',
    
    // Retention policy
    retentionDays: 30,
    
    // Backup location
    location: 's3://corporacity-backups',
    
    // Encryption
    encrypted: true
  },

  // Compliance Configuration
  compliance: {
    // GDPR compliance
    gdpr: {
      enabled: true,
      dataRetentionDays: 365,
      autoDeleteEnabled: false,
      consentRequired: true
    },
    
    // SOC 2 compliance
    soc2: {
      enabled: true,
      auditLogging: true,
      accessControls: true,
      dataEncryption: true
    },
    
    // ISO 27001 compliance
    iso27001: {
      enabled: true,
      securityManagement: true,
      riskAssessment: true,
      incidentResponse: true
    }
  },

  // Environment-specific settings
  environment: {
    // Production environment
    isProduction: true,
    
    // Debug mode
    debug: false,
    
    // Development features
    devFeatures: false,
    
    // Testing
    testing: false
  }
};

// Export individual configurations for specific use cases
export const securityConfig = productionConfig.security;
export const performanceConfig = productionConfig.performance;
export const monitoringConfig = productionConfig.monitoring;
export const loggingConfig = productionConfig.logging;
export const apiConfig = productionConfig.api;
export const complianceConfig = productionConfig.compliance;

export default productionConfig;

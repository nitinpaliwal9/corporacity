# 🚀 Production Deployment Guide

## 📋 **Pre-Deployment Checklist**

### ✅ **Security & Compliance**
- [ ] All security features enabled and tested
- [ ] End-to-end encryption configured
- [ ] Audit logging implemented
- [ ] Privacy controls active
- [ ] GDPR compliance verified
- [ ] Security dashboard functional
- [ ] Rate limiting configured
- [ ] Session management secure

### ✅ **Performance & Scalability**
- [ ] Database connection pooling enabled
- [ ] Caching implemented
- [ ] Image optimization active
- [ ] CDN configured
- [ ] Performance monitoring setup
- [ ] Error tracking configured
- [ ] Health checks implemented

### ✅ **Code Quality**
- [ ] All console.log statements removed
- [ ] Mock data replaced with real implementations
- [ ] Unused files and components removed
- [ ] Error handling comprehensive
- [ ] Input validation implemented
- [ ] Security vulnerabilities patched

### ✅ **Database & Infrastructure**
- [ ] Production database configured
- [ ] Row Level Security (RLS) enabled
- [ ] Database migrations applied
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting setup
- [ ] SSL certificates configured

---

## 🔧 **Environment Setup**

### **1. Environment Variables**
```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Security
MASTER_ENCRYPTION_KEY=your_master_encryption_key
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# Email
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@corporacity.com

# Monitoring
SENTRY_DSN=your_sentry_dsn
ANALYTICS_ID=your_analytics_id

# Storage
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your_s3_bucket

# CDN
CDN_URL=https://cdn.corporacity.com

# CORS
ALLOWED_ORIGINS=https://corporacity.com,https://app.corporacity.com
```

### **2. Database Configuration**
```sql
-- Run all schema files in order
\i supabase/schema.sql
\i supabase/announcements_and_chat_schema.sql
\i supabase/security_schema.sql
\i supabase/enhanced_analytics_schema.sql

-- Enable RLS on all tables
ALTER TABLE corp_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_departments ENABLE ROW LEVEL SECURITY;

-- Create audit triggers
CREATE TRIGGER audit_corp_statuses_trigger
  AFTER INSERT OR UPDATE OR DELETE ON corp_statuses
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE corp_statuses;
ALTER PUBLICATION supabase_realtime ADD TABLE corp_announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE corp_chat_messages;
```

---

## 🏗️ **Deployment Architecture**

### **Frontend Deployment (Vercel/Netlify)**
```yaml
# vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key"
  },
  "functions": {
    "pages/api/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

### **Database Deployment (Supabase)**
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to project
supabase link --project-ref your-project-ref

# Deploy migrations
supabase db push

# Deploy functions
supabase functions deploy
```

### **CDN Configuration (Cloudflare)**
```javascript
// cloudflare-worker.js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Security headers
    const response = await fetch(request);
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    return response;
  }
};
```

---

## 🔒 **Security Hardening**

### **1. Application Security**
```javascript
// next.config.js
module.exports = {
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },
  
  // CSP
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*'
      }
    ];
  }
};
```

### **2. Database Security**
```sql
-- Enable audit logging
SELECT audit.enable_tracking('corp_statuses');
SELECT audit.enable_tracking('corp_announcements');
SELECT audit.enable_tracking('corp_chat_messages');

-- Create security policies
CREATE POLICY "Users can only see their own data" ON corp_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Company members can see company data" ON corp_statuses
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM corp_memberships 
      WHERE user_id = auth.uid()
    )
  );
```

### **3. API Security**
```javascript
// lib/apiSecurity.js
export const apiSecurity = {
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },
  
  // Input validation
  validateInput: (data, schema) => {
    // Implement Joi or Yup validation
  },
  
  // SQL injection prevention
  sanitizeInput: (input) => {
    // Implement input sanitization
  }
};
```

---

## 📊 **Monitoring & Observability**

### **1. Application Monitoring**
```javascript
// lib/monitoring.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Filter sensitive data
    if (event.user) {
      delete event.user.email;
    }
    return event;
  }
});
```

### **2. Performance Monitoring**
```javascript
// lib/performance.js
export const performanceMonitoring = {
  // Web Vitals
  trackWebVitals: (metric) => {
    if (metric.label === 'web-vital') {
      // Send to analytics
      gtag('event', metric.name, {
        value: Math.round(metric.value),
        event_category: 'Web Vitals'
      });
    }
  },
  
  // API Performance
  trackAPIPerformance: (endpoint, duration) => {
    // Track API response times
  }
};
```

### **3. Error Tracking**
```javascript
// lib/errorHandler.js
export const errorHandler = {
  // Global error handler
  handleError: (error, context) => {
    // Log error
    console.error('Error:', error, 'Context:', context);
    
    // Send to monitoring service
    Sentry.captureException(error, {
      tags: context
    });
    
    // Return user-friendly error
    return {
      message: 'An error occurred. Please try again.',
      code: 'INTERNAL_ERROR'
    };
  }
};
```

---

## 🔄 **CI/CD Pipeline**

### **GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run lint
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 📈 **Performance Optimization**

### **1. Frontend Optimization**
```javascript
// next.config.js
module.exports = {
  // Image optimization
  images: {
    domains: ['cdn.corporacity.com'],
    formats: ['image/webp', 'image/avif']
  },
  
  // Compression
  compress: true,
  
  // Bundle analysis
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false
      };
    }
    return config;
  }
};
```

### **2. Database Optimization**
```sql
-- Create indexes for performance
CREATE INDEX CONCURRENTLY idx_corp_statuses_company_created 
  ON corp_statuses (company_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_corp_chat_messages_room_created 
  ON corp_chat_messages (room_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_corp_audit_logs_company_created 
  ON corp_audit_logs (company_id, created_at DESC);

-- Analyze tables for query optimization
ANALYZE corp_statuses;
ANALYZE corp_chat_messages;
ANALYZE corp_audit_logs;
```

### **3. Caching Strategy**
```javascript
// lib/cache.js
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const cache = {
  // Get cached data
  get: async (key) => {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  },
  
  // Set cached data
  set: async (key, data, ttl = 300) => {
    try {
      await redis.setex(key, ttl, JSON.stringify(data));
    } catch (error) {
      // Silently fail
    }
  }
};
```

---

## 🚨 **Incident Response**

### **1. Monitoring Alerts**
```javascript
// lib/alerts.js
export const alerting = {
  // Critical alerts
  critical: [
    'Database connection failure',
    'Authentication service down',
    'High error rate (>5%)',
    'Security breach detected'
  ],
  
  // Warning alerts
  warning: [
    'High response time (>2s)',
    'Low disk space (<20%)',
    'High memory usage (>80%)',
    'Failed login attempts (>10)'
  ]
};
```

### **2. Runbook Procedures**
```markdown
## Database Connection Failure
1. Check Supabase status page
2. Verify connection strings
3. Check network connectivity
4. Restart application if needed
5. Escalate if unresolved

## High Error Rate
1. Check error logs
2. Identify error patterns
3. Check recent deployments
4. Rollback if necessary
5. Notify team

## Security Breach
1. Isolate affected systems
2. Preserve evidence
3. Notify security team
4. Implement containment
5. Begin recovery procedures
```

---

## 📋 **Post-Deployment Verification**

### **1. Health Checks**
```javascript
// pages/api/health.js
export default async function handler(req, res) {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      email: await checkEmail(),
      storage: await checkStorage()
    }
  };
  
  res.status(200).json(health);
}
```

### **2. Security Verification**
- [ ] SSL certificates valid
- [ ] Security headers present
- [ ] Rate limiting functional
- [ ] Authentication working
- [ ] Authorization enforced
- [ ] Audit logging active
- [ ] Encryption enabled

### **3. Performance Verification**
- [ ] Page load times < 2s
- [ ] API response times < 500ms
- [ ] Database query times < 100ms
- [ ] Error rate < 1%
- [ ] Uptime > 99.9%

---

## 🔧 **Maintenance Procedures**

### **1. Regular Maintenance**
```bash
# Weekly tasks
- Review security logs
- Check performance metrics
- Update dependencies
- Backup verification

# Monthly tasks
- Security audit
- Performance optimization
- Capacity planning
- Disaster recovery test
```

### **2. Backup & Recovery**
```bash
# Database backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# File backup
aws s3 sync ./uploads s3://corporacity-backups/uploads/

# Recovery procedure
psql $DATABASE_URL < backup_20240115.sql
aws s3 sync s3://corporacity-backups/uploads/ ./uploads/
```

---

## 📞 **Support & Escalation**

### **1. Support Contacts**
- **Technical Issues**: tech-support@corporacity.com
- **Security Issues**: security@corporacity.com
- **Performance Issues**: performance@corporacity.com
- **Emergency**: +1-555-EMERGENCY

### **2. Escalation Matrix**
- **Level 1**: Application errors, user issues
- **Level 2**: System performance, integration issues
- **Level 3**: Security incidents, data breaches
- **Level 4**: Infrastructure failures, disasters

This comprehensive deployment guide ensures Corporacity is production-ready with enterprise-grade security, performance, and reliability! 🚀

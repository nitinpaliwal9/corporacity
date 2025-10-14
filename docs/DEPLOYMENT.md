# Deployment Guide - Corporacity

## 🚀 Production Deployment

This guide covers deploying Corporacity to production with all security and performance optimizations.

## 📋 Prerequisites

### Required Accounts
- [Supabase](https://supabase.com) account
- [Vercel](https://vercel.com) account (recommended)
- [Google Cloud Console](https://console.cloud.google.com) for OAuth
- Domain name (optional but recommended)

### Required Tools
- Node.js 18+
- npm or yarn
- Git
- Vercel CLI (for Vercel deployment)

## 🗄️ Database Setup

### 1. Create Production Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `corporacity-production`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### 2. Configure Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Run the schema script:
   ```sql
   -- Copy and paste contents of supabase/schema.sql
   ```
3. Run the RLS policies:
   ```sql
   -- Copy and paste contents of supabase/rls_policies.sql
   ```

### 3. Configure Authentication

1. Go to **Authentication > Settings**
2. Configure **Site URL**: `https://yourdomain.com`
3. Add **Redirect URLs**:
   - `https://yourdomain.com/auth/callback`
   - `https://yourdomain.com` (for development)
4. Enable **Google Provider**:
   - Go to **Authentication > Providers**
   - Enable Google
   - Add your Google OAuth credentials

### 4. Configure Real-time

1. Go to **Database > Replication**
2. Enable real-time for all tables:
   - `corp_profiles`
   - `corp_companies`
   - `corp_memberships`
   - `corp_join_requests`
   - `corp_statuses`

## 🔐 Environment Configuration

### 1. Get Supabase Credentials

From your Supabase project dashboard:
- **Project URL**: Found in Settings > API
- **Anon Key**: Found in Settings > API
- **Service Role Key**: Found in Settings > API (keep this secret!)

### 2. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials > Create Credentials > OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
7. Copy **Client ID** and **Client Secret**

### 3. Environment Variables

Create `.env.local` for local development:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google OAuth (configured in Supabase)
# No need to add here - configured in Supabase dashboard

# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

#### 1. Install Vercel CLI
```bash
npm i -g vercel
```

#### 2. Deploy to Vercel
```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_APP_URL
```

#### 3. Configure Custom Domain (Optional)
1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings > Domains**
4. Add your custom domain
5. Configure DNS records as instructed

### Option 2: Docker Deployment

#### 1. Create Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### 2. Create docker-compose.yml
```yaml
version: '3.8'
services:
  corporacity:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
    restart: unless-stopped
```

#### 3. Deploy with Docker
```bash
# Build and run
docker-compose up -d

# Or with Docker directly
docker build -t corporacity .
docker run -p 3000:3000 --env-file .env.local corporacity
```

### Option 3: Traditional Server Deployment

#### 1. Server Requirements
- Node.js 18+
- PM2 (process manager)
- Nginx (reverse proxy)
- SSL certificate

#### 2. Deploy Steps
```bash
# Clone repository
git clone <repository-url>
cd corporacity-mvp

# Install dependencies
npm ci --only=production

# Build application
npm run build

# Start with PM2
pm2 start npm --name "corporacity" -- start
pm2 save
pm2 startup
```

#### 3. Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔒 Security Configuration

### 1. SSL/TLS Setup
- Use Let's Encrypt for free SSL certificates
- Configure HSTS headers
- Enable HTTP/2

### 2. Security Headers
The application includes comprehensive security headers:
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Strict-Transport-Security

### 3. Database Security
- RLS policies are automatically applied
- Service role key is kept secure
- Regular security updates

## 📊 Monitoring & Analytics

### 1. Error Monitoring
- Built-in error tracking
- Console logging in development
- Production error reporting

### 2. Performance Monitoring
- Core Web Vitals tracking
- API response time monitoring
- Database query performance

### 3. User Analytics
- User behavior tracking
- Feature usage analytics
- Conversion funnel analysis

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🧪 Testing in Production

### 1. Smoke Tests
```bash
# Test basic functionality
curl -f https://yourdomain.com/api/health || exit 1

# Test authentication flow
# (Manual testing recommended)
```

### 2. Load Testing
```bash
# Install artillery
npm install -g artillery

# Run load test
artillery quick --count 10 --num 5 https://yourdomain.com
```

### 3. Security Testing
- Run security scans
- Test authentication flows
- Verify RLS policies
- Check for common vulnerabilities

## 🔧 Maintenance

### 1. Regular Updates
- Keep dependencies updated
- Monitor security advisories
- Update Supabase client
- Review and update RLS policies

### 2. Backup Strategy
- Supabase automatic backups
- Database export scripts
- Configuration backups

### 3. Monitoring
- Set up uptime monitoring
- Monitor error rates
- Track performance metrics
- User feedback collection

## 🆘 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check Supabase status
curl https://status.supabase.com/api/v2/status.json

# Verify environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
```

#### Authentication Issues
- Verify Google OAuth configuration
- Check redirect URLs
- Ensure domain is whitelisted

#### Performance Issues
- Check Supabase query performance
- Monitor real-time connections
- Review bundle size

### Getting Help
1. Check application logs
2. Review Supabase logs
3. Check browser console
4. Contact support team

## 📈 Scaling Considerations

### Database Scaling
- Monitor query performance
- Add database indexes as needed
- Consider read replicas for high traffic

### Application Scaling
- Use CDN for static assets
- Implement caching strategies
- Consider microservices for complex features

### Real-time Scaling
- Monitor Supabase real-time limits
- Implement connection pooling
- Consider WebSocket alternatives for high scale

## 🔮 Future Improvements

### Planned Enhancements
- [ ] Multi-region deployment
- [ ] Advanced caching
- [ ] Microservices architecture
- [ ] Advanced monitoring
- [ ] Automated scaling

### Performance Optimizations
- [ ] Server-side rendering improvements
- [ ] Image optimization
- [ ] Bundle size optimization
- [ ] Database query optimization

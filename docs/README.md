# Corporacity - Production-Ready Team Status Management Platform

## 🚀 Overview

Corporacity is a modern, real-time team status management platform built with Next.js and Supabase. It enables companies to track employee daily status updates with CEO approval workflows and real-time notifications.

## ✨ Features

### Core Functionality
- **Real-time Status Updates**: Live status tracking (Present, Late, On Leave, On Visit, Short Leave)
- **Company Management**: Create companies with unique codes and manage memberships
- **Approval Workflows**: CEO approval system for employee join requests
- **User Authentication**: Secure Google OAuth integration
- **Real-time Notifications**: Instant updates across all users

### Production Features
- **Row Level Security (RLS)**: Comprehensive database security policies
- **Input Validation**: Robust validation and sanitization
- **Error Handling**: Comprehensive error boundaries and logging
- **Rate Limiting**: API protection against abuse
- **Analytics**: User behavior tracking and performance monitoring
- **Testing**: Comprehensive test suite with Jest
- **Security Headers**: Production-ready security configurations

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 13.4.10, React 18.2.0
- **Backend**: Supabase (PostgreSQL + Real-time + Auth)
- **Styling**: Tailwind CSS 3.4.7
- **Authentication**: Google OAuth via Supabase Auth
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel-ready configuration

### Database Schema
```
corp_profiles (user profiles)
├── corp_companies (company information)
├── corp_memberships (user-company relationships)
├── corp_join_requests (pending join requests)
└── corp_statuses (employee status updates)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd corporacity-mvp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the SQL scripts in order:
     ```sql
     -- Run in Supabase SQL Editor
     -- 1. First run: supabase/schema.sql
     -- 2. Then run: supabase/rls_policies.sql
     ```

5. **Configure Google OAuth**
   - Set up Google OAuth in Supabase Auth settings
   - Add your domain to allowed origins

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Run tests**
   ```bash
   npm test
   ```

## 📁 Project Structure

```
corporacity-mvp/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components
│   └── ErrorBoundary.js # Error boundary component
├── docs/                # Documentation
├── lib/                 # Utility libraries
│   ├── analytics.js     # Analytics and monitoring
│   ├── apiSecurity.js   # API security utilities
│   ├── errorHandler.js  # Error handling utilities
│   ├── supabaseClient.js # Supabase configuration
│   └── validation.js    # Input validation utilities
├── pages/               # Next.js pages
│   ├── api/            # API endpoints
│   ├── _app.js         # App wrapper
│   └── [page].js       # Page components
├── supabase/           # Database schema and policies
├── styles/             # Global styles
├── __tests__/          # Test files
└── public/             # Static assets
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

### Code Standards

- **ESLint**: Configured with Next.js rules
- **Prettier**: Code formatting (recommended)
- **Testing**: Jest with React Testing Library
- **Type Safety**: PropTypes for component validation

## 🛡️ Security

### Database Security
- **Row Level Security (RLS)**: All tables protected with comprehensive policies
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries via Supabase

### API Security
- **Rate Limiting**: Configurable rate limits per endpoint
- **CORS**: Properly configured cross-origin policies
- **Security Headers**: Comprehensive security headers
- **Input Sanitization**: XSS protection and input cleaning

### Authentication & Authorization
- **OAuth Integration**: Secure Google OAuth flow
- **Session Management**: Proper session handling and cleanup
- **Role-based Access**: Owner vs Employee permissions

## 📊 Monitoring & Analytics

### Analytics Events
- User authentication events
- Company and membership events
- Status update tracking
- Error monitoring
- Performance metrics

### Error Tracking
- Comprehensive error logging
- User-friendly error messages
- Error boundary implementation
- Performance monitoring

## 🧪 Testing

### Test Coverage
- **Unit Tests**: Utility functions and components
- **Integration Tests**: API endpoints and data flow
- **Component Tests**: UI component behavior
- **E2E Tests**: Critical user flows (recommended)

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Environment Setup

1. **Production Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
   NODE_ENV=production
   ```

2. **Supabase Production Setup**
   - Create production Supabase project
   - Run database migrations
   - Configure production RLS policies
   - Set up production OAuth credentials

### Deployment Options

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Performance

### Optimizations
- **Code Splitting**: Automatic Next.js code splitting
- **Image Optimization**: Next.js Image component
- **Caching**: Supabase query caching
- **Bundle Analysis**: Webpack bundle analyzer

### Monitoring
- **Performance Metrics**: Core Web Vitals tracking
- **Error Monitoring**: Real-time error tracking
- **User Analytics**: Behavior and usage analytics

## 🔄 API Reference

### Endpoints

#### POST /api/approve
Approve employee join request
```json
{
  "user_id": "uuid",
  "company_id": "uuid"
}
```

### Database Tables

#### corp_profiles
- `id` (uuid, primary key)
- `email` (text)
- `full_name` (text)
- `phone` (text)
- `created_at` (timestamptz)

#### corp_companies
- `id` (uuid, primary key)
- `name` (text)
- `code` (text, unique)
- `owner_id` (uuid, foreign key)
- `created_at` (timestamptz)

#### corp_memberships
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `company_id` (uuid, foreign key)
- `role` (text, default: 'employee')
- `created_at` (timestamptz)

#### corp_join_requests
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `company_id` (uuid, foreign key)
- `message` (text)
- `created_at` (timestamptz)

#### corp_statuses
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `company_id` (uuid, foreign key)
- `type` (enum: present, late, leave, visit, short_leave)
- `message` (text)
- `timestamp` (timestamptz)
- `is_auto` (boolean, default: false)

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Review Process
- All changes require code review
- Tests must pass
- Security implications must be considered
- Documentation must be updated

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Common Issues

#### Database Connection Issues
- Verify Supabase URL and keys
- Check RLS policies are properly configured
- Ensure database schema is up to date

#### Authentication Issues
- Verify Google OAuth configuration
- Check redirect URLs in Supabase
- Ensure environment variables are set

#### Performance Issues
- Check Supabase query performance
- Monitor real-time connection limits
- Review bundle size and optimization

### Getting Help
- Check the documentation
- Review existing issues
- Create a new issue with detailed information
- Contact the development team

## 🔮 Roadmap

### Planned Features
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Push notifications
- [ ] Team management features
- [ ] Integration with calendar systems
- [ ] Advanced reporting
- [ ] Multi-language support

### Technical Improvements
- [ ] TypeScript migration
- [ ] Advanced caching strategies
- [ ] Microservices architecture
- [ ] Advanced monitoring
- [ ] Automated testing pipeline
- [ ] Performance optimization

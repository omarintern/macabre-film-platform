# Deployment and Performance Guidelines

## Overview

This document outlines the deployment strategy, performance optimization guidelines, and monitoring practices for the Macabre Film platform. Our approach focuses on serverless deployment with Vercel, performance optimization, and comprehensive monitoring.

## Deployment Strategy

### Platform: Vercel

**Why Vercel?**
- Optimized for Next.js applications
- Global edge network for fast performance
- Automatic deployments from Git
- Built-in analytics and monitoring
- Serverless functions with edge runtime support

### Deployment Configuration

#### Next.js Configuration (`next.config.ts`)

```typescript
const nextConfig: NextConfig = {
  // Production optimization
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Security headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
      ],
    },
    {
      source: '/api/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, stale-while-revalidate=86400',
        },
      ],
    },
  ],
  
  // SEO redirects
  redirects: async () => [
    {
      source: '/home',
      destination: '/',
      permanent: true,
    },
  ],
  
  // Webpack optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // External dependencies for serverless
    config.externals = config.externals || [];
    config.externals.push('bcrypt', 'jsonwebtoken');
    
    // Tree shaking and optimization
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
    };
    
    return config;
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};
```

### Environment Configuration

#### Production Environment Variables

```bash
# .env.production
DATABASE_URL=your-production-database-url
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

#### Vercel Configuration (`vercel.json`)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, stale-while-revalidate=86400"
        }
      ]
    }
  ]
}
```

## Performance Optimization

### Core Web Vitals Targets

**Largest Contentful Paint (LCP)**: < 2.5s
**First Input Delay (FID)**: < 100ms
**Cumulative Layout Shift (CLS)**: < 0.1

### Optimization Strategies

#### 1. Image Optimization

```tsx
// Use Next.js Image component
import Image from 'next/image';

// Optimized image loading
<Image
  src="/work-poster.jpg"
  alt="Film poster for The Dark Hour"
  width={300}
  height={450}
  priority={isAboveFold}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

**Best Practices**:
- Use WebP and AVIF formats
- Implement lazy loading for below-fold images
- Use appropriate image sizes
- Provide blur placeholders
- Optimize image dimensions

#### 2. Code Splitting

```tsx
// Dynamic imports for code splitting
import dynamic from 'next/dynamic';

// Lazy load components
const WorkSubmissionForm = dynamic(() => import('./WorkSubmissionForm'), {
  loading: () => <Loading />,
  ssr: false,
});

// Route-based code splitting
const AdminPanel = dynamic(() => import('./AdminPanel'), {
  loading: () => <Loading />,
  ssr: false,
});
```

#### 3. Bundle Optimization

```typescript
// Bundle analyzer configuration
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Tree shaking
import { Button } from '@/components/ui/design-system';
// Instead of
// import * as Components from '@/components/ui/design-system';
```

#### 4. Caching Strategies

```typescript
// API route caching
export async function GET(request: Request) {
  const response = await fetch('https://api.example.com/data');
  
  return new Response(await response.json(), {
    headers: {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'CDN-Cache-Control': 'public, max-age=86400',
    },
  });
}

// Static generation with revalidation
export async function generateStaticParams() {
  const works = await fetchWorks();
  
  return works.map((work) => ({
    id: work.id,
  }));
}

export const revalidate = 3600; // Revalidate every hour
```

#### 5. Database Optimization

```typescript
// Connection pooling
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Optimized queries
const works = await prisma.work.findMany({
  select: {
    id: true,
    title: true,
    description: true,
    creator: {
      select: {
        id: true,
        name: true,
      },
    },
  },
  take: 20,
  orderBy: {
    createdAt: 'desc',
  },
});
```

### Performance Monitoring

#### 1. Real User Monitoring (RUM)

```typescript
// Performance monitoring utilities
import { performanceHelpers } from '@/lib/utils/performance';

// Monitor component performance
const monitor = performanceHelpers.createPerformanceMonitor();

const timer = monitor.start('component-render');
// Component logic
timer.end();

// Get performance metrics
const metrics = monitor.getMetrics();
```

#### 2. Core Web Vitals Tracking

```typescript
// Track Core Web Vitals
export function reportWebVitals(metric: any) {
  if (metric.label === 'web-vital') {
    // Send to analytics
    console.log(metric);
    
    // Send to monitoring service
    fetch('/api/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metric),
    });
  }
}
```

#### 3. Error Monitoring

```typescript
// Error boundary with monitoring
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Send to error tracking service
    fetch('/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      }),
    });
  }
}
```

## Deployment Pipeline

### 1. Pre-deployment Checks

```bash
#!/bin/bash
# pre-deploy.sh

echo "Running pre-deployment checks..."

# Run tests
npm run test:coverage
if [ $? -ne 0 ]; then
  echo "Tests failed"
  exit 1
fi

# Run linting
npm run lint
if [ $? -ne 0 ]; then
  echo "Linting failed"
  exit 1
fi

# Build application
npm run build
if [ $? -ne 0 ]; then
  echo "Build failed"
  exit 1
fi

# Run performance tests
npm run test:performance
if [ $? -ne 0 ]; then
  echo "Performance tests failed"
  exit 1
fi

echo "Pre-deployment checks passed"
```

### 2. CI/CD Pipeline

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
      - run: npm run test:coverage
      - run: npm run test:integration
      - run: npm run test:e2e
      - run: npm run test:performance

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test:accessibility

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### 3. Environment Management

```bash
# Environment setup script
#!/bin/bash

# Development
cp .env.example .env.local

# Staging
vercel env add DATABASE_URL preview
vercel env add NEXTAUTH_SECRET preview
vercel env add NEXTAUTH_URL preview

# Production
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
```

## Monitoring and Analytics

### 1. Performance Monitoring

```typescript
// Performance API endpoint
export async function GET() {
  const metrics = {
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    // Add custom metrics
  };

  return Response.json(metrics);
}

export async function POST(request: Request) {
  const metric = await request.json();
  
  // Store metric in database or monitoring service
  console.log('Performance metric:', metric);
  
  return Response.json({ success: true });
}
```

### 2. Health Checks

```typescript
// Health check endpoint
export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check external services
    const response = await fetch('https://api.example.com/health');
    
    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      external: response.ok ? 'connected' : 'error',
    });
  } catch (error) {
    return Response.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
    }, { status: 500 });
  }
}
```

### 3. Error Tracking

```typescript
// Error tracking middleware
export function errorHandler(error: Error, req: Request, res: Response) {
  // Log error
  console.error('Error:', error);
  
  // Send to error tracking service
  fetch('/api/errors', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      userAgent: req.headers['user-agent'],
    }),
  });
  
  // Return appropriate error response
  return Response.json({
    error: 'Internal server error',
  }, { status: 500 });
}
```

## Security Guidelines

### 1. Security Headers

```typescript
// Security headers configuration
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
];
```

### 2. Authentication Security

```typescript
// JWT configuration
const jwtConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  updateAge: 60 * 60 * 24, // 24 hours
};

// Password hashing
import bcrypt from 'bcrypt';

const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);
```

### 3. Input Validation

```typescript
// Input validation with Zod
import { z } from 'zod';

const workSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  tags: z.array(z.string()).max(10),
});

export async function POST(request: Request) {
  const body = await request.json();
  const validatedData = workSchema.parse(body);
  
  // Process validated data
}
```

## Performance Checklist

### Pre-deployment
- [ ] Run performance tests
- [ ] Check bundle size
- [ ] Optimize images
- [ ] Verify caching strategies
- [ ] Test Core Web Vitals

### Post-deployment
- [ ] Monitor Core Web Vitals
- [ ] Check error rates
- [ ] Monitor API response times
- [ ] Verify caching effectiveness
- [ ] Test user experience

### Ongoing Monitoring
- [ ] Track performance metrics
- [ ] Monitor error rates
- [ ] Analyze user behavior
- [ ] Optimize based on data
- [ ] Update dependencies

## Troubleshooting

### Common Performance Issues

1. **Slow Page Loads**
   - Check image optimization
   - Verify code splitting
   - Monitor bundle size
   - Check caching headers

2. **High Memory Usage**
   - Monitor memory leaks
   - Optimize database queries
   - Check for memory-intensive operations

3. **API Timeouts**
   - Optimize database queries
   - Implement caching
   - Check external service dependencies

### Debugging Tools

- **Vercel Analytics**: Built-in performance monitoring
- **Lighthouse**: Performance auditing
- **WebPageTest**: Detailed performance analysis
- **Chrome DevTools**: Real-time performance monitoring

## Conclusion

Following these deployment and performance guidelines ensures:
- Fast, reliable application performance
- Secure deployment practices
- Comprehensive monitoring and alerting
- Scalable architecture
- Optimal user experience

Remember: **Performance is a feature, not an afterthought.**

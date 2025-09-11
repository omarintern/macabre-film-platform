import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/spaces', // Public access for browsing works
  '/index', // Public access for browsing tags
  '/profile', // Profile routes - authentication handled client-side
];

// 🧪 QA FIX: 100% Firebase - No API routes needed
const publicApiRoutes: string[] = [
  // All API routes disabled - using 100% Firebase client-side
];

// Define admin-only routes
const adminOnlyRoutes = [
  '/admin',
];

// 🧪 QA FIX: Block all old Prisma API routes to prevent internal server errors
const blockedApiRoutes = [
  '/api/works',
  '/api/tags', 
  '/api/profile',
  '/api/admin',
  '/api/performance',
  '/api/bootstrap',
  '/api/auth' // Also block old auth routes since we use Firebase Auth directly
];

// Helper function to check if a path is public
function isPublicRoute(pathname: string): boolean {
  // 🧪 QA FIX: Block old API routes that use Prisma
  if (blockedApiRoutes.some(route => pathname.startsWith(route))) {
    return false; // Force block for old API routes
  }
  
  // Check exact matches for public routes
  if (publicRoutes.includes(pathname)) {
    return true;
  }
  
  // Check for profile routes (dynamic user profiles)
  if (pathname.startsWith('/profile/')) {
    return true;
  }
  
  // Check if it's a public API route (none currently)
  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    return true;
  }
  
  // Check for static assets and Next.js internal routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return true;
  }
  
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 🧪 QA FIX: Block old API routes entirely to prevent Prisma errors
  if (blockedApiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.json(
      { 
        error: 'API route disabled',
        message: 'This application uses 100% Firebase client-side architecture. API routes are not needed.',
        architecture: 'Firebase Firestore + Auth + Realtime Database'
      },
      { status: 404 }
    );
  }
  
  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }
  
  // For protected routes, redirect to login if not authenticated
  // (Firebase Auth state will be checked client-side)
  const loginUrl = new URL('/login', request.url);
  if (pathname !== '/') {
    loginUrl.searchParams.set('redirect', pathname);
  }
  return NextResponse.redirect(loginUrl);
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)  
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/spaces', // Public access for browsing works
];

// Define API routes that don't require authentication
const publicApiRoutes = [
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/logout',
  '/api/works', // Public access for viewing works
  '/api/bootstrap', // Bootstrap endpoint for initial setup
];

// Define admin-only routes
const adminOnlyRoutes = [
  '/admin',
];

// Define admin-only API routes
const adminOnlyApiRoutes = [
  '/api/admin',
];

// Helper function to check if a path is public
function isPublicRoute(pathname: string): boolean {
  // Check exact matches for public routes
  if (publicRoutes.includes(pathname)) {
    return true;
  }
  
  // Check if it's a public API route
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

// Note: verifyToken function is now imported from lib/utils/jwt

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }
  
  // Simple check: if no auth token, redirect to login for protected routes
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    // Preserve the intended destination
    if (pathname !== '/') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }
  
  // Let the pages handle JWT verification and role checking
  return NextResponse.next();
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

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, JWTPayload } from './lib/utils/jwt';

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
  
  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value;
  
  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    // Preserve the intended destination
    if (pathname !== '/') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }
  
  // Verify token
  const payload = verifyToken(token);
  if (!payload) {
    // Token is invalid, clear cookie and redirect to login
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });
    
    return response;
  }
  
  // Check admin-only routes
  const isAdminRoute = adminOnlyRoutes.some(route => pathname.startsWith(route));
  const isAdminApiRoute = adminOnlyApiRoutes.some(route => pathname.startsWith(route));
  
  if (isAdminRoute || isAdminApiRoute) {
    if (payload.role !== 'ADMIN') {
      // Not an admin, redirect to home page
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
  }
  
  // Token is valid, add user info to headers for API routes
  if (pathname.startsWith('/api/')) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-user-email', payload.email);
    requestHeaders.set('x-user-role', payload.role);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  // Allow access to protected routes
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

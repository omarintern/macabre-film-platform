import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../utils/jwt';
type UserRole = 'CREATOR' | 'ADMIN';

export interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
}

/**
 * Get the current authenticated user from API request
 * Returns null if not authenticated or token is invalid
 */
export function getCurrentUserFromRequest(request: NextRequest): AuthUser | null {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }
    
    const payload = verifyToken(token);
    if (!payload) {
      return null;
    }
    
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role as UserRole,
    };
  } catch (error) {
    console.error('[API AUTH] Error getting current user:', error);
    return null;
  }
}

/**
 * Require authentication for an API route
 * Returns 401 response if not authenticated
 */
export function requireAuthAPI(request: NextRequest): AuthUser | NextResponse {
  const user = getCurrentUserFromRequest(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  return user;
}

/**
 * Require admin role for an API route
 * Returns 401 if not authenticated, 403 if not admin
 */
export function requireAdminAPI(request: NextRequest): AuthUser | NextResponse {
  const user = getCurrentUserFromRequest(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  if (user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    );
  }
  
  return user;
}

/**
 * Require specific role for an API route
 */
export function requireRoleAPI(request: NextRequest, role: UserRole): AuthUser | NextResponse {
  const user = getCurrentUserFromRequest(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  if (user.role !== role) {
    return NextResponse.json(
      { error: `${role} access required` },
      { status: 403 }
    );
  }
  
  return user;
}

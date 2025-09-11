import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken, JWTPayload } from '../utils/jwt';
type UserRole = 'CREATOR' | 'ADMIN';

export interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
}

/**
 * Get the current authenticated user from the request
 * Returns null if not authenticated or token is invalid
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
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
    console.error('[AUTH] Error getting current user:', error);
    return null;
  }
}

/**
 * Require authentication for a page
 * Redirects to login if not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return user;
}

/**
 * Require admin role for a page
 * Redirects to login if not authenticated, or home if not admin
 */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  if (user.role !== 'ADMIN') {
    redirect('/');
  }
  
  return user;
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: AuthUser | null, role: UserRole): boolean {
  return user?.role === role;
}

/**
 * Check if user is admin
 */
export function isAdmin(user: AuthUser | null): boolean {
  return hasRole(user, 'ADMIN');
}

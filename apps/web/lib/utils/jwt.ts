import { createHmac, timingSafeEqual } from 'crypto';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Get JWT secret from environment variables
 */
export function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.warn('[JWT] JWT_SECRET not found in environment, using fallback');
    return 'dev-secret-key-change-for-production-2024';
  }
  return secret;
}

/**
 * Base64 URL encode (JWT standard)
 */
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Base64 URL decode (JWT standard)
 */
function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return Buffer.from(str, 'base64').toString();
}

/**
 * Parse expiration time to seconds
 */
function parseExpiresIn(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60; // Default 7 days
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 60 * 60;
    case 'd': return value * 24 * 60 * 60;
    default: return 7 * 24 * 60 * 60;
  }
}

/**
 * Sign a JWT token with user payload (native Node.js implementation)
 */
export function signToken(
  payload: { userId: string; email: string; role: string },
  expiresIn: string = '7d'
): string {
  const secret = getJWTSecret();
  const now = Math.floor(Date.now() / 1000);
  const exp = now + parseExpiresIn(expiresIn);
  
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const jwtPayload = {
    ...payload,
    iat: now,
    exp: exp
  };
  
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(jwtPayload));
  const data = `${encodedHeader}.${encodedPayload}`;
  
  const signature = createHmac('sha256', secret)
    .update(data)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  return `${data}.${signature}`;
}

/**
 * Verify and decode a JWT token (native Node.js implementation)
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const secret = getJWTSecret();
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      console.error('[JWT] Invalid token format');
      return null;
    }
    
    const [encodedHeader, encodedPayload, signature] = parts;
    const data = `${encodedHeader}.${encodedPayload}`;
    
    // Verify signature
    const expectedSignature = createHmac('sha256', secret)
      .update(data)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      console.error('[JWT] Invalid signature');
      return null;
    }
    
    // Decode payload
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JWTPayload;
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.error('[JWT] Token expired');
      return null;
    }
    
    return payload;
  } catch (error) {
    if (error instanceof Error) {
      console.error('[JWT] Token verification failed:', {
        error: error.message,
        tokenPreview: token.substring(0, 50) + '...',
        hasSecret: !!process.env.JWT_SECRET
      });
    }
    return null;
  }
}

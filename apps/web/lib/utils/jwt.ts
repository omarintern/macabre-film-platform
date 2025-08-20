import jwt from 'jsonwebtoken';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Get JWT secret from environment variables
 * @throws Error if JWT_SECRET is not set
 */
export function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
}

/**
 * Sign a JWT token with user payload
 * @param payload User data to include in token
 * @param expiresIn Token expiration time (default: 7 days)
 * @returns Signed JWT token
 */
export function signToken(
  payload: { userId: string; email: string; role: string },
  expiresIn: string = '7d'
): string {
  const secret = getJWTSecret();
  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Verify and decode a JWT token
 * @param token JWT token to verify
 * @returns Decoded payload or null if invalid
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const secret = getJWTSecret();
    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

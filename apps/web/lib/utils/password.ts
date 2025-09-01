import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

/**
 * Hash a password using Node.js native scrypt (architecture compliant)
 * @param password Plain text password
 * @returns Hashed password with salt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verify a password against a hash using Node.js native scrypt
 * @param password Plain text password
 * @param hashedPassword Hashed password with salt
 * @returns True if password matches
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const [salt, hash] = hashedPassword.split(':');
    if (!salt || !hash) {
      return false;
    }
    
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    const hashBuffer = Buffer.from(hash, 'hex');
    
    return timingSafeEqual(derivedKey, hashBuffer);
  } catch (error) {
    console.error('[Password] Verification failed:', error);
    return false;
  }
}

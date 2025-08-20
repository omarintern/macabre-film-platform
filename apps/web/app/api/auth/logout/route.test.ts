import { NextRequest } from 'next/server';
import { POST } from './route';
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.mock('jsonwebtoken');

const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('/api/auth/logout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret-key';
  });

  it('should return success response for valid token in cookie', async () => {
    mockedJwt.verify.mockReturnValue({
      userId: 'user123',
      email: 'test@example.com',
      role: 'CLIENT',
    });

    const request = new NextRequest('http://localhost/api/auth/logout', {
      method: 'POST',
      headers: {
        cookie: 'auth-token=valid-jwt-token',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Logout successful');

    // Check that cookie is cleared
    const setCookieHeader = response.headers.get('set-cookie');
    expect(setCookieHeader).toContain('auth-token=');
    expect(setCookieHeader).toContain('Max-Age=0');
  });

  it('should return success response for valid token in Authorization header', async () => {
    mockedJwt.verify.mockReturnValue({
      userId: 'user123',
      email: 'test@example.com',
      role: 'CLIENT',
    });

    const request = new NextRequest('http://localhost/api/auth/logout', {
      method: 'POST',
      headers: {
        authorization: 'Bearer valid-jwt-token',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Logout successful');
  });

  it('should return success response even without token', async () => {
    const request = new NextRequest('http://localhost/api/auth/logout', {
      method: 'POST',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Logout successful');

    // Check that cookie is cleared anyway
    const setCookieHeader = response.headers.get('set-cookie');
    expect(setCookieHeader).toContain('auth-token=');
    expect(setCookieHeader).toContain('Max-Age=0');
  });

  it('should return success response for invalid token', async () => {
    mockedJwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const request = new NextRequest('http://localhost/api/auth/logout', {
      method: 'POST',
      headers: {
        cookie: 'auth-token=invalid-jwt-token',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Logout successful');
  });

  it('should clear httpOnly cookie with correct attributes', async () => {
    const request = new NextRequest('http://localhost/api/auth/logout', {
      method: 'POST',
      headers: {
        cookie: 'auth-token=some-token',
      },
    });

    const response = await POST(request);

    const setCookieHeader = response.headers.get('set-cookie');
    expect(setCookieHeader).toContain('auth-token=');
    expect(setCookieHeader).toContain('HttpOnly');
    expect(setCookieHeader).toContain('SameSite=strict');
    expect(setCookieHeader).toContain('Max-Age=0');
    expect(setCookieHeader).toContain('Path=/');
  });

  it('should handle unexpected errors gracefully', async () => {
    mockedJwt.verify.mockImplementation(() => {
      throw new Error('Unexpected JWT error');
    });

    // Mock console.error to avoid test output noise
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const request = new NextRequest('http://localhost/api/auth/logout', {
      method: 'POST',
      headers: {
        cookie: 'auth-token=problematic-token',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Logout successful');

    consoleSpy.mockRestore();
  });
});

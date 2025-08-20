import { NextRequest } from 'next/server';
import { POST } from './route';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userService } from '../../../../../api/src/services/database';

// Mock dependencies
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../../../../api/src/services/database');

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;
const mockedUserService = userService as jest.Mocked<typeof userService>;

// Mock user data
const mockUser = {
  id: 'user123',
  email: 'test@example.com',
  password: 'hashedPassword123',
  role: 'CLIENT' as const,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

describe('/api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret-key';
  });

  it('should return success response for valid credentials', async () => {
    // Setup mocks
    mockedUserService.findUserByEmail.mockResolvedValue(mockUser);
    mockedBcrypt.compare.mockResolvedValue(true);
    mockedJwt.sign.mockReturnValue('mock-jwt-token');

    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user).toEqual({
      id: 'user123',
      email: 'test@example.com',
      role: 'CLIENT',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    });
    expect(data.token).toBe('mock-jwt-token');
    expect(data.message).toBe('Login successful');
  });

  it('should return error for missing email', async () => {
    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        password: 'Password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Email is required');
  });

  it('should return error for missing password', async () => {
    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Password is required');
  });

  it('should return error for non-existent user', async () => {
    mockedUserService.findUserByEmail.mockResolvedValue(null);

    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'Password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Invalid email or password');
  });

  it('should return error for invalid password', async () => {
    mockedUserService.findUserByEmail.mockResolvedValue(mockUser);
    mockedBcrypt.compare.mockResolvedValue(false);

    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Invalid email or password');
  });

  it('should verify password with bcrypt.compare', async () => {
    mockedUserService.findUserByEmail.mockResolvedValue(mockUser);
    mockedBcrypt.compare.mockResolvedValue(true);
    mockedJwt.sign.mockReturnValue('mock-jwt-token');

    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Password123',
      }),
    });

    await POST(request);

    expect(mockedBcrypt.compare).toHaveBeenCalledWith('Password123', 'hashedPassword123');
  });

  it('should generate JWT token with correct payload', async () => {
    mockedUserService.findUserByEmail.mockResolvedValue(mockUser);
    mockedBcrypt.compare.mockResolvedValue(true);
    mockedJwt.sign.mockReturnValue('mock-jwt-token');

    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Password123',
      }),
    });

    await POST(request);

    expect(mockedJwt.sign).toHaveBeenCalledWith(
      {
        userId: 'user123',
        email: 'test@example.com',
        role: 'CLIENT',
      },
      'test-secret-key',
      { expiresIn: '7d' }
    );
  });

  it('should handle database errors gracefully', async () => {
    mockedUserService.findUserByEmail.mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('An unexpected error occurred. Please try again.');
  });
});

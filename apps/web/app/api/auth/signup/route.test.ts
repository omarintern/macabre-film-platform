import { NextRequest } from 'next/server';
import { POST } from './route';
import bcrypt from 'bcrypt';
import { userService } from '../../../../lib/database';

// Mock the userService
jest.mock('../../../../lib/database', () => ({
  userService: {
    createUser: jest.fn(),
    findUserByEmail: jest.fn(),
  },
}));

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedUserService = userService as jest.Mocked<typeof userService>;

describe('/api/auth/signup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create user successfully with valid data', async () => {
    // Mock bcrypt hash
    mockedBcrypt.hash.mockResolvedValue('hashed_password_123');

    // Mock userService.createUser
    mockedUserService.createUser.mockResolvedValue({
      id: 'user_123',
      email: 'test@example.com',
      role: 'CLIENT',
    });

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({
      success: true,
      message: 'Account created successfully! You can now log in.',
    });

    // Verify bcrypt was called with correct parameters
    expect(mockedBcrypt.hash).toHaveBeenCalledWith('Password123', 12);

    // Verify userService.createUser was called with hashed password
    expect(userService.createUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'hashed_password_123',
    });
  });

  it('should return error for missing email', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        password: 'Password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      success: false,
      error: 'Email and password are required',
    });
  });

  it('should return error for invalid email format', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid-email',
        password: 'Password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      success: false,
      error: 'Please enter a valid email address',
    });
  });

  it('should return error for short password', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: '123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      success: false,
      error: 'Password must be at least 8 characters long',
    });
  });

  it('should return error for password without complexity requirements', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      success: false,
      error: 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
    });
  });

  it('should handle duplicate email error', async () => {
    // Mock bcrypt hash
    mockedBcrypt.hash.mockResolvedValue('hashed_password_123');

    // Mock userService to throw duplicate email error
    mockedUserService.createUser.mockRejectedValue(new Error('User with this email already exists'));

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'existing@example.com',
        password: 'Password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data).toEqual({
      success: false,
      error: 'An account with this email already exists',
    });
  });

  it('should handle unexpected errors gracefully', async () => {
    // Mock bcrypt hash
    mockedBcrypt.hash.mockResolvedValue('hashed_password_123');

    // Mock userService to throw unexpected error
    mockedUserService.createUser.mockRejectedValue(new Error('Database connection failed'));

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      success: false,
      error: 'Unable to create account. Please try again.',
    });
  });
});

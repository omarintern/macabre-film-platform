import { NextRequest } from 'next/server';
import { PUT } from './route';
import jwt from 'jsonwebtoken';
import { userService } from '../../../lib/database';

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../../../lib/database', () => ({
  userService: {
    updateUserProfile: jest.fn(),
  },
}));

const mockedJwt = jwt as jest.Mocked<typeof jwt>;
const mockedUserService = userService as jest.Mocked<typeof userService>;

// Mock environment variables
const originalEnv = process.env;
beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret';
});

afterAll(() => {
  process.env = originalEnv;
});

describe('/api/profile PUT', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update profile successfully for CREATOR user', async () => {
    // Mock JWT verification
    mockedJwt.verify.mockReturnValue({
      userId: 'user_123',
      email: 'creator@example.com',
      role: 'CREATOR',
    } as any);

    // Mock userService response
    mockedUserService.updateUserProfile.mockResolvedValue({
      id: 'user_123',
      email: 'creator@example.com',
      role: 'CREATOR',
      name: 'John Creator',
      bio: 'A creative professional',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const request = new NextRequest('http://localhost:3000/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'auth-token=valid-token',
      },
      body: JSON.stringify({
        name: 'John Creator',
        bio: 'A creative professional',
      }),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user.name).toBe('John Creator');
    expect(data.user.bio).toBe('A creative professional');
    expect(mockedUserService.updateUserProfile).toHaveBeenCalledWith('user_123', {
      name: 'John Creator',
      bio: 'A creative professional',
    });
  });

  it('should return 401 when no auth token provided', async () => {
    const request = new NextRequest('http://localhost:3000/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Creator',
      }),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Authentication required');
  });

  it('should return 401 when JWT token is invalid', async () => {
    mockedJwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const request = new NextRequest('http://localhost:3000/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'auth-token=invalid-token',
      },
      body: JSON.stringify({
        name: 'John Creator',
      }),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Invalid authentication token');
  });

  it('should return 403 when user is not a CREATOR', async () => {
    mockedJwt.verify.mockReturnValue({
      userId: 'user_123',
      email: 'client@example.com',
      role: 'CLIENT',
    } as any);

    const request = new NextRequest('http://localhost:3000/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'auth-token=valid-token',
      },
      body: JSON.stringify({
        name: 'John Client',
      }),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Only creators can edit profiles');
  });

  it('should validate name field type', async () => {
    mockedJwt.verify.mockReturnValue({
      userId: 'user_123',
      email: 'creator@example.com',
      role: 'CREATOR',
    } as any);

    const request = new NextRequest('http://localhost:3000/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'auth-token=valid-token',
      },
      body: JSON.stringify({
        name: 123, // Invalid type
      }),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Name must be a string');
  });

  it('should validate name length', async () => {
    mockedJwt.verify.mockReturnValue({
      userId: 'user_123',
      email: 'creator@example.com',
      role: 'CREATOR',
    } as any);

    const longName = 'a'.repeat(101); // Exceeds 100 character limit

    const request = new NextRequest('http://localhost:3000/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'auth-token=valid-token',
      },
      body: JSON.stringify({
        name: longName,
      }),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Name must be 100 characters or less');
  });

  it('should validate bio length', async () => {
    mockedJwt.verify.mockReturnValue({
      userId: 'user_123',
      email: 'creator@example.com',
      role: 'CREATOR',
    } as any);

    const longBio = 'a'.repeat(1001); // Exceeds 1000 character limit

    const request = new NextRequest('http://localhost:3000/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'auth-token=valid-token',
      },
      body: JSON.stringify({
        bio: longBio,
      }),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Bio must be 1000 characters or less');
  });

  it('should handle user not found error', async () => {
    mockedJwt.verify.mockReturnValue({
      userId: 'nonexistent_user',
      email: 'creator@example.com',
      role: 'CREATOR',
    } as any);

    mockedUserService.updateUserProfile.mockRejectedValue(new Error('User not found'));

    const request = new NextRequest('http://localhost:3000/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'auth-token=valid-token',
      },
      body: JSON.stringify({
        name: 'John Creator',
      }),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('User not found');
  });

  it('should handle database errors gracefully', async () => {
    mockedJwt.verify.mockReturnValue({
      userId: 'user_123',
      email: 'creator@example.com',
      role: 'CREATOR',
    } as any);

    mockedUserService.updateUserProfile.mockRejectedValue(new Error('Database connection failed'));

    const request = new NextRequest('http://localhost:3000/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'auth-token=valid-token',
      },
      body: JSON.stringify({
        name: 'John Creator',
      }),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });

  it('should handle missing JWT_SECRET', async () => {
    const originalSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    const request = new NextRequest('http://localhost:3000/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'auth-token=valid-token',
      },
      body: JSON.stringify({
        name: 'John Creator',
      }),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Server configuration error');

    process.env.JWT_SECRET = originalSecret;
  });
});

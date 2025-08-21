import { NextRequest } from 'next/server';
import { GET } from './route';
import { userService } from '../../../../lib/database';

// Mock dependencies
jest.mock('../../../../lib/database', () => ({
  userService: {
    getUserProfile: jest.fn(),
  },
}));

const mockedUserService = userService as jest.Mocked<typeof userService>;

describe('/api/profile/[userId] GET', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return public profile for CREATOR user', async () => {
    const mockUser = {
      id: 'user_123',
      email: 'creator@example.com',
      role: 'CREATOR',
      name: 'John Creator',
      bio: 'A creative professional',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    };

    mockedUserService.getUserProfile.mockResolvedValue(mockUser as any);

    const request = new NextRequest('http://localhost:3000/api/profile/user_123');
    const response = await GET(request, { params: Promise.resolve({ userId: 'user_123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.profile).toEqual({
      id: 'user_123',
      name: 'John Creator',
      bio: 'A creative professional',
      role: 'CREATOR',
      createdAt: '2024-01-01T00:00:00.000Z',
    });
    // Ensure email is not included in public profile
    expect(data.profile.email).toBeUndefined();
  });

  it('should return 404 when user not found', async () => {
    mockedUserService.getUserProfile.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/profile/nonexistent');
    const response = await GET(request, { params: Promise.resolve({ userId: 'nonexistent' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('User not found');
  });

  it('should return 404 for CLIENT user (profile not available)', async () => {
    const mockUser = {
      id: 'user_123',
      email: 'client@example.com',
      role: 'CLIENT',
      name: 'John Client',
      bio: 'Just a client',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockedUserService.getUserProfile.mockResolvedValue(mockUser as any);

    const request = new NextRequest('http://localhost:3000/api/profile/user_123');
    const response = await GET(request, { params: Promise.resolve({ userId: 'user_123' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Profile not available');
  });

  it('should return 404 for ADMIN user (profile not available)', async () => {
    const mockUser = {
      id: 'user_123',
      email: 'admin@example.com',
      role: 'ADMIN',
      name: 'John Admin',
      bio: 'System administrator',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockedUserService.getUserProfile.mockResolvedValue(mockUser as any);

    const request = new NextRequest('http://localhost:3000/api/profile/user_123');
    const response = await GET(request, { params: Promise.resolve({ userId: 'user_123' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Profile not available');
  });

  it('should validate userId parameter', async () => {
    const request = new NextRequest('http://localhost:3000/api/profile/');
    const response = await GET(request, { params: Promise.resolve({ userId: '' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Valid user ID is required');
  });

  it('should handle database errors gracefully', async () => {
    mockedUserService.getUserProfile.mockRejectedValue(new Error('Database connection failed'));

    const request = new NextRequest('http://localhost:3000/api/profile/user_123');
    const response = await GET(request, { params: Promise.resolve({ userId: 'user_123' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });

  it('should return profile with null name and bio if not set', async () => {
    const mockUser = {
      id: 'user_123',
      email: 'creator@example.com',
      role: 'CREATOR',
      name: null,
      bio: null,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    };

    mockedUserService.getUserProfile.mockResolvedValue(mockUser as any);

    const request = new NextRequest('http://localhost:3000/api/profile/user_123');
    const response = await GET(request, { params: Promise.resolve({ userId: 'user_123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.profile.name).toBeNull();
    expect(data.profile.bio).toBeNull();
  });
});

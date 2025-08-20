import { NextRequest } from 'next/server';
import { POST } from './route';
import { userService } from '../../../../lib/database';
import { verifyToken } from '../../../../lib/utils/jwt';

// Mock dependencies
jest.mock('../../../../lib/database', () => ({
  userService: {
    findUserByEmail: jest.fn(),
    findUserById: jest.fn(),
    updateUserRole: jest.fn(),
  },
}));
jest.mock('../../../../lib/utils/jwt');

const mockedUserService = userService as jest.Mocked<typeof userService>;
const mockedVerifyToken = verifyToken as jest.MockedFunction<typeof verifyToken>;

describe('/api/admin/promote-user', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockRequest = (body: any, token?: string): NextRequest => {
    const request = new NextRequest('http://localhost:3000/api/admin/promote-user', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (token) {
      // Mock cookie
      Object.defineProperty(request, 'cookies', {
        value: {
          get: (name: string) => name === 'auth-token' ? { value: token } : undefined,
        },
      });
    }

    return request;
  };

  describe('Authentication and Authorization', () => {
    it('should return 401 if no token provided', async () => {
      const request = createMockRequest({
        userIdentifier: 'test@example.com',
        targetRole: 'CREATOR',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Authentication required');
    });

    it('should return 401 if token is invalid', async () => {
      mockedVerifyToken.mockReturnValue(null);

      const request = createMockRequest({
        userIdentifier: 'test@example.com',
        targetRole: 'CREATOR',
      }, 'invalid-token');

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid or expired token');
    });

    it('should return 403 if user is not admin', async () => {
      mockedVerifyToken.mockReturnValue({
        userId: 'user-1',
        email: 'user@example.com',
        role: 'CLIENT',
        iat: 1234567890,
        exp: 1234567890,
      });

      const request = createMockRequest({
        userIdentifier: 'test@example.com',
        targetRole: 'CREATOR',
      }, 'valid-token');

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Admin access required');
    });
  });

  describe('Request Validation', () => {
    beforeEach(() => {
      mockedVerifyToken.mockReturnValue({
        userId: 'admin-1',
        email: 'admin@example.com',
        role: 'ADMIN',
        iat: 1234567890,
        exp: 1234567890,
      });
    });

    it('should return 400 if userIdentifier is missing', async () => {
      const request = createMockRequest({
        targetRole: 'CREATOR',
      }, 'admin-token');

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('User identifier and target role are required');
    });

    it('should return 400 if targetRole is invalid', async () => {
      const request = createMockRequest({
        userIdentifier: 'test@example.com',
        targetRole: 'INVALID_ROLE',
      }, 'admin-token');

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid target role. Must be CREATOR or ADMIN');
    });
  });

  describe('User Promotion', () => {
    beforeEach(() => {
      mockedVerifyToken.mockReturnValue({
        userId: 'admin-1',
        email: 'admin@example.com',
        role: 'ADMIN',
        iat: 1234567890,
        exp: 1234567890,
      });
    });

    it('should successfully promote user by email', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        role: 'CLIENT',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedUser = { ...mockUser, role: 'CREATOR' };

      mockedUserService.findUserByEmail.mockResolvedValue(mockUser as any);
      mockedUserService.updateUserRole.mockResolvedValue(updatedUser as any);

      const request = createMockRequest({
        userIdentifier: 'test@example.com',
        targetRole: 'CREATOR',
      }, 'admin-token');

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.user?.role).toBe('CREATOR');
      expect(data.message).toBe('User successfully promoted to CREATOR');
      expect(mockedUserService.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockedUserService.updateUserRole).toHaveBeenCalledWith('user-1', 'CREATOR');
    });

    it('should successfully promote user by ID', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        role: 'CREATOR',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedUser = { ...mockUser, role: 'ADMIN' };

      mockedUserService.findUserById.mockResolvedValue(mockUser as any);
      mockedUserService.updateUserRole.mockResolvedValue(updatedUser as any);

      const request = createMockRequest({
        userIdentifier: 'user-1',
        targetRole: 'ADMIN',
      }, 'admin-token');

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.user?.role).toBe('ADMIN');
      expect(mockedUserService.findUserById).toHaveBeenCalledWith('user-1');
      expect(mockedUserService.updateUserRole).toHaveBeenCalledWith('user-1', 'ADMIN');
    });

    it('should return 404 if user not found', async () => {
      mockedUserService.findUserByEmail.mockResolvedValue(null);

      const request = createMockRequest({
        userIdentifier: 'nonexistent@example.com',
        targetRole: 'CREATOR',
      }, 'admin-token');

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('User not found');
    });

    it('should return 400 if user already has target role', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        role: 'CREATOR',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedUserService.findUserByEmail.mockResolvedValue(mockUser as any);

      const request = createMockRequest({
        userIdentifier: 'test@example.com',
        targetRole: 'CREATOR',
      }, 'admin-token');

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('User already has CREATOR role');
    });

    it('should handle database errors gracefully', async () => {
      mockedUserService.findUserByEmail.mockRejectedValue(new Error('Database error'));

      const request = createMockRequest({
        userIdentifier: 'test@example.com',
        targetRole: 'CREATOR',
      }, 'admin-token');

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unable to promote user. Please try again.');
    });
  });
});

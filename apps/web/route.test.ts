import { NextRequest } from 'next/server';
import { POST, GET } from './route';
import jwt from 'jsonwebtoken';
import { userService } from '../../../lib/database';

// Mock the database service
jest.mock('../../../lib/database', () => ({
  userService: {
    createWork: jest.fn(),
    getWorksByCreator: jest.fn(),
    getAllWorks: jest.fn(),
  },
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken');

const mockedUserService = userService as jest.Mocked<typeof userService>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('/api/works', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  describe('POST /api/works', () => {
    const validWorkData = {
      title: 'Test Work',
      body: 'This is a test work body',
      classification: 'Synopsis',
      tags: ['drama', 'thriller'],
    };

    const mockCreatedWork = {
      id: 'work_123',
      title: 'Test Work',
      body: 'This is a test work body',
      classification: 'Synopsis',
      tags: ['drama', 'thriller'],
      creatorId: 'user_123',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      creator: {
        id: 'user_123',
        name: 'Test Creator',
        email: 'creator@example.com',
      },
    };

    it('should create a work successfully for authenticated CREATOR', async () => {
      mockedJwt.verify.mockReturnValue({
        userId: 'user_123',
        email: 'creator@example.com',
        role: 'CREATOR',
      } as any);

      mockedUserService.createWork.mockResolvedValue(mockCreatedWork as any);

      const request = new NextRequest('http://localhost/api/works', {
        method: 'POST',
        body: JSON.stringify(validWorkData),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'auth-token=valid-token',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.work).toEqual(mockCreatedWork);
      expect(mockedUserService.createWork).toHaveBeenCalledWith({
        title: 'Test Work',
        body: 'This is a test work body',
        classification: 'Synopsis',
        tags: ['drama', 'thriller'],
        creatorId: 'user_123',
      });
    });

    it('should return 401 if no auth token provided', async () => {
      const request = new NextRequest('http://localhost/api/works', {
        method: 'POST',
        body: JSON.stringify(validWorkData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should return 401 if JWT token is invalid', async () => {
      mockedJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const request = new NextRequest('http://localhost/api/works', {
        method: 'POST',
        body: JSON.stringify(validWorkData),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'auth-token=invalid-token',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid authentication token');
    });

    it('should return 403 if user is not a CREATOR', async () => {
      mockedJwt.verify.mockReturnValue({
        userId: 'user_123',
        email: 'client@example.com',
        role: 'CLIENT',
      } as any);

      const request = new NextRequest('http://localhost/api/works', {
        method: 'POST',
        body: JSON.stringify(validWorkData),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'auth-token=valid-token',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Access denied. CREATOR role required.');
    });

    it('should return 400 if title is missing', async () => {
      mockedJwt.verify.mockReturnValue({
        userId: 'user_123',
        email: 'creator@example.com',
        role: 'CREATOR',
      } as any);

      const invalidData = { ...validWorkData, title: '' };

      const request = new NextRequest('http://localhost/api/works', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'auth-token=valid-token',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Title is required');
    });

    it('should return 400 if body exceeds 1000 characters', async () => {
      mockedJwt.verify.mockReturnValue({
        userId: 'user_123',
        email: 'creator@example.com',
        role: 'CREATOR',
      } as any);

      const invalidData = { 
        ...validWorkData, 
        body: 'a'.repeat(1001) 
      };

      const request = new NextRequest('http://localhost/api/works', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'auth-token=valid-token',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Body must be 1000 characters or less');
    });

    it('should return 400 if classification is invalid', async () => {
      mockedJwt.verify.mockReturnValue({
        userId: 'user_123',
        email: 'creator@example.com',
        role: 'CREATOR',
      } as any);

      const invalidData = { 
        ...validWorkData, 
        classification: 'Invalid Classification' 
      };

      const request = new NextRequest('http://localhost/api/works', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'auth-token=valid-token',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Classification must be Synopsis, Scene Description, or Other');
    });

    it('should handle tags as comma-separated string', async () => {
      mockedJwt.verify.mockReturnValue({
        userId: 'user_123',
        email: 'creator@example.com',
        role: 'CREATOR',
      } as any);

      mockedUserService.createWork.mockResolvedValue(mockCreatedWork as any);

      const dataWithStringTags = { 
        ...validWorkData, 
        tags: 'drama, thriller, action' 
      };

      const request = new NextRequest('http://localhost/api/works', {
        method: 'POST',
        body: JSON.stringify(dataWithStringTags),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'auth-token=valid-token',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(mockedUserService.createWork).toHaveBeenCalledWith({
        title: 'Test Work',
        body: 'This is a test work body',
        classification: 'Synopsis',
        tags: ['drama', 'thriller', 'action'],
        creatorId: 'user_123',
      });
    });

    it('should handle database errors gracefully', async () => {
      mockedJwt.verify.mockReturnValue({
        userId: 'user_123',
        email: 'creator@example.com',
        role: 'CREATOR',
      } as any);

      mockedUserService.createWork.mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost/api/works', {
        method: 'POST',
        body: JSON.stringify(validWorkData),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'auth-token=valid-token',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('An unexpected error occurred. Please try again.');
    });
  });

  describe('GET /api/works', () => {
    const mockWorks = [
      {
        id: 'work_1',
        title: 'Work 1',
        body: 'Body 1',
        classification: 'Synopsis',
        tags: ['tag1'],
        creatorId: 'user_123',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        creator: {
          id: 'user_123',
          name: 'Test Creator',
          email: 'creator@example.com',
        },
      },
    ];

    const mockPaginatedResult = {
      works: mockWorks,
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    };

    it('should return paginated works for public access', async () => {
      mockedUserService.getAllWorks.mockResolvedValue(mockPaginatedResult as any);

      const request = new NextRequest('http://localhost/api/works?page=1&limit=20', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.works).toEqual(mockWorks);
      expect(data.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
      expect(mockedUserService.getAllWorks).toHaveBeenCalledWith(1, 20);
    });

    it('should use default pagination parameters when not provided', async () => {
      mockedUserService.getAllWorks.mockResolvedValue(mockPaginatedResult as any);

      const request = new NextRequest('http://localhost/api/works', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockedUserService.getAllWorks).toHaveBeenCalledWith(1, 20);
    });

    it('should return 400 for invalid pagination parameters', async () => {
      const request = new NextRequest('http://localhost/api/works?page=0&limit=20', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid pagination parameters. Page and limit must be positive numbers.');
    });

    it('should limit maximum items per page to 50', async () => {
      mockedUserService.getAllWorks.mockResolvedValue(mockPaginatedResult as any);

      const request = new NextRequest('http://localhost/api/works?page=1&limit=100', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockedUserService.getAllWorks).toHaveBeenCalledWith(1, 50);
    });

    it('should handle database errors gracefully', async () => {
      mockedUserService.getAllWorks.mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost/api/works?page=1&limit=20', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('An unexpected error occurred. Please try again.');
    });
  });
});

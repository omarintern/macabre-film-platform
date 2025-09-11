import { NextRequest } from 'next/server';
import { GET, POST } from './route';
import { userService } from '../../../lib/database';

// Mock the database service
jest.mock('../../../lib/database', () => ({
  userService: {
    createWork: jest.fn(),
    getWorksByCreator: jest.fn(),
    getAllWorks: jest.fn(),
  },
}));

// Mock JWT utils
jest.mock('../../../lib/utils/jwt', () => ({
  verifyToken: jest.fn(),
}));

interface MockWork {
  id: string;
  title: string;
  body: string;
  classification: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  creator: {
    id: string;
    name: string | null;
    email: string;
  };
}

import * as jwtUtils from '../../../lib/utils/jwt';

const mockUserService = userService as jest.Mocked<typeof userService>;
const mockJwtUtils = jwtUtils as jest.Mocked<typeof jwtUtils>;

describe('/api/works', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set JWT_SECRET environment variable for tests
    process.env.JWT_SECRET = 'test-secret-key';
  });
  
  afterEach(() => {
    // Clean up environment variables
    delete process.env.JWT_SECRET;
  });

  describe('GET', () => {
    it('should return works with pagination', async () => {
      const mockWorks: MockWork[] = [
        {
          id: '1',
          title: 'Test Work',
          body: 'Test content',
          classification: 'SYNOPSIS',
          creatorId: 'user1',
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: ['test'],
          creator: {
            id: 'user1',
            name: 'Test User',
            email: 'test@example.com',
          },
        },
      ];

      mockUserService.getAllWorks.mockResolvedValue({ 
        works: mockWorks, 
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      });

      const request = new NextRequest('http://localhost:3000/api/works?page=1&limit=10');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.works).toHaveLength(1);
      expect(data.pagination.totalPages).toBe(1);
    });

    it('should handle database connection errors', async () => {
      mockUserService.getAllWorks.mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost:3000/api/works');
      const response = await GET(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('An unexpected error occurred. Please try again.');
    });

    it('should handle invalid pagination parameters', async () => {
      // Mock database error for invalid parameters
      mockUserService.getAllWorks.mockRejectedValue(new Error('Database connection failed'));
      
      const request = new NextRequest('http://localhost:3000/api/works?page=invalid&limit=invalid');
      const response = await GET(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('An unexpected error occurred. Please try again.');
    });
  });

  describe('POST', () => {
    it('should create a new work', async () => {
      const mockWork: MockWork = {
        id: '1',
        title: 'New Work',
        body: 'New content',
        classification: 'SYNOPSIS',
        creatorId: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['new'],
        creator: {
          id: 'user1',
          name: 'New User',
          email: 'new@example.com',
        },
      };

      mockUserService.createWork.mockResolvedValue(mockWork);

      // Mock JWT verification for authentication
      mockJwtUtils.verifyToken.mockReturnValue({
        userId: 'user1',
        email: 'test@example.com',
        role: 'CREATOR',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600
      });

      const requestBody = {
        title: 'New Work',
        body: 'New content',
        classification: 'Synopsis',
        tags: ['new'],
      };

      const request = new NextRequest('http://localhost:3000/api/works', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'auth-token=valid-token',
        },
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.work.title).toBe('New Work');
    });

    it('should handle missing authorization header', async () => {
      const requestBody = {
        title: 'New Work',
        body: 'New content',
        classification: 'Synopsis',
        tags: ['new'],
      };

      const request = new NextRequest('http://localhost:3000/api/works', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Authentication required');
    });

    it('should handle invalid request body', async () => {
      // Mock JWT to return null for invalid token
      mockJwtUtils.verifyToken.mockReturnValue(null);

      const request = new NextRequest('http://localhost:3000/api/works', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'auth-token=invalid-token',
        },
        body: 'invalid-json',
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Invalid authentication token');
    });
  });
});

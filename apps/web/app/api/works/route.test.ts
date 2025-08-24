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

const mockUserService = userService as jest.Mocked<typeof userService>;

describe('/api/works', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
      expect(data.totalPages).toBe(1);
    });

    it('should handle database connection errors', async () => {
      mockUserService.getAllWorks.mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost:3000/api/works');
      const response = await GET(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Internal server error');
    });

    it('should handle invalid pagination parameters', async () => {
      const request = new NextRequest('http://localhost:3000/api/works?page=invalid&limit=invalid');
      const response = await GET(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid pagination parameters');
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

      const requestBody = {
        title: 'New Work',
        content: 'New content',
        classification: 'SYNOPSIS',
        tags: ['new'],
      };

      const request = new NextRequest('http://localhost:3000/api/works', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token',
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
        content: 'New content',
        classification: 'SYNOPSIS',
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
      expect(data.error).toBe('Unauthorized');
    });

    it('should handle invalid request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/works', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token',
        },
        body: 'invalid-json',
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid request body');
    });
  });
});

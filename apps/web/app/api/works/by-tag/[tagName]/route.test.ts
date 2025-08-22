import { NextRequest } from 'next/server';
import { GET } from './route';
import { userService } from '../../../../../lib/database';

// Mock the userService
jest.mock('../../../../../lib/database', () => ({
  userService: {
    getWorksByTag: jest.fn(),
  },
}));

const mockedUserService = userService as jest.Mocked<typeof userService>;

describe('/api/works/by-tag/[tagName]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/works/by-tag/[tagName]', () => {
    const mockWorks = [
      {
        id: 'work-1',
        title: 'Test Work 1',
        body: 'Test body 1',
        classification: 'Synopsis',
        tags: ['action', 'drama'],
        creatorId: 'creator-1',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        creator: {
          id: 'creator-1',
          name: 'Test Creator',
          email: 'creator@test.com',
        },
      },
    ];

    const mockPagination = {
      works: mockWorks,
      page: 1,
      limit: 12,
      total: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    };

    it('should return works filtered by tag successfully', async () => {
      mockedUserService.getWorksByTag.mockResolvedValue(mockPagination);

      const request = new NextRequest('http://localhost/api/works/by-tag/action');
      const params = { tagName: 'action' };

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.works).toEqual(mockWorks);
      expect(data.pagination).toEqual({
        page: 1,
        limit: 12,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
      expect(data.tagName).toBe('action');
      expect(mockedUserService.getWorksByTag).toHaveBeenCalledWith('action', 1, 12);
    });

    it('should handle pagination parameters', async () => {
      mockedUserService.getWorksByTag.mockResolvedValue(mockPagination);

      const request = new NextRequest('http://localhost/api/works/by-tag/action?page=2&limit=5');
      const params = { tagName: 'action' };

      const response = await GET(request, { params });
      await response.json();

      expect(response.status).toBe(200);
      expect(mockedUserService.getWorksByTag).toHaveBeenCalledWith('action', 2, 5);
    });

    it('should handle URL-encoded tag names', async () => {
      mockedUserService.getWorksByTag.mockResolvedValue(mockPagination);

      const request = new NextRequest('http://localhost/api/works/by-tag/sci-fi');
      const params = { tagName: 'sci-fi' };

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.tagName).toBe('sci-fi');
      expect(mockedUserService.getWorksByTag).toHaveBeenCalledWith('sci-fi', 1, 12);
    });

    it('should handle empty tag name', async () => {
      const request = new NextRequest('http://localhost/api/works/by-tag/');
      const params = { tagName: '' };

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Tag name is required and cannot be empty.');
      expect(mockedUserService.getWorksByTag).not.toHaveBeenCalled();
    });

    it('should handle invalid pagination parameters', async () => {
      const request = new NextRequest('http://localhost/api/works/by-tag/action?page=0&limit=100');
      const params = { tagName: 'action' };

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 50.');
      expect(mockedUserService.getWorksByTag).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      mockedUserService.getWorksByTag.mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost/api/works/by-tag/action');
      const params = { tagName: 'action' };

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.error).toBe('Database connection error. Please try again later.');
      expect(mockedUserService.getWorksByTag).toHaveBeenCalledWith('action', 1, 12);
    });

    it('should return empty results when no works found for tag', async () => {
      const emptyPagination = {
        works: [],
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      };

      mockedUserService.getWorksByTag.mockResolvedValue(emptyPagination);

      const request = new NextRequest('http://localhost/api/works/by-tag/nonexistent');
      const params = { tagName: 'nonexistent' };

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.works).toEqual([]);
      expect(data.pagination.total).toBe(0);
      expect(data.tagName).toBe('nonexistent');
    });
  });
});

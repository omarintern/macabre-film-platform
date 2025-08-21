import { NextRequest } from 'next/server';
import { GET } from './route';

// Mock the database service
jest.mock('../../../../../lib/database', () => ({
  userService: {
    getWorksByCreator: jest.fn(),
  },
}));

import { userService } from '../../../../../lib/database';

const mockGetWorksByCreator = userService.getWorksByCreator as jest.MockedFunction<typeof userService.getWorksByCreator>;

describe('/api/works/by-creator/[userId] API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockWorks = [
    {
      id: 'work-1',
      title: 'Test Work 1',
      body: 'Test body 1',
      classification: 'Synopsis',
      tags: ['tag1'],
      creatorId: 'creator-1',
      createdAt: '2025-01-21T12:00:00.000Z',
      updatedAt: '2025-01-21T12:00:00.000Z',
      creator: {
        id: 'creator-1',
        name: 'Test Creator',
        email: 'test@example.com',
      },
    },
    {
      id: 'work-2',
      title: 'Test Work 2',
      body: 'Test body 2',
      classification: 'Scene Description',
      tags: ['tag2'],
      creatorId: 'creator-1',
      createdAt: '2025-01-20T12:00:00.000Z',
      updatedAt: '2025-01-20T12:00:00.000Z',
      creator: {
        id: 'creator-1',
        name: 'Test Creator',
        email: 'test@example.com',
      },
    },
  ];

  describe('GET /api/works/by-creator/[userId]', () => {
    it('should return works for valid creator ID', async () => {
      mockGetWorksByCreator.mockResolvedValue(mockWorks);

      const request = new NextRequest('http://localhost/api/works/by-creator/creator-1');
      const params = { params: { userId: 'creator-1' } };

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.works).toEqual(mockWorks);
      expect(mockGetWorksByCreator).toHaveBeenCalledWith('creator-1');
    });

    it('should return empty array for creator with no works', async () => {
      mockGetWorksByCreator.mockResolvedValue([]);

      const request = new NextRequest('http://localhost/api/works/by-creator/creator-2');
      const params = { params: { userId: 'creator-2' } };

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.works).toEqual([]);
    });

    it('should return 400 for missing creator ID', async () => {
      const request = new NextRequest('http://localhost/api/works/by-creator/');
      const params = { params: { userId: '' } };

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Creator ID is required');
      expect(mockGetWorksByCreator).not.toHaveBeenCalled();
    });

    it('should return 400 for whitespace-only creator ID', async () => {
      const request = new NextRequest('http://localhost/api/works/by-creator/   ');
      const params = { params: { userId: '   ' } };

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Creator ID is required');
      expect(mockGetWorksByCreator).not.toHaveBeenCalled();
    });

    it('should return 404 for non-existent creator', async () => {
      mockGetWorksByCreator.mockRejectedValue(new Error('Creator not found'));

      const request = new NextRequest('http://localhost/api/works/by-creator/nonexistent');
      const params = { params: { userId: 'nonexistent' } };

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Creator not found');
    });

    it('should return 500 for database errors', async () => {
      mockGetWorksByCreator.mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost/api/works/by-creator/creator-1');
      const params = { params: { userId: 'creator-1' } };

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('An unexpected error occurred. Please try again.');
    });
  });
});

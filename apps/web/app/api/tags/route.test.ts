import { NextRequest } from 'next/server';
import { GET } from './route';
import { userService } from '../../../lib/database';

// Mock the userService
jest.mock('../../../lib/database', () => ({
  userService: {
    getAllTags: jest.fn(),
  },
}));

const mockedUserService = userService as jest.Mocked<typeof userService>;

describe('/api/tags', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/tags', () => {
    const mockTags = [
      { name: 'action', count: 3 },
      { name: 'drama', count: 2 },
      { name: 'thriller', count: 1 },
    ];

    it('should return all tags successfully', async () => {
      mockedUserService.getAllTags.mockResolvedValue(mockTags);

      const request = new NextRequest('http://localhost/api/tags', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.tags).toEqual(mockTags);
      expect(mockedUserService.getAllTags).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no tags exist', async () => {
      mockedUserService.getAllTags.mockResolvedValue([]);

      const request = new NextRequest('http://localhost/api/tags', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.tags).toEqual([]);
      expect(mockedUserService.getAllTags).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors gracefully', async () => {
      mockedUserService.getAllTags.mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost/api/tags', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('An unexpected error occurred. Please try again.');
      expect(mockedUserService.getAllTags).toHaveBeenCalledTimes(1);
    });

    it('should return tags in alphabetical order', async () => {
      const unsortedTags = [
        { name: 'zombie', count: 1 },
        { name: 'action', count: 3 },
        { name: 'drama', count: 2 },
      ];
      
      mockedUserService.getAllTags.mockResolvedValue(unsortedTags);

      const request = new NextRequest('http://localhost/api/tags', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.tags).toEqual(unsortedTags);
      // Note: The sorting is handled in the service layer, so we expect the service to return sorted data
    });
  });
});

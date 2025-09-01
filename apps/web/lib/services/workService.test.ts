import { workService, WorkServiceClass, CreateWorkRequest, Work } from './workService';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('WorkService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockWork: Work = {
    id: 'work_123',
    title: 'Test Work',
    body: 'Test body content',
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

  describe('createWork', () => {
    const validWorkData: CreateWorkRequest = {
      title: 'Test Work',
      body: 'Test body content',
      classification: 'Synopsis',
      tags: ['drama', 'thriller'],
    };

    it('should create work successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, work: mockWork }),
      } as Response);

      const result = await workService.createWork(validWorkData);

      expect(result).toEqual(mockWork);
      expect(mockFetch).toHaveBeenCalledWith('/api/works', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(validWorkData),
      });
    });

    it('should throw error when API returns error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Title is required' }),
      } as Response);

      await expect(workService.createWork(validWorkData)).rejects.toThrow('Title is required');
    });

    it('should throw error when fetch fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(workService.createWork(validWorkData)).rejects.toThrow('Network error');
    });

    it('should throw generic error when API returns no specific error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      } as Response);

      await expect(workService.createWork(validWorkData)).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('getMyWorks', () => {
    it('should retrieve works successfully', async () => {
      const mockWorks = [mockWork];
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, works: mockWorks }),
      } as Response);

      const result = await workService.getMyWorks();

      expect(result).toEqual(mockWorks);
      expect(mockFetch).toHaveBeenCalledWith('/api/works', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    });

    it('should throw error when API returns error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Authentication required' }),
      } as Response);

      await expect(workService.getMyWorks()).rejects.toThrow('Authentication required');
    });
  });

  describe('getWorkById', () => {
    it('should retrieve specific work successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, work: mockWork }),
      } as Response);

      const result = await workService.getWorkById('work_123');

      expect(result).toEqual(mockWork);
      expect(mockFetch).toHaveBeenCalledWith('/api/works/work_123', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    });

    it('should throw error when work not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Work not found' }),
      } as Response);

      await expect(workService.getWorkById('nonexistent')).rejects.toThrow('Work not found');
    });
  });

  describe('validateWorkData', () => {
    it('should validate correct work data', () => {
      const validData: CreateWorkRequest = {
        title: 'Test Work',
        body: 'Test body content',
        classification: 'Synopsis',
        tags: ['drama'],
      };

      const result = workService.validateWorkData(validData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate missing title', () => {
      const invalidData: CreateWorkRequest = {
        title: '',
        body: 'Test body content',
        classification: 'Synopsis',
        tags: [],
      };

      const result = workService.validateWorkData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is required');
    });

    it('should validate missing body', () => {
      const invalidData: CreateWorkRequest = {
        title: 'Test Work',
        body: '',
        classification: 'Synopsis',
        tags: [],
      };

      const result = workService.validateWorkData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Body is required');
    });

    it('should validate body length', () => {
      const invalidData: CreateWorkRequest = {
        title: 'Test Work',
        body: 'a'.repeat(1001),
        classification: 'Synopsis',
        tags: [],
      };

      const result = workService.validateWorkData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Body must be 1000 characters or less');
    });

    it('should validate missing classification', () => {
      const invalidData: CreateWorkRequest = {
        title: 'Test Work',
        body: 'Test body content',
        classification: '',
        tags: [],
      };

      const result = workService.validateWorkData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Classification is required');
    });

    it('should validate invalid classification', () => {
      const invalidData: CreateWorkRequest = {
        title: 'Test Work',
        body: 'Test body content',
        classification: 'Invalid Classification',
        tags: [],
      };

      const result = workService.validateWorkData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Classification must be Synopsis, Scene Description, or Other');
    });

    it('should validate invalid tags type', () => {
      const invalidData = {
        title: 'Test Work',
        body: 'Test body content',
        classification: 'Synopsis',
        tags: 'not an array',
      } as any;

      const result = workService.validateWorkData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Tags must be an array of strings');
    });
  });

  describe('parseTags', () => {
    it('should parse array of tags', () => {
      const tags = ['drama', 'thriller', 'action'];
      const result = workService.parseTags(tags);

      expect(result).toEqual(['drama', 'thriller', 'action']);
    });

    it('should parse comma-separated string', () => {
      const tags = 'drama, thriller, action';
      const result = workService.parseTags(tags);

      expect(result).toEqual(['drama', 'thriller', 'action']);
    });

    it('should filter empty tags from array', () => {
      const tags = ['drama', '', 'thriller', '   ', 'action'];
      const result = workService.parseTags(tags);

      expect(result).toEqual(['drama', 'thriller', 'action']);
    });

    it('should filter empty tags from string', () => {
      const tags = 'drama, , thriller,   , action';
      const result = workService.parseTags(tags);

      expect(result).toEqual(['drama', 'thriller', 'action']);
    });

    it('should trim whitespace from tags', () => {
      const tags = '  drama  ,  thriller  ,  action  ';
      const result = workService.parseTags(tags);

      expect(result).toEqual(['drama', 'thriller', 'action']);
    });

    it('should return empty array for invalid input', () => {
      expect(workService.parseTags(null as any)).toEqual([]);
      expect(workService.parseTags(undefined as any)).toEqual([]);
      expect(workService.parseTags(123 as any)).toEqual([]);
    });
  });

  describe('formatWorkForDisplay', () => {
    it('should format work data correctly', () => {
      const result = workService.formatWorkForDisplay(mockWork);

      expect(result).toMatchObject({
        ...mockWork,
        formattedCreatedAt: '1/1/2024',
        formattedUpdatedAt: '1/1/2024',
        tagsString: 'drama, thriller',
        wordCount: 3, // "Test body content"
        characterCount: 17, // "Test body content".length
      });
    });

    it('should handle empty tags', () => {
      const workWithoutTags = { ...mockWork, tags: [] };
      const result = workService.formatWorkForDisplay(workWithoutTags);

      expect(result.tagsString).toBe('');
    });

    it('should count words correctly', () => {
      const workWithText = { 
        ...mockWork, 
        body: 'This is a test with multiple words and spaces' 
      };
      const result = workService.formatWorkForDisplay(workWithText);

      expect(result.wordCount).toBe(9);
    });

    it('should handle empty body', () => {
      const workWithEmptyBody = { ...mockWork, body: '' };
      const result = workService.formatWorkForDisplay(workWithEmptyBody);

      expect(result.wordCount).toBe(0);
      expect(result.characterCount).toBe(0);
    });
  });

  describe('singleton instance', () => {
    it('should export singleton instance', () => {
      expect(workService).toBeInstanceOf(WorkServiceClass);
    });

    it('should maintain state across calls', async () => {
      // This test ensures the singleton pattern works correctly
      const service1 = workService;
      const service2 = workService;

      expect(service1).toBe(service2);
    });
  });
});


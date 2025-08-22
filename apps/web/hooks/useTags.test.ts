import { renderHook, waitFor } from '@testing-library/react';
import { useTags } from './useTags';
import { workService } from '../lib/services/workService';

// Mock the workService
jest.mock('../lib/services/workService');
const mockedWorkService = workService as jest.Mocked<typeof workService>;

describe('useTags', () => {
  const mockTags = [
    { name: 'action', count: 3 },
    { name: 'drama', count: 2 },
    { name: 'thriller', count: 1 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch tags on mount', async () => {
    mockedWorkService.getAllTags.mockResolvedValue(mockTags);

    const { result } = renderHook(() => useTags());

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.tags).toEqual([]);
    expect(result.current.error).toBe(null);

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tags).toEqual(mockTags);
    expect(result.current.error).toBe(null);
    expect(mockedWorkService.getAllTags).toHaveBeenCalledTimes(1);
  });

  it('should handle empty tags array', async () => {
    mockedWorkService.getAllTags.mockResolvedValue([]);

    const { result } = renderHook(() => useTags());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tags).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('should handle fetch errors', async () => {
    const errorMessage = 'Failed to fetch tags';
    mockedWorkService.getAllTags.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useTags());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tags).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should handle refetch functionality', async () => {
    mockedWorkService.getAllTags.mockResolvedValue(mockTags);

    const { result } = renderHook(() => useTags());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Change mock to return different data
    const newTags = [{ name: 'comedy', count: 5 }];
    mockedWorkService.getAllTags.mockResolvedValue(newTags);

    // Call refetch
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.tags).toEqual(newTags);
    });

    expect(mockedWorkService.getAllTags).toHaveBeenCalledTimes(2);
  });

  it('should handle refetch errors', async () => {
    mockedWorkService.getAllTags.mockResolvedValue(mockTags);

    const { result } = renderHook(() => useTags());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Change mock to throw error
    const errorMessage = 'Refetch failed';
    mockedWorkService.getAllTags.mockRejectedValue(new Error(errorMessage));

    // Call refetch
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
    });

    // Tags should remain the same (not cleared on error)
    expect(result.current.tags).toEqual(mockTags);
  });
});

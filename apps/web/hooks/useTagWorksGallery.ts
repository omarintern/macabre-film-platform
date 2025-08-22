'use client';

import { useState, useEffect } from 'react';
import { workService, Work } from '../lib/services/workService';

interface UseTagWorksGalleryReturn {
  works: Work[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTagWorksGallery = (tagName: string, page: number = 1): UseTagWorksGalleryReturn => {
  const [works, setWorks] = useState<Work[]>([]);
  const [pagination, setPagination] = useState<UseTagWorksGalleryReturn['pagination']>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorks = async () => {
    // Validate inputs before making API call
    if (!tagName || tagName.trim() === '') {
      setError('Invalid tag name provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await workService.getWorksByTag(tagName.trim(), page);
      setWorks(result.works);
      setPagination({
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasNext: result.hasNext,
        hasPrev: result.hasPrev,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch works';
      setError(errorMessage);
      console.error('Error fetching works by tag:', err);
      
      // Clear data on error to prevent stale state
      setWorks([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tagName && tagName.trim()) {
      fetchWorks();
    } else {
      // Handle empty tag name case
      setWorks([]);
      setPagination(null);
      setError('Invalid tag name provided');
      setIsLoading(false);
    }
  }, [tagName, page]);

  return {
    works,
    pagination,
    isLoading,
    error,
    refetch: fetchWorks,
  };
};

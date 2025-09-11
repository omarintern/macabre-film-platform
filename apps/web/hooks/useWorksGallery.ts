import { useState, useEffect } from 'react';
import { workService, Work } from '../lib/services/workService';

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface UseWorksGalleryResult {
  works: Work[];
  pagination: PaginationInfo | null;
  isLoading: boolean;
  error: string | null;
}

export function useWorksGallery(page: number = 1, refreshTrigger?: number): UseWorksGalleryResult {
  const [works, setWorks] = useState<Work[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Use the workService instead of direct fetch
        const result = await workService.getAllWorks(page, 20);

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
        console.error('Error fetching works:', err);
        setError(err instanceof Error ? err.message : 'Failed to load works');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorks();
  }, [page, refreshTrigger]);

  return { works, pagination, isLoading, error };
}

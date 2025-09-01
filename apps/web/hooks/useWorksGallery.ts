import { useState, useEffect } from 'react';
import { Work } from '../lib/services/workService';

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

export function useWorksGallery(page: number = 1): UseWorksGalleryResult {
  const [works, setWorks] = useState<Work[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/works?page=${page}&limit=20`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('No works found');
          } else {
            setError('Failed to load works');
          }
          return;
        }

        const data = await response.json();

        if (data.success) {
          setWorks(data.works);
          setPagination(data.pagination);
        } else {
          setError('Failed to load works');
        }
      } catch (err) {
        console.error('Error fetching works:', err);
        setError('Failed to load works');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorks();
  }, [page]);

  return { works, pagination, isLoading, error };
}


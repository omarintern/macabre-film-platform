'use client';

import { useState, useEffect } from 'react';
import { workService, Tag } from '../lib/services/workService';

interface UseTagsReturn {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTags = (): UseTagsReturn => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTags = await workService.getAllTags();
      setTags(fetchedTags);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tags';
      setError(errorMessage);
      console.error('Error fetching tags:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return {
    tags,
    isLoading,
    error,
    refetch: fetchTags,
  };
};

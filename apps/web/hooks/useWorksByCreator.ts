import { useState, useEffect } from 'react';
import { Work } from '../lib/services/workService';

interface UseWorksByCreatorResult {
  works: Work[];
  isLoading: boolean;
  error: string | null;
}

export function useWorksByCreator(creatorId: string): UseWorksByCreatorResult {
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!creatorId) {
      setWorks([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetchWorks = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/works/by-creator/${creatorId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Creator not found');
          } else {
            setError('Failed to load works');
          }
          return;
        }

        const data = await response.json();
        
        if (data.success) {
          setWorks(data.works);
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
  }, [creatorId]);

  return { works, isLoading, error };
}

import { useState, useEffect } from 'react';
import { Work } from '../lib/services/workService';
import { firebaseDataService } from '../lib/firebase/dataService';

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

        console.log('🔍 Fetching works for creatorId:', creatorId);
        
        // Use Firebase service instead of API route
        const result = await firebaseDataService.getWorksByCreator(creatorId);
        console.log('📊 Found works:', result.works.length, result.works);
        
        // If no works found, let's also try to get all works to see what's in the database
        if (result.works.length === 0) {
          console.log('⚠️ No works found for this creator, checking all works...');
          const allWorks = await firebaseDataService.getAllWorks();
          console.log('📊 All works in database:', allWorks.works.length, allWorks.works);
          
          // Check if any works have this creatorId
          const worksForThisCreator = allWorks.works.filter(work => work.creatorId === creatorId);
          console.log('🎯 Works matching this creatorId:', worksForThisCreator);
          
          // Also check for any works that might have a different creatorId format
          const allCreatorIds = allWorks.works.map(work => work.creatorId);
          console.log('🔑 All creatorIds in database:', [...new Set(allCreatorIds)]);
        }
        
        setWorks(result.works);
      } catch (err) {
        console.error('❌ Error fetching works:', err);
        setError('Failed to load works');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorks();
  }, [creatorId]);

  return { works, isLoading, error };
}
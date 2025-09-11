import { useState, useEffect } from 'react';
import { realtimeService, RealtimeWork } from '../lib/firebase/realtimeService';

interface UseRealtimeWorksResult {
  realtimeWorks: RealtimeWork[];
  isConnected: boolean;
  error: string | null;
}

export function useRealtimeWorks(): UseRealtimeWorksResult {
  const [realtimeWorks, setRealtimeWorks] = useState<RealtimeWork[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    try {
      // Subscribe to real-time updates
      unsubscribe = realtimeService.subscribeToWorks((works) => {
        setRealtimeWorks(works);
        setIsConnected(true);
        setError(null);
      });
    } catch (err) {
      console.error('Error setting up real-time subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to real-time updates');
      setIsConnected(false);
    }

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return {
    realtimeWorks,
    isConnected,
    error
  };
}

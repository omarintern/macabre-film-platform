// Firebase Realtime Database service for live updates
import { realtimeDb } from './config';
import { ref, push, serverTimestamp, onValue, off } from 'firebase/database';
import { Work } from '../services/workService';

export interface RealtimeWork extends Omit<Work, 'createdAt' | 'updatedAt'> {
  timestamp: number; // Firebase server timestamp
  realtimeId?: string;
}

export const realtimeService = {
  /**
   * Broadcast a new work to all connected clients
   */
  async broadcastNewWork(work: Work): Promise<void> {
    try {
      const worksRef = ref(realtimeDb, 'works');
      
      const cleanWork = {
        id: work.id,
        title: work.title,
        body: work.body,
        classification: work.classification,
        tags: work.tags || [],
        creatorId: work.creatorId,
        creator: {
          id: work.creator?.id || work.creatorId,
          name: work.creator?.name || 'Unknown User',
          email: work.creator?.email || 'unknown@example.com'
        },
        timestamp: serverTimestamp()
      };
      
      console.log('🔥 Broadcasting work to Firebase Realtime DB:', cleanWork.title);
      
      // DON'T AWAIT - Make this non-blocking!
      push(worksRef, cleanWork).then(() => {
        console.log('✅ Work broadcast successful');
      }).catch((error) => {
        console.error('Error broadcasting work to Firebase:', error);
      });
      
    } catch (error) {
      console.error('Error broadcasting work to Firebase:', error);
      // Don't throw - real-time is optional, main app should continue
    }
  },

  /**
   * Subscribe to real-time work updates
   */
  subscribeToWorks(callback: (works: RealtimeWork[]) => void): () => void {
    const worksRef = ref(realtimeDb, 'works');
    
    const unsubscribe = onValue(worksRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const works: RealtimeWork[] = Object.entries(data).map(([key, value]) => ({
          ...(value as RealtimeWork),
          realtimeId: key
        }));
        
        // Sort by timestamp (newest first)
        works.sort((a, b) => {
          if (a.timestamp && b.timestamp) {
            return b.timestamp - a.timestamp;
          }
          return 0;
        });
        
        callback(works);
      } else {
        callback([]);
      }
    });

    // Return cleanup function
    return () => off(worksRef, 'value', unsubscribe);
  },

  /**
   * Clean up old real-time entries (optional maintenance)
   */
  async cleanupOldEntries(maxAge: number = 24 * 60 * 60 * 1000): Promise<void> {
    // Implementation for cleaning up old Firebase entries if needed
    // This would run periodically to prevent Firebase from growing too large
  }
};

// Firebase Data Service - Replaces Prisma entirely
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  startAfter,
  Timestamp,
  DocumentSnapshot,
  QuerySnapshot,
  updateDoc,
  deleteDoc,
  setDoc
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { db, auth } from './config';

// Types matching your existing interfaces
export interface User {
  id: string;
  name: string | null;
  bio: string | null;
  email: string;
  role: 'CREATOR' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface Work {
  id: string;
  title: string;
  body: string;
  classification: string;
  tags: string[];
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string | null;
    email: string;
  };
  // Story 2.6: Mosaic chain fields
  mosaicId?: string;
  mosaicPosition?: number;
  mosaicMetaTitle?: string;
  // Story 2.5: Connection fields (backward compatible)
  connectionType?: 'none' | 'mosaic' | 'reference';
  references?: Array<{
    postId: string;
    title: string;
    creatorName: string;
  }>;
}

export interface CreateWorkRequest {
  title: string;
  body: string;
  classification: string;
  tags: string[];
  // Story 2.6: Mosaic chain fields
  mosaicId?: string;
  mosaicPosition?: number;
  mosaicMetaTitle?: string;
  // Story 2.5: Connection fields (backward compatible)
  connectionType?: 'none' | 'mosaic' | 'reference';
  references?: Array<{
    postId: string;
    title: string;
    creatorName: string;
  }>;
}

export interface MosaicChain {
  id: string;
  metaTitle: string;
  creatorId: string;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMosaicChainRequest {
  metaTitle: string;
  creatorId: string;
}

export interface Tag {
  name: string;
  count: number;
}

// Firebase Data Service Class
class FirebaseDataService {
  // ==================== USER OPERATIONS ====================
  
  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) {
        return null;
      }
      
      const userData = userDoc.data();
      return {
        id: userDoc.id,
        name: userData.name || null,
        bio: userData.bio || null,
        email: userData.email,
        role: userData.role,
        createdAt: userData.createdAt.toDate().toISOString(),
        updatedAt: userData.updatedAt.toDate().toISOString()
      };
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  }

  /**
   * Create or update user profile
   */
  async createOrUpdateUser(userData: {
    id: string;
    name?: string;
    bio?: string;
    email: string;
    role: 'CREATOR' | 'ADMIN';
  }): Promise<User> {
    try {
      const userDoc = {
        name: userData.name || null,
        bio: userData.bio || null,
        email: userData.email,
        role: userData.role,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await setDoc(doc(db, 'users', userData.id), userDoc, { merge: true });
      
      return {
        id: userData.id,
        name: userData.name || null,
        bio: userData.bio || null,
        email: userData.email,
        role: userData.role,
        createdAt: userDoc.createdAt.toDate().toISOString(),
        updatedAt: userDoc.updatedAt.toDate().toISOString()
      };
    } catch (error) {
      console.error('Create or update user error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: {
    name?: string;
    bio?: string;
  }): Promise<void> {
    try {
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(doc(db, 'users', userId), updateData);
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  // ==================== WORK OPERATIONS ====================
  
  /**
   * Create a new work
   */
  async createWork(workData: CreateWorkRequest, creatorId: string): Promise<Work> {
    try {
      // Get creator info
      const creator = await this.getUserById(creatorId);
      if (!creator) {
        throw new Error('Creator not found');
      }
      
      const workDoc = {
        title: workData.title,
        body: workData.body,
        classification: workData.classification,
        tags: workData.tags,
        creatorId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        // Story 2.6: Mosaic chain fields
        ...(workData.mosaicId && { mosaicId: workData.mosaicId }),
        ...(workData.mosaicPosition && { mosaicPosition: workData.mosaicPosition }),
        ...(workData.mosaicMetaTitle && { mosaicMetaTitle: workData.mosaicMetaTitle }),
        // Story 2.5: Connection fields (backward compatible)
        ...(workData.connectionType && workData.connectionType !== 'none' && {
          connectionType: workData.connectionType,
        }),
        ...(workData.references && workData.references.length > 0 && {
          references: workData.references,
        }),
      };
      
      const docRef = await addDoc(collection(db, 'works'), workDoc);
      
      return {
        id: docRef.id,
        title: workData.title,
        body: workData.body,
        classification: workData.classification,
        tags: workData.tags,
        creatorId,
        createdAt: workDoc.createdAt.toDate().toISOString(),
        updatedAt: workDoc.updatedAt.toDate().toISOString(),
        creator: {
          id: creator.id,
          name: creator.name,
          email: creator.email
        },
        // Story 2.6: Mosaic chain fields
        ...(workData.mosaicId && { mosaicId: workData.mosaicId }),
        ...(workData.mosaicPosition && { mosaicPosition: workData.mosaicPosition }),
        ...(workData.mosaicMetaTitle && { mosaicMetaTitle: workData.mosaicMetaTitle }),
        // Story 2.5: Connection fields (backward compatible)
        ...(workData.connectionType && workData.connectionType !== 'none' && {
          connectionType: workData.connectionType,
        }),
        ...(workData.references && workData.references.length > 0 && {
          references: workData.references,
        }),
      };
    } catch (error) {
      console.error('Create work error:', error);
      throw error;
    }
  }

  /**
   * Get all works with pagination
   */
  async getAllWorks(page: number = 1, pageLimit: number = 20): Promise<{
    works: Work[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    try {
      const worksQuery = query(
        collection(db, 'works'),
        orderBy('createdAt', 'desc'),
        firestoreLimit(pageLimit)
      );
      
      const worksSnapshot = await getDocs(worksQuery);
      
      const works: Work[] = [];
      for (const doc of worksSnapshot.docs) {
        const data = doc.data();
        const creator = await this.getUserById(data.creatorId);
        
        works.push({
          id: doc.id,
          title: data.title,
          body: data.body,
          classification: data.classification,
          tags: data.tags,
          creatorId: data.creatorId,
          createdAt: data.createdAt.toDate().toISOString(),
          updatedAt: data.updatedAt.toDate().toISOString(),
          creator: {
            id: creator?.id || data.creatorId,
            name: creator?.name || 'Unknown',
            email: creator?.email || 'unknown@example.com'
          },
          // Story 2.6: Mosaic chain fields
          mosaicId: data.mosaicId,
          mosaicPosition: data.mosaicPosition,
          mosaicMetaTitle: data.mosaicMetaTitle,
          // Story 2.5: Connection fields (backward compatible)
          connectionType: data.connectionType,
          references: data.references,
        });
      }
      
      // Get total count
      const totalSnapshot = await getDocs(collection(db, 'works'));
      const total = totalSnapshot.size;
      const totalPages = Math.ceil(total / pageLimit);
      
      return {
        works,
        page,
        limit: pageLimit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      };
    } catch (error) {
      console.error('Get all works error:', error);
      throw error;
    }
  }

  /**
   * Get works by creator with pagination
   */
  async getWorksByCreator(creatorId: string, page: number = 1, pageLimit: number = 12): Promise<{
    works: Work[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    try {
      console.log('🔍 Firebase getWorksByCreator called with creatorId:', creatorId);
      
      const worksQuery = query(
        collection(db, 'works'),
        where('creatorId', '==', creatorId),
        orderBy('createdAt', 'desc'),
        firestoreLimit(pageLimit)
      );
      
      console.log('📊 Executing Firestore query for creatorId:', creatorId);
      const worksSnapshot = await getDocs(worksQuery);
      console.log('📊 Query returned', worksSnapshot.docs.length, 'documents');
      
      const creator = await this.getUserById(creatorId);
      console.log('👤 Creator info:', creator);
      
      const works: Work[] = worksSnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('📄 Processing work document:', doc.id, data);
        return {
          id: doc.id,
          title: data.title,
          body: data.body,
          classification: data.classification,
          tags: data.tags,
          creatorId: data.creatorId,
          createdAt: data.createdAt.toDate().toISOString(),
          updatedAt: data.updatedAt.toDate().toISOString(),
          creator: {
            id: creator?.id || creatorId,
            name: creator?.name || 'Unknown',
            email: creator?.email || 'unknown@example.com'
          },
          // Story 2.6: Mosaic chain fields
          ...(data.mosaicId && { mosaicId: data.mosaicId }),
          ...(data.mosaicPosition && { mosaicPosition: data.mosaicPosition }),
          ...(data.mosaicMetaTitle && { mosaicMetaTitle: data.mosaicMetaTitle }),
          // Story 2.5: Connection fields (backward compatible)
          ...(data.connectionType && { connectionType: data.connectionType }),
          ...(data.references && { references: data.references }),
        };
      });
      
      console.log('📊 Processed works:', works);
      
      // Get total count for this creator
      const totalSnapshot = await getDocs(query(
        collection(db, 'works'),
        where('creatorId', '==', creatorId)
      ));
      const total = totalSnapshot.size;
      const totalPages = Math.ceil(total / pageLimit);
      
      console.log('📊 Total works for creator:', total);
      
      return {
        works,
        page,
        limit: pageLimit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      };
    } catch (error) {
      console.error('❌ Get works by creator error:', error);
      throw error;
    }
  }

  /**
   * Get works by tag with pagination
   */
  async getWorksByTag(tagName: string, page: number = 1, pageLimit: number = 12): Promise<{
    works: Work[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    try {
      const worksQuery = query(
        collection(db, 'works'),
        where('tags', 'array-contains', tagName),
        orderBy('createdAt', 'desc'),
        firestoreLimit(pageLimit)
      );
      
      const worksSnapshot = await getDocs(worksQuery);
      
      const works: Work[] = [];
      for (const doc of worksSnapshot.docs) {
        const data = doc.data();
        const creator = await this.getUserById(data.creatorId);
        
        works.push({
          id: doc.id,
          title: data.title,
          body: data.body,
          classification: data.classification,
          tags: data.tags,
          creatorId: data.creatorId,
          createdAt: data.createdAt.toDate().toISOString(),
          updatedAt: data.updatedAt.toDate().toISOString(),
          creator: {
            id: creator?.id || data.creatorId,
            name: creator?.name || 'Unknown',
            email: creator?.email || 'unknown@example.com'
          },
          // Story 2.6: Mosaic chain fields
          ...(data.mosaicId && { mosaicId: data.mosaicId }),
          ...(data.mosaicPosition && { mosaicPosition: data.mosaicPosition }),
          ...(data.mosaicMetaTitle && { mosaicMetaTitle: data.mosaicMetaTitle }),
          // Story 2.5: Connection fields (backward compatible)
          ...(data.connectionType && { connectionType: data.connectionType }),
          ...(data.references && { references: data.references }),
        });
      }
      
      // Get total count for this tag
      const totalSnapshot = await getDocs(query(
        collection(db, 'works'),
        where('tags', 'array-contains', tagName)
      ));
      const total = totalSnapshot.size;
      const totalPages = Math.ceil(total / pageLimit);
      
      return {
        works,
        page,
        limit: pageLimit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      };
    } catch (error) {
      console.error('Get works by tag error:', error);
      throw error;
    }
  }

  // ==================== MOSAIC CHAIN OPERATIONS ====================
  
  /**
   * Create a new mosaic chain
   */
  async createMosaicChain(chainData: CreateMosaicChainRequest): Promise<MosaicChain> {
    try {
      const chainDoc = {
        metaTitle: chainData.metaTitle,
        creatorId: chainData.creatorId,
        postCount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, 'mosaicChains'), chainDoc);
      
      return {
        id: docRef.id,
        metaTitle: chainData.metaTitle,
        creatorId: chainData.creatorId,
        postCount: 0,
        createdAt: chainDoc.createdAt.toDate().toISOString(),
        updatedAt: chainDoc.updatedAt.toDate().toISOString()
      };
    } catch (error) {
      console.error('Create mosaic chain error:', error);
      throw error;
    }
  }

  /**
   * Get mosaic chains by creator
   */
  async getMosaicChainsByCreator(creatorId: string): Promise<MosaicChain[]> {
    try {
      console.log('🔍 Fetching mosaic chains for creator:', creatorId);
      
      const chainsQuery = query(
        collection(db, 'mosaicChains'),
        where('creatorId', '==', creatorId),
        orderBy('createdAt', 'desc')
      );
      
      const chainsSnapshot = await getDocs(chainsQuery);
      
      console.log('📊 Found mosaic chains:', chainsSnapshot.size);
      
      const chains = chainsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          metaTitle: data.metaTitle,
          creatorId: data.creatorId,
          postCount: data.postCount || 0,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString()
        };
      });
      
      console.log('📊 Processed mosaic chains:', chains);
      return chains;
    } catch (error) {
      console.error('❌ Error getting mosaic chains by creator:', error);
      
      // If it's a missing index error, return empty array instead of throwing
      if (error instanceof Error && error.message.includes('index')) {
        console.warn('⚠️ Firestore index missing for mosaic chains query, returning empty array');
        return [];
      }
      
      // For other errors, still throw but with more context
      throw new Error(`Failed to get mosaic chains: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get single mosaic chain by ID
   */
  async getMosaicChain(chainId: string): Promise<MosaicChain | null> {
    try {
      const chainDoc = await getDoc(doc(db, 'mosaicChains', chainId));
      
      if (!chainDoc.exists()) {
        return null;
      }
      
      const data = chainDoc.data();
      return {
        id: chainDoc.id,
        metaTitle: data.metaTitle,
        creatorId: data.creatorId,
        postCount: data.postCount || 0,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting mosaic chain:', error);
      throw new Error('Failed to get mosaic chain');
    }
  }

  /**
   * Update mosaic chain
   */
  async updateMosaicChain(chainId: string, updates: {
    metaTitle?: string;
    postCount?: number;
  }): Promise<void> {
    try {
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(doc(db, 'mosaicChains', chainId), updateData);
    } catch (error) {
      console.error('Error updating mosaic chain:', error);
      throw new Error('Failed to update mosaic chain');
    }
  }

  /**
   * Delete mosaic chain
   */
  async deleteMosaicChain(chainId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'mosaicChains', chainId));
    } catch (error) {
      console.error('Delete mosaic chain error:', error);
      throw error;
    }
  }

  /**
   * Update chain post count
   */
  async updateChainPostCount(chainId: string): Promise<void> {
    try {
      const worksQuery = query(
        collection(db, 'works'),
        where('mosaicId', '==', chainId)
      );
      
      const worksSnapshot = await getDocs(worksQuery);
      const postCount = worksSnapshot.size;
      
      await this.updateMosaicChain(chainId, { postCount });
    } catch (error) {
      console.error('Update chain post count error:', error);
      throw error;
    }
  }

  /**
   * Get works in a mosaic chain
   */
  async getWorksInChain(chainId: string): Promise<Work[]> {
    try {
      const worksQuery = query(
        collection(db, 'works'),
        where('mosaicId', '==', chainId),
        orderBy('mosaicPosition', 'asc')
      );
      
      const worksSnapshot = await getDocs(worksQuery);
      
      const works: Work[] = [];
      for (const doc of worksSnapshot.docs) {
        const data = doc.data();
        const creator = await this.getUserById(data.creatorId);
        
        works.push({
          id: doc.id,
          title: data.title,
          body: data.body,
          classification: data.classification,
          tags: data.tags,
          creatorId: data.creatorId,
          createdAt: data.createdAt.toDate().toISOString(),
          updatedAt: data.updatedAt.toDate().toISOString(),
          creator: {
            id: creator?.id || data.creatorId,
            name: creator?.name || 'Unknown',
            email: creator?.email || 'unknown@example.com'
          },
          // Story 2.6: Mosaic chain fields
          mosaicId: data.mosaicId,
          mosaicPosition: data.mosaicPosition,
          mosaicMetaTitle: data.mosaicMetaTitle
        });
      }
      
      return works;
    } catch (error) {
      console.error('Get works in chain error:', error);
      throw error;
    }
  }

  /**
   * Get all unique tags from works with their counts
   */
  async getAllTags(): Promise<Tag[]> {
    try {
      const worksRef = collection(db, 'works');
      const snapshot = await getDocs(worksRef);
      
      const tagCounts: { [key: string]: number } = {};
      
      snapshot.docs.forEach(doc => {
        const work = doc.data();
        if (work.tags && Array.isArray(work.tags)) {
          work.tags.forEach((tag: string) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      });
      
      return Object.entries(tagCounts).map(([name, count]) => ({
        name,
        count
      })).sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  }

  // ==================== AUTH OPERATIONS ====================
  
  /**
   * Create user with email and password
   */
  async createUser(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const firebaseDataService = new FirebaseDataService();
// Work service for API communication
// 100% Firebase Architecture - No more Prisma/API routes

import { firebaseDataService } from '../firebase/dataService';
import { realtimeService } from '../firebase/realtimeService';

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

export interface CreateWorkResponse {
  success: boolean;
  work: Work;
}

export interface GetWorksResponse {
  success: boolean;
  works: Work[];
}

export interface PaginatedWorksResponse {
  success: boolean;
  works: Work[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface Tag {
  name: string;
  count: number;
}

export interface TagsResponse {
  success: boolean;
  tags: Tag[];
}

export interface WorkServiceError {
  error: string;
}

class WorkServiceClass {
  /**
   * Create a new work - 100% Firebase
   */
  async createWork(workData: CreateWorkRequest, creatorId: string): Promise<Work> {
    try {
      let work: Work;

      // Handle mosaic chain creation
      if (workData.connectionType === 'mosaic' && workData.mosaicMetaTitle) {
        work = await this.createMosaicWork(workData, creatorId);
      } else {
        // Create regular work
        work = await firebaseDataService.createWork(workData, creatorId);
      }
      
      // Do real-time broadcast in background without blocking
      realtimeService.broadcastNewWork(work).catch(error => {
        console.log('Real-time broadcast failed (non-critical):', error);
      });
      
      console.log('✅ Work created successfully in Firebase:', work.title);
      return work;
    } catch (error) {
      console.error('Work creation error:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unexpected error occurred while creating the work');
    }
  }

  /**
   * Create a work as part of a mosaic chain
   */
  private async createMosaicWork(workData: CreateWorkRequest, creatorId: string): Promise<Work> {
    if (!workData.mosaicMetaTitle) {
      throw new Error('Meta-title is required for mosaic chains');
    }

    let chainId: string;
    let position: number;

    if (workData.mosaicId) {
      // Continue existing chain
      chainId = workData.mosaicId;
      
      // Get current chain to determine next position
      const chain = await firebaseDataService.getMosaicChain(chainId);
      if (!chain) {
        throw new Error('Parent chain not found');
      }
      position = chain.postCount + 1;
    } else {
      // Create new chain
      const newChain = await firebaseDataService.createMosaicChain({
        metaTitle: workData.mosaicMetaTitle,
        creatorId: creatorId
      });
      chainId = newChain.id;
      position = 1;
    }

    // Create work with chain information
    const workWithChain = {
      ...workData,
      mosaicId: chainId,
      mosaicPosition: position,
      mosaicMetaTitle: workData.mosaicMetaTitle
    };

    const work = await firebaseDataService.createWork(workWithChain, creatorId);

    // Update chain post count
    await firebaseDataService.updateChainPostCount(chainId);

    return work;
  }

  /**
   * Get all works for the current user - 100% Firebase
   */
  async getMyWorks(userId: string): Promise<Work[]> {
    try {
      const data = await firebaseDataService.getWorksByCreator(userId);
      return data.works;
    } catch (error) {
      console.error('Works retrieval error:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unexpected error occurred while retrieving works');
    }
  }

  /**
   * Get all works with pagination - 100% Firebase
   */
  async getAllWorks(page: number = 1, limit: number = 20): Promise<PaginatedWorksResponse['pagination'] & { works: Work[] }> {
    try {
      const data = await firebaseDataService.getAllWorks(page, limit);
      return {
        works: data.works,
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
        hasNext: data.hasNext,
        hasPrev: data.hasPrev,
        
      };
    } catch (error) {
      console.error('Works retrieval error:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unexpected error occurred while retrieving works');
    }
  }

  /**
   * Validate work data before submission
   */
  validateWorkData(workData: CreateWorkRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Title validation
    if (!workData.title?.trim()) {
      errors.push('Title is required');
    }

    // Body validation
    if (!workData.body?.trim()) {
      errors.push('Body is required');
    } else if (workData.body.length > 2000) {
      errors.push('Body must be 2000 characters or less');
    }

    // Classification validation
    if (!workData.classification?.trim()) {
      errors.push('Classification is required');
    } else {
      const validClassifications = ['Synopsis', 'Scene Description', 'Other'];
      if (!validClassifications.includes(workData.classification)) {
        errors.push('Classification must be Synopsis, Scene Description, or Other');
      }
    }

    // Tags validation (optional, but if provided should be an array)
    if (workData.tags && !Array.isArray(workData.tags)) {
      errors.push('Tags must be an array of strings');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Parse tags from various input formats
   */
  parseTags(input: string | string[]): string[] {
    if (Array.isArray(input)) {
      return input.filter(tag => typeof tag === 'string' && tag.trim()).map(tag => tag.trim());
    }
    
    if (typeof input === 'string') {
      return input
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
    }
    
    return [];
  }

  /**
   * Format work data for display
   */
  formatWorkForDisplay(work: Work) {
    return {
      ...work,
      formattedCreatedAt: new Date(work.createdAt).toLocaleDateString(),
      formattedUpdatedAt: new Date(work.updatedAt).toLocaleDateString(),
      tagsString: work.tags.join(', '),
      wordCount: work.body.split(/\s+/).filter(word => word).length,
      characterCount: work.body.length,
    };
  }

  /**
   * Get all unique tags with counts - 100% Firebase
   */
  async getAllTags(): Promise<Tag[]> {
    try {
      return await firebaseDataService.getAllTags();
    } catch (error) {
      console.error('Tags retrieval error:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unexpected error occurred while retrieving tags');
    }
  }

  /**
   * Get works filtered by tag with pagination
   */
  async getWorksByTag(tagName: string, page: number = 1, limit: number = 12): Promise<{
    works: Work[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    try {
      return await firebaseDataService.getWorksByTag(tagName, page, limit);
    } catch (error) {
      console.error('Tag works retrieval error:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unexpected error occurred while retrieving works by tag');
    }
  }

  /**
   * Get works by creator with pagination
   */
  async getWorksByCreator(userId: string, page: number = 1, limit: number = 12): Promise<{
    works: Work[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    try {
      return await firebaseDataService.getWorksByCreator(userId, page, limit);
    } catch (error) {
      console.error('Creator works retrieval error:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unexpected error occurred while retrieving works by creator');
    }
  }


}

// Export singleton instance
export const workService = new WorkServiceClass();

// Export class for testing
export { WorkServiceClass };
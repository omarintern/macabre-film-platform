// Work service for API communication

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
}

export interface CreateWorkRequest {
  title: string;
  body: string;
  classification: string;
  tags: string[];
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
  private baseUrl = '/api/works';

  /**
   * Create a new work
   */
  async createWork(workData: CreateWorkRequest): Promise<Work> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify(workData),
      });

      const data: CreateWorkResponse | WorkServiceError = await response.json();

      if (!response.ok) {
        const errorData = data as WorkServiceError;
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const successData = data as CreateWorkResponse;
      return successData.work;
    } catch (error) {
      console.error('Work creation error:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unexpected error occurred while creating the work');
    }
  }

  /**
   * Get all works for the current user
   */
  async getMyWorks(): Promise<Work[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
      });

      const data: GetWorksResponse | WorkServiceError = await response.json();

      if (!response.ok) {
        const errorData = data as WorkServiceError;
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const successData = data as GetWorksResponse;
      return successData.works;
    } catch (error) {
      console.error('Works retrieval error:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unexpected error occurred while retrieving works');
    }
  }

  /**
   * Get a specific work by ID
   */
  async getWorkById(id: string): Promise<Work> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data: { success: boolean; work: Work } | WorkServiceError = await response.json();

      if (!response.ok) {
        const errorData = data as WorkServiceError;
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const successData = data as { success: boolean; work: Work };
      return successData.work;
    } catch (error) {
      console.error('Work retrieval error:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unexpected error occurred while retrieving the work');
    }
  }

  /**
   * Get all works with pagination (public access)
   */
  async getAllWorks(page: number = 1, limit: number = 20): Promise<PaginatedWorksResponse['pagination'] & { works: Work[] }> {
    try {
      const response = await fetch(`${this.baseUrl}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // No credentials needed for public access
      });

      const data: PaginatedWorksResponse | WorkServiceError = await response.json();

      if (!response.ok) {
        const errorData = data as WorkServiceError;
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const successData = data as PaginatedWorksResponse;
      return {
        works: successData.works,
        ...successData.pagination,
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
    } else if (workData.body.length > 1000) {
      errors.push('Body must be 1000 characters or less');
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
   * Get all unique tags with counts
   */
  async getAllTags(): Promise<Tag[]> {
    try {
      const response = await fetch(`${this.baseUrl.replace('/works', '/tags')}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // No credentials needed for public access
      });

      const data: TagsResponse | WorkServiceError = await response.json();

      if (!response.ok) {
        const errorData = data as WorkServiceError;
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const successData = data as TagsResponse;
      return successData.tags;
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
      const encodedTagName = encodeURIComponent(tagName);
      const response = await fetch(`${this.baseUrl}/by-tag/${encodedTagName}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // No credentials needed for public access
      });

      const data: PaginatedWorksResponse | WorkServiceError = await response.json();

      if (!response.ok) {
        const errorData = data as WorkServiceError;
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const successData = data as PaginatedWorksResponse;
      return {
        works: successData.works,
        page: successData.pagination.page,
        limit: successData.pagination.limit,
        total: successData.pagination.total,
        totalPages: successData.pagination.totalPages,
        hasNext: successData.pagination.hasNext,
        hasPrev: successData.pagination.hasPrev,
      };
    } catch (error) {
      console.error('Tag works retrieval error:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unexpected error occurred while retrieving works by tag');
    }
  }
}

// Export singleton instance
export const workService = new WorkServiceClass();

// Export class for testing
export { WorkServiceClass };

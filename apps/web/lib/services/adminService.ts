interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface PromoteUserRequest {
  userIdentifier: string; // email or ID
  targetRole: 'CREATOR' | 'ADMIN';
}

interface PromoteUserResponse {
  success: boolean;
  user?: User;
  message?: string;
  error?: string;
}

interface SearchUserResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export const adminService = {
  /**
   * Promote a user to a higher role (CLIENT -> CREATOR or CREATOR -> ADMIN)
   */
  async promoteUser(userIdentifier: string, targetRole: 'CREATOR' | 'ADMIN'): Promise<PromoteUserResponse> {
    try {
      // Add timeout and improved error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('/api/admin/promote-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIdentifier: userIdentifier.trim(),
          targetRole,
        } as PromoteUserRequest),
        credentials: 'include', // Include httpOnly cookies
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data: PromoteUserResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to promote user');
      }

      return data;
    } catch (error) {
      console.error('Admin service - promote user error:', error);
      
      // Handle specific error types
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout - please try again',
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  /**
   * Search for a user by email or ID
   */
  async searchUser(userIdentifier: string): Promise<SearchUserResponse> {
    try {
      const isEmail = userIdentifier.includes('@');
      const endpoint = isEmail 
        ? `/api/admin/users/search?email=${encodeURIComponent(userIdentifier)}`
        : `/api/admin/users/search?id=${encodeURIComponent(userIdentifier)}`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include httpOnly cookies
      });

      const data: SearchUserResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search user');
      }

      return data;
    } catch (error) {
      console.error('Admin service - search user error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  /**
   * Get all users with pagination (for admin dashboard)
   */
  async getAllUsers(page: number = 1, limit: number = 10): Promise<{
    success: boolean;
    users?: User[];
    total?: number;
    error?: string;
  }> {
    try {
      const response = await fetch(`/api/admin/users?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include httpOnly cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }

      return data;
    } catch (error) {
      console.error('Admin service - get all users error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
};

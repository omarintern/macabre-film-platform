// Admin service for API communication
// Architecture-compliant version using centralized apiClient

import apiClient from '../apiClient';

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
      const data = await apiClient.post<PromoteUserResponse>('/admin/promote-user', {
        userIdentifier: userIdentifier.trim(),
        targetRole,
      });
      
      return data;
    } catch (error) {
      console.error('Admin service - promote user error:', error);
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
        ? `/admin/users/search?email=${encodeURIComponent(userIdentifier)}`
        : `/admin/users/search?id=${encodeURIComponent(userIdentifier)}`;

      const data = await apiClient.get<SearchUserResponse>(endpoint);
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
      const data = await apiClient.get<{
        success: boolean;
        users?: User[];
        total?: number;
        error?: string;
      }>(`/admin/users?page=${page}&limit=${limit}`);

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
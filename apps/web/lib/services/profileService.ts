// Profile service for API communication
// Architecture-compliant version using centralized apiClient

import apiClient from '../apiClient';

interface User {
  id: string;
  email: string;
  role: 'CLIENT' | 'CREATOR' | 'ADMIN';
  name?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

interface PublicProfile {
  id: string;
  name?: string;
  bio?: string;
  role: 'CLIENT' | 'CREATOR' | 'ADMIN';
  createdAt: string;
}

interface UpdateProfileData {
  name?: string;
  bio?: string;
}

class ProfileService {
  async updateProfile(profileData: UpdateProfileData): Promise<User> {
    try {
      const response = await apiClient.put<{ success: boolean; user: User }>('/profile', profileData);
      return response.user;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  async getPublicProfile(userId: string): Promise<PublicProfile> {
    try {
      const response = await apiClient.get<{ success: boolean; profile: PublicProfile }>(`/profile/${userId}`);
      return response.profile;
    } catch (error) {
      console.error('Profile retrieval error:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();
export type { User, PublicProfile, UpdateProfileData };
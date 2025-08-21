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
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  }

  async updateProfile(profileData: UpdateProfileData): Promise<User> {
    const response = await this.request<{ success: boolean; user: User }>('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });

    return response.user;
  }

  async getPublicProfile(userId: string): Promise<PublicProfile> {
    const response = await this.request<{ success: boolean; profile: PublicProfile }>(
      `/api/profile/${userId}`
    );

    return response.profile;
  }
}

export const profileService = new ProfileService();
export type { User, PublicProfile, UpdateProfileData };

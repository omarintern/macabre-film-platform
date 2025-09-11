// Auth service for API communication
// Architecture-compliant version using centralized apiClient

import apiClient from '../apiClient';
import { User, useUserSessionStore } from '../../stores/userSessionStore';

interface SignupRequest {
  email: string;
  password: string;
}

interface SignupResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
  error?: string;
}

interface LogoutResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const authService = {
  async signup(data: SignupRequest): Promise<SignupResponse> {
    try {
      const result = await apiClient.post<SignupResponse>('/auth/signup', data);
      return result;
    } catch (error) {
      console.error('Signup request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error. Please check your connection and try again.',
      };
    }
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const result = await apiClient.post<LoginResponse>('/auth/login', data);
      
      if (result.success && result.user && result.token) {
        // Update user session store on successful login
        const { setUserSession } = useUserSessionStore.getState();
        setUserSession(result.user, result.token);
      }
      
      return result;
    } catch (error) {
      console.error('Login request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error. Please check your connection and try again.',
      };
    }
  },

  async logout(): Promise<LogoutResponse> {
    try {
      const result = await apiClient.post<LogoutResponse>('/auth/logout');
      
      if (result.success) {
        // Clear user session store on successful logout
        const { clearUserSession } = useUserSessionStore.getState();
        clearUserSession();
      }
      
      return result;
    } catch (error) {
      console.error('Logout request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error. Please check your connection and try again.',
      };
    }
  },

  // Helper method to get current user token from cookies or storage
  getCurrentToken(): string | null {
    const { token } = useUserSessionStore.getState();
    return token;
  },

  // Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    const { isAuthenticated } = useUserSessionStore.getState();
    return isAuthenticated;
  },
};
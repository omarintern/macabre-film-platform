import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  role: 'CLIENT' | 'CREATOR' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

interface UserSessionState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUserSession: (user: User, token: string) => void;
  clearUserSession: () => void;
}

export const useUserSessionStore = create<UserSessionState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setUserSession: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
      
      clearUserSession: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'user-session-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Helper hook for checking authentication status
export const useAuth = () => {
  const { isAuthenticated, user } = useUserSessionStore();
  return {
    isAuthenticated,
    user,
    isLoading: false, // Simplified - remove loading state for now
  };
};

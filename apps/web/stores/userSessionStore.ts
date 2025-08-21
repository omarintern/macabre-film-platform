import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  role: 'CLIENT' | 'CREATOR' | 'ADMIN';
  name?: string;
  bio?: string;
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

// Helper hook for checking authentication status with hydration support
export const useAuth = () => {
  const { isAuthenticated, user } = useUserSessionStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // This effect runs only on the client side after hydration
    setIsHydrated(true);
  }, []);

  // During SSR and before hydration, return safe defaults
  if (!isHydrated) {
    return {
      isAuthenticated: false,
      user: null,
      isLoading: true,
    };
  }

  // After hydration, return the actual store values
  return {
    isAuthenticated,
    user,
    isLoading: false,
  };
};

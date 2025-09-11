import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useState } from 'react';
import { firebaseAuthService } from '../lib/firebase/authService';

export interface User {
  id: string;
  email: string;
  role: 'CREATOR' | 'ADMIN';
  name: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UserSessionState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUserSession: (user: User, token: string) => void;
  clearUserSession: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuth: () => void;
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
      
      signIn: async (email: string, password: string) => {
        try {
          const { user, token } = await firebaseAuthService.signIn({ email, password });
          set({
            user,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Sign in error:', error);
          throw error;
        }
      },
      
      signUp: async (name: string, email: string, password: string) => {
        try {
          const { user, token } = await firebaseAuthService.signUp({ name, email, password });
          set({
            user,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Sign up error:', error);
          throw error;
        }
      },
      
      signOut: async () => {
        try {
          await firebaseAuthService.signOut();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        } catch (error) {
          console.error('Sign out error:', error);
          throw error;
        }
      },
      
      initializeAuth: () => {
        // Listen to Firebase auth state changes
        firebaseAuthService.onAuthStateChanged((user) => {
          if (user) {
            set({
              user,
              token: null, // Firebase handles tokens internally
              isAuthenticated: true,
            });
          } else {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
            });
          }
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
  const { isAuthenticated, user, initializeAuth, signIn, signUp, signOut } = useUserSessionStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // This effect runs only on the client side after hydration
    setIsHydrated(true);
    
    // Initialize Firebase auth listener
    initializeAuth();
  }, [initializeAuth]);

  // During SSR and before hydration, return safe defaults
  if (!isHydrated) {
    return {
      isAuthenticated: false,
      user: null,
      isLoading: true,
      signIn: async () => {},
      signUp: async () => {},
      signOut: async () => {},
    };
  }

  // After hydration, return the actual store values
  return {
    isAuthenticated,
    user,
    isLoading: false,
    signIn,
    signUp,
    signOut,
  };
};

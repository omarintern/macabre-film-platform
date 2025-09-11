// Firebase Auth Service - Replaces all JWT/Prisma auth
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  Timestamp,
  query,
  collection,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from './config';

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: 'CREATOR' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

class FirebaseAuthService {
  /**
   * Sign up new user
   */
  async signUp({ name, email, password }: SignUpRequest): Promise<{ user: User; token: string }> {
    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Create user profile in Firestore
      const userData = {
        name,
        email,
        role: 'CREATOR' as const,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      
      // Get ID token
      const token = await firebaseUser.getIdToken();
      
      return {
        user: {
          id: firebaseUser.uid,
          name,
          email,
          role: 'CREATOR',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        token
      };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }
  
  /**
   * Sign in existing user
   */
  async signIn({ email, password }: SignInRequest): Promise<{ user: User; token: string }> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }
      
      const userData = userDoc.data();
      const token = await firebaseUser.getIdToken();
      
      return {
        user: {
          id: firebaseUser.uid,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          createdAt: userData.createdAt.toDate().toISOString(),
          updatedAt: userData.updatedAt.toDate().toISOString()
        },
        token
      };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }
  
  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }
  
  /**
   * Get current user from Firestore
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return null;
      
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) return null;
      
      const userData = userDoc.data();
      return {
        id: firebaseUser.uid,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: userData.createdAt.toDate().toISOString(),
        updatedAt: userData.updatedAt.toDate().toISOString()
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }
  
  /**
   * Listen to auth state changes
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            callback({
              id: firebaseUser.uid,
              name: userData.name,
              email: userData.email,
              role: userData.role,
              createdAt: userData.createdAt.toDate().toISOString(),
              updatedAt: userData.updatedAt.toDate().toISOString()
            });
          } else {
            callback(null);
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }
  
  /**
   * Create initial admin user (bootstrap)
   */
  async createInitialAdmin(email: string, password: string, name: string): Promise<User> {
    try {
      // Check if any admin exists
      const adminQuery = query(collection(db, 'users'), where('role', '==', 'ADMIN'));
      const adminSnapshot = await getDocs(adminQuery);
      
      if (adminSnapshot.size > 0) {
        throw new Error('Admin user already exists');
      }
      
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Create admin profile in Firestore
      const userData = {
        name,
        email,
        role: 'ADMIN' as const,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      
      return {
        id: firebaseUser.uid,
        name,
        email,
        role: 'ADMIN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Create initial admin error:', error);
      throw error;
    }
  }
  
  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) return null;
      
      const userData = userDoc.data();
      return {
        id: userId,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: userData.createdAt.toDate().toISOString(),
        updatedAt: userData.updatedAt.toDate().toISOString()
      };
    } catch (error) {
      console.error('Get user by ID error:', error);
      return null;
    }
  }
}

// Export singleton instance
export const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;

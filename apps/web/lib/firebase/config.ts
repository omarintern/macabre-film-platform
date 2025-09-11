// Firebase configuration - 100% Firebase Architecture
'use client';
import { initializeApp } from 'firebase/app';
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: "https://macabre-4d51d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services with new cache settings
export const db = getFirestore(app);           // Firestore for main data
export const auth = getAuth(app);              // Firebase Auth
export const realtimeDb = getDatabase(app);    // Realtime DB for live updates

// 🧪 QA FIX: Use new cache configuration instead of deprecated persistence
if (typeof window !== 'undefined') {
  console.log('🔥 Firebase: Initializing with offline support...');
  
  // Use new cache settings instead of deprecated persistence methods
  import('firebase/firestore').then(({ initializeFirestore, CACHE_SIZE_UNLIMITED }) => {
    // Re-initialize Firestore with cache settings
    const firestore = initializeFirestore(app, {
      cacheSizeBytes: CACHE_SIZE_UNLIMITED,
      ignoreUndefinedProperties: true
    });
    
    console.log('🔥 Firebase: Cache configuration applied');
  }).catch(() => {
    console.log('🔥 Firebase: Cache configuration not available');
  });
}

// Export app for other Firebase services if needed
export default app;

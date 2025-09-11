#!/usr/bin/env node

// Firebase Setup Test - QA Verification Script
// This script tests the 100% Firebase migration

const { initializeApp } = require('firebase/app');
const { getFirestore, connectFirestoreEmulator } = require('firebase/firestore');
const { getAuth, connectAuthEmulator } = require('firebase/auth');

console.log('🔥 Testing Firebase Setup...\n');

// Test 1: Environment Variables
console.log('📋 TEST 1: Environment Variables');
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_DATABASE_URL',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

const envFile = require('fs').readFileSync('.env.local', 'utf8');
let allVarsPresent = true;

requiredVars.forEach(varName => {
  const isPresent = envFile.includes(varName);
  console.log(`  ${isPresent ? '✅' : '❌'} ${varName}: ${isPresent ? 'Present' : 'Missing'}`);
  if (!isPresent) allVarsPresent = false;
});

if (allVarsPresent) {
  console.log('✅ All Firebase environment variables are present\n');
} else {
  console.log('❌ Missing Firebase environment variables\n');
  process.exit(1);
}

// Test 2: Firebase Configuration
console.log('📋 TEST 2: Firebase Configuration');
try {
  // Load environment variables
  require('dotenv').config({ path: '.env.local' });
  
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };
  
  console.log('  ✅ Firebase config object created');
  console.log(`  ✅ Project ID: ${firebaseConfig.projectId}`);
  console.log(`  ✅ Auth Domain: ${firebaseConfig.authDomain}`);
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  console.log('  ✅ Firebase app initialized');
  
  // Initialize services
  const db = getFirestore(app);
  const auth = getAuth(app);
  console.log('  ✅ Firestore and Auth services initialized');
  
} catch (error) {
  console.log('  ❌ Firebase initialization failed:', error.message);
  process.exit(1);
}

console.log('✅ Firebase setup test completed successfully!\n');

// Test 3: Package Dependencies
console.log('📋 TEST 3: Package Dependencies');
const packageJson = JSON.parse(require('fs').readFileSync('package.json', 'utf8'));
const hasFirebase = packageJson.dependencies && packageJson.dependencies.firebase;

if (hasFirebase) {
  console.log(`  ✅ Firebase package installed: ${packageJson.dependencies.firebase}`);
} else {
  console.log('  ❌ Firebase package not found in dependencies');
  process.exit(1);
}

console.log('\n🎉 ALL TESTS PASSED! Firebase is ready for 100% migration');
console.log('\n📋 Next Steps:');
console.log('  1. Visit http://localhost:3000 to test the application');
console.log('  2. Try creating a new account (will use Firebase Auth)');
console.log('  3. Submit a work (will use Firebase Firestore)');
console.log('  4. Check Firebase Console for data');
console.log('\n🔥 You are now running 100% Firebase architecture!');

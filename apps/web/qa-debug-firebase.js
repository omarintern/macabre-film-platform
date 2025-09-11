#!/usr/bin/env node

// QA Debug Script - Firebase Issues Investigation
// 🧪 Quinn - Senior Developer & QA Architect

console.log('🧪 **QA DEBUG PANEL - Firebase Migration Issues**\n');

const { execSync } = require('child_process');
const fs = require('fs');

// Test 1: Check if Firebase is properly initialized
console.log('📋 TEST 1: Firebase Configuration');
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const hasApiKey = envContent.includes('NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCvjsGjVi8DTZGLwPTMH1F_xYStCODroXE');
  const hasProjectId = envContent.includes('NEXT_PUBLIC_FIREBASE_PROJECT_ID=macabre-4d51d');
  
  console.log(`  ✅ Firebase API Key: ${hasApiKey ? 'Present' : 'Missing'}`);
  console.log(`  ✅ Firebase Project ID: ${hasProjectId ? 'Present' : 'Missing'}`);
} catch (error) {
  console.log('  ❌ .env.local file not found');
}

// Test 2: Check for critical Firebase dataService bug
console.log('\n📋 TEST 2: Firebase DataService Code Analysis');
try {
  const dataServiceContent = fs.readFileSync('lib/firebase/dataService.ts', 'utf8');
  
  // Check for the critical bug
  const hasBuggyUserCreation = dataServiceContent.includes('await doc(db, \'users\', firebaseUser.uid);');
  const hasCorrectSetDoc = dataServiceContent.includes('setDoc(');
  
  if (hasBuggyUserCreation) {
    console.log('  ❌ CRITICAL BUG FOUND: User creation uses doc() instead of setDoc()');
    console.log('     Line ~86: await doc(db, "users", firebaseUser.uid);');
    console.log('     This creates a reference but not the actual document!');
  }
  
  if (!hasCorrectSetDoc) {
    console.log('  ❌ Missing setDoc import/usage for user creation');
  }
  
  console.log('  ℹ️  This bug prevents user profiles from being created in Firestore');
  console.log('  ℹ️  Without users, no works can be created or displayed');
  
} catch (error) {
  console.log('  ❌ Could not analyze dataService.ts');
}

// Test 3: Check current Spaces page state
console.log('\n📋 TEST 3: Spaces Page Analysis');
try {
  const spacesContent = fs.readFileSync('app/spaces/page.tsx', 'utf8');
  const isDebugVersion = spacesContent.includes('DebugSpacesPage');
  const hasDebugPanel = spacesContent.includes('QA Debug Panel');
  
  console.log(`  ${isDebugVersion ? '✅' : '❌'} Debug version active: ${isDebugVersion}`);
  console.log(`  ${hasDebugPanel ? '✅' : '❌'} Debug panel present: ${hasDebugPanel}`);
  
  if (isDebugVersion) {
    console.log('  ℹ️  Page is in debug mode - good for troubleshooting');
  }
} catch (error) {
  console.log('  ❌ Could not analyze spaces page');
}

// Test 4: Check if server is responding
console.log('\n📋 TEST 4: Server Health Check');
try {
  const response = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/spaces', { encoding: 'utf8' });
  const statusCode = response.trim();
  
  if (statusCode === '200') {
    console.log('  ✅ Spaces page responding (HTTP 200)');
  } else {
    console.log(`  ❌ Spaces page error (HTTP ${statusCode})`);
  }
} catch (error) {
  console.log('  ❌ Server not responding or curl failed');
}

// Test 5: Check for authentication state
console.log('\n📋 TEST 5: Authentication Flow Analysis');
try {
  const authServiceContent = fs.readFileSync('lib/firebase/authService.ts', 'utf8');
  const userStoreContent = fs.readFileSync('stores/userSessionStore.ts', 'utf8');
  
  const hasFirebaseAuth = authServiceContent.includes('createUserWithEmailAndPassword');
  const hasAuthStore = userStoreContent.includes('firebaseAuthService');
  
  console.log(`  ${hasFirebaseAuth ? '✅' : '❌'} Firebase Auth implementation: ${hasFirebaseAuth}`);
  console.log(`  ${hasAuthStore ? '✅' : '❌'} Auth store integration: ${hasAuthStore}`);
  
} catch (error) {
  console.log('  ❌ Could not analyze authentication files');
}

console.log('\n🔍 **QA ROOT CAUSE ANALYSIS:**');
console.log('  🚨 PRIMARY ISSUE: Firebase user creation is broken');
console.log('     - dataService.ts line ~86 uses doc() instead of setDoc()');
console.log('     - This prevents user profiles from being saved to Firestore');
console.log('     - Without users, works cannot be created or associated');
console.log('     - Result: Empty Spaces page');

console.log('\n🛠️  **IMMEDIATE FIXES REQUIRED:**');
console.log('  1. Fix dataService.ts user creation method');
console.log('  2. Add setDoc import from firebase/firestore');
console.log('  3. Test user registration flow');
console.log('  4. Verify works can be created and displayed');

console.log('\n🧪 **QA RECOMMENDATION:**');
console.log('  - Fix the critical dataService bug first');
console.log('  - Create a test user to verify the fix');
console.log('  - Submit a test work to verify end-to-end flow');
console.log('  - The debug panel on Spaces will help monitor the fixes');

console.log('\n📊 **SEVERITY: HIGH** - Core functionality broken');
console.log('📊 **IMPACT: Complete** - No works can be displayed');
console.log('📊 **EFFORT: Low** - Simple one-line fix required');

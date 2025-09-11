#!/usr/bin/env node
// QA Debug Script: Diagnose submission display issues

console.log('🧪 QA: Debugging submission display issues...\n');

// Check if .env.local exists and has Firebase config
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');

console.log('1. Checking environment file...');
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local exists');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const firebaseVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_DATABASE_URL',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
  ];
  
  firebaseVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`✅ ${varName} found in .env.local`);
    } else {
      console.log(`❌ ${varName} missing from .env.local`);
    }
  });
} else {
  console.log('❌ .env.local does not exist');
}

console.log('\n2. Checking database file...');
const dbPath = path.join(__dirname, 'prisma', 'dev.db');
if (fs.existsSync(dbPath)) {
  const stats = fs.statSync(dbPath);
  console.log(`✅ Database exists (${stats.size} bytes, modified: ${stats.mtime})`);
} else {
  console.log('❌ Database file does not exist');
}

console.log('\n3. Testing API endpoint...');
console.log('🔍 You can test manually:');
console.log('   curl -X GET "http://localhost:3000/api/works?page=1&limit=5"');

console.log('\n4. Checking Firebase config...');
console.log('🔍 Open browser console and check for Firebase errors');
console.log('   Go to: http://localhost:3000/spaces');
console.log('   Open DevTools > Console');
console.log('   Look for Firebase initialization errors');

console.log('\n🧪 QA: Debug script complete. Check the items above!');

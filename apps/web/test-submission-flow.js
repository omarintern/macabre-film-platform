#!/usr/bin/env node
// QA Test Script: Test the complete submission flow

const http = require('http');
const https = require('https');

console.log('🧪 QA: Testing complete submission flow...\n');

// Test 1: Check if API returns existing works
async function testGetWorks() {
  console.log('1. Testing GET /api/works...');
  
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3000/api/works?page=1&limit=10', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log(`✅ API Response: ${result.works.length} works found`);
          console.log(`   Total in DB: ${result.pagination.total}`);
          result.works.forEach((work, i) => {
            console.log(`   ${i+1}. "${work.title}" (${work.id.slice(-8)})`);
          });
          resolve(result);
        } catch (error) {
          console.log('❌ Failed to parse API response');
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ API request failed:', error.message);
      reject(error);
    });
  });
}

// Test 2: Test Firebase config
async function testFirebaseConfig() {
  console.log('\n2. Testing Firebase configuration...');
  
  const fs = require('fs');
  const envContent = fs.readFileSync('.env.local', 'utf8');
  
  const firebaseUrl = envContent.match(/NEXT_PUBLIC_FIREBASE_DATABASE_URL=(.+)/);
  if (firebaseUrl) {
    const url = firebaseUrl[1].trim();
    console.log(`✅ Firebase URL: ${url}`);
    
    // Test if Firebase is reachable
    try {
      const testUrl = url.replace('https://', '').replace('http://', '');
      console.log(`🔍 Testing Firebase connectivity to: ${testUrl}`);
      
      return new Promise((resolve) => {
        const req = https.get(`https://${testUrl}/.json`, (res) => {
          console.log(`✅ Firebase responds with status: ${res.statusCode}`);
          resolve(true);
        });
        
        req.on('error', (error) => {
          console.log(`❌ Firebase connection failed: ${error.message}`);
          resolve(false);
        });
        
        req.setTimeout(5000, () => {
          console.log('❌ Firebase connection timeout');
          req.destroy();
          resolve(false);
        });
      });
    } catch (error) {
      console.log('❌ Firebase test failed:', error.message);
      return false;
    }
  } else {
    console.log('❌ Firebase URL not found in .env.local');
    return false;
  }
}

// Test 3: Check if workService is working
async function testWorkService() {
  console.log('\n3. Testing workService...');
  
  // This would need to be run in browser context, so we'll just check the file
  const fs = require('fs');
  const workServicePath = 'lib/services/workService.ts';
  
  if (fs.existsSync(workServicePath)) {
    console.log('✅ workService.ts exists');
    const content = fs.readFileSync(workServicePath, 'utf8');
    
    if (content.includes('getAllWorks')) {
      console.log('✅ getAllWorks method found');
    } else {
      console.log('❌ getAllWorks method missing');
    }
    
    if (content.includes('realtimeService.broadcastNewWork')) {
      console.log('✅ Firebase broadcast integration found');
    } else {
      console.log('❌ Firebase broadcast integration missing');
    }
  } else {
    console.log('❌ workService.ts not found');
  }
}

// Run all tests
async function runTests() {
  try {
    await testGetWorks();
    await testFirebaseConfig();
    await testWorkService();
    
    console.log('\n🧪 QA RECOMMENDATIONS:');
    console.log('1. The API is working correctly and has data');
    console.log('2. Check browser console for Firebase errors');
    console.log('3. Check if useWorksGallery hook is re-fetching');
    console.log('4. Verify React state updates are triggering re-renders');
    
    console.log('\n🔍 NEXT STEPS:');
    console.log('1. Open browser DevTools');
    console.log('2. Go to http://localhost:3000/spaces');
    console.log('3. Check Console for errors');
    console.log('4. Check Network tab during submission');
    
  } catch (error) {
    console.log('\n❌ Test failed:', error.message);
  }
}

runTests();

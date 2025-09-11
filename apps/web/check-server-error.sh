#!/bin/bash

echo "🧪 QA: Diagnosing Internal Server Error"
echo "========================================"

echo ""
echo "1. Checking for missing environment variables..."
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file is missing!"
    echo "   This will cause Firebase initialization to fail"
else
    echo "✅ .env.local file exists"
    echo "   Checking if environment variables are set..."
    source .env.local
    if [ -z "$NEXT_PUBLIC_FIREBASE_API_KEY" ]; then
        echo "❌ Firebase API key is missing"
    else
        echo "✅ Firebase configuration appears to be set"
    fi
fi

echo ""
echo "2. Checking for Prisma imports that might crash server..."
echo "   Searching for remaining Prisma references..."
grep -r "PrismaClient\|prisma\." app/ lib/ 2>/dev/null | head -5

echo ""
echo "3. Checking Next.js compilation..."
echo "   Looking for TypeScript errors..."
npx tsc --noEmit 2>&1 | head -10

echo ""
echo "4. Testing Firebase connection..."
node -e "
try {
  require('./lib/firebase/config.ts');
  console.log('✅ Firebase config loads successfully');
} catch (error) {
  console.log('❌ Firebase config error:', error.message);
}
" 2>/dev/null || echo "❌ Cannot test Firebase config (TypeScript)"

echo ""
echo "🧪 QA RECOMMENDATION:"
echo "Most likely causes of internal server error:"
echo "1. Missing .env.local file"
echo "2. Prisma imports in API routes"  
echo "3. TypeScript compilation errors"
echo "4. Firebase initialization failure"

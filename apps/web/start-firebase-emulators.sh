#!/bin/bash

# QA Firebase Emulator Setup Script
# 🧪 Quinn - Senior Developer & QA Architect

echo "🧪 **QA: Starting Firebase Emulators for Local Development**"
echo ""

# Check if firebase-tools is installed
if ! command -v npx firebase &> /dev/null; then
    echo "❌ Firebase tools not found. Installing..."
    npm install -g firebase-tools
fi

echo "🔥 Starting Firebase Emulators..."
echo "   - Auth Emulator: http://localhost:9099"
echo "   - Firestore Emulator: http://localhost:8080"
echo "   - Realtime DB Emulator: http://localhost:9000"
echo "   - Emulator UI: http://localhost:4000"
echo ""

echo "🎯 **QA TESTING INSTRUCTIONS:**"
echo "   1. Keep this terminal open (emulators running)"
echo "   2. In another terminal: npm run dev"
echo "   3. Visit http://localhost:3000/signup"
echo "   4. Create a test account (works locally now!)"
echo "   5. Login and test work submission"
echo ""

echo "🧪 **Starting Emulators...**"
echo ""

# Start Firebase emulators
npx firebase emulators:start --project=macabre-4d51d

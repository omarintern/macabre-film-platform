#!/bin/bash

echo "🧪 **QA: Manual Firebase Emulator Startup**"
echo ""
echo "🔥 Starting Firebase Emulators..."
echo "   - Auth: http://localhost:9099"  
echo "   - Firestore: http://localhost:8080"
echo "   - Realtime DB: http://localhost:9000"
echo "   - UI Dashboard: http://localhost:4000"
echo ""
echo "⏳ This will take 10-15 seconds to start..."
echo ""

cd /Users/omarrumaihi/Desktop/Film-BMAD/macabre/apps/web

# Check if firebase tools is available
if ! npx firebase --version > /dev/null 2>&1; then
    echo "❌ Firebase tools not found. Please run:"
    echo "   npm install -g firebase-tools"
    exit 1
fi

# Start emulators
echo "🚀 Executing: npx firebase emulators:start --project=macabre-4d51d"
echo ""
npx firebase emulators:start --project=macabre-4d51d

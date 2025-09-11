#!/bin/bash
# QA Script: Create .env.local file
# Run this script to create the missing environment file

echo "🧪 QA: Creating .env.local file..."

cat > .env.local << 'EOF'
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret
JWT_SECRET="dev-secret-key-change-for-production-2024"

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCvjsGjVi8DTZGLwPTMH1F_xYStCODroXE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=macabre-4d51d.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://macabre-4d51d-default-rtdb.firebaseio.com/
NEXT_PUBLIC_FIREBASE_PROJECT_ID=macabre-4d51d
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=macabre-4d51d.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=60338412372
NEXT_PUBLIC_FIREBASE_APP_ID=1:60338412372:web:5c854d04a5503687cb06c1
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-GCZ0CE4M90

# Development
NODE_ENV=development
EOF

echo "✅ QA: .env.local file created successfully!"
echo "🚀 QA: Now restart your development server to load the new environment variables"

#!/bin/bash

# 🧪 QA: Create Missing .env.local File
echo "🔧 Creating .env.local file with Firebase configuration..."

cat > .env.local << 'EOF'
# Firebase Configuration - Production
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCvjsGjVi8DTZGLwPTMH1F_xYStCODroXE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=macabre-4d51d.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://macabre-4d51d-default-rtdb.firebaseio.com/
NEXT_PUBLIC_FIREBASE_PROJECT_ID=macabre-4d51d
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=macabre-4d51d.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=60338412372
NEXT_PUBLIC_FIREBASE_APP_ID=1:60338412372:web:5c854d04a5503687cb06c1
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-GCZ0CE4M90
EOF

echo "✅ .env.local created successfully!"
echo "📊 File contents:"
ls -la .env.local
echo ""
echo "🚀 Next steps:"
echo "1. Stop your development server (Ctrl+C)"
echo "2. Restart with: npm run dev"
echo "3. Hard refresh browser: Cmd+Shift+R"
echo "4. Try login again - the network error should be fixed!"

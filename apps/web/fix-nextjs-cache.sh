#!/bin/bash
# QA Script: Fix Next.js Cache Corruption
# This will clear the corrupted Next.js build cache

echo "🧪 QA: Fixing Next.js cache corruption..."

# Kill any running Next.js processes
echo "🔄 Stopping Next.js processes..."
pkill -f "next dev" || true

# Remove corrupted Next.js cache
echo "🗑️  Clearing Next.js cache..."
rm -rf .next
rm -rf node_modules/.cache

# Clear npm cache as well
echo "🧹 Clearing npm cache..."
npm cache clean --force

echo "✅ QA: Cache cleared successfully!"
echo "🚀 QA: Now restart your development server:"
echo "   cd /Users/omarrumaihi/Desktop/Film-BMAD/macabre"
echo "   npm run dev"

#!/bin/bash

# Production Build Script for vtoraraka
echo "🚀 Building vtoraraka for production..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please create .env.local with your production environment variables."
    echo "See PRODUCTION_SETUP.md for details."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Type check
echo "🔍 Running type check..."
npm run type-check

# Lint check
echo "🧹 Running lint check..."
npm run lint

# Build for production
echo "🏗️ Building for production..."
npm run build

# Check build success
if [ $? -eq 0 ]; then
    echo "✅ Production build completed successfully!"
    echo "📁 Build output: .next/"
    echo "🚀 Ready for deployment!"
else
    echo "❌ Build failed!"
    exit 1
fi

#!/bin/bash

# Production Build Script for vtoraraka Platform
# This script prepares the application for production deployment

echo "🚀 Starting production build process..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the web directory."
    exit 1
fi

# Step 1: Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf node_modules/.cache

# Step 2: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 3: Type checking
echo "🔍 Running TypeScript type checking..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ TypeScript errors found. Please fix them before building."
    exit 1
fi

# Step 4: Linting
echo "🔧 Running ESLint..."
npm run lint
if [ $? -ne 0 ]; then
    echo "⚠️  Linting issues found. Consider fixing them."
fi

# Step 5: Production build
echo "🏗️  Building for production..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Step 6: Verify build
echo "✅ Verifying build..."
if [ -d ".next" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output: .next/"
    echo "🚀 Ready for deployment!"
else
    echo "❌ Build directory not found. Build may have failed."
    exit 1
fi

# Step 7: Show build info
echo ""
echo "📊 Build Information:"
echo "   - Build directory: .next/"
echo "   - Static files: .next/static/"
echo "   - Server files: .next/server/"
echo ""
echo "🎯 Next Steps:"
echo "   1. Test the build locally: npm run preview"
echo "   2. Deploy to your hosting platform"
echo "   3. Configure environment variables"
echo "   4. Run database migrations"
echo ""
echo "✨ Production build completed successfully!"
#!/bin/bash

# Production Deployment Script for vtoraraka Marketplace
# This script handles the complete production deployment process

set -e  # Exit on any error

echo "🚀 Starting Production Deployment for vtoraraka Marketplace..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the web directory."
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_error ".env.local file not found!"
    print_warning "Please create .env.local with your production environment variables."
    print_warning "See PRODUCTION_SETUP.md for details."
    exit 1
fi

# Step 1: Install dependencies
print_status "📦 Installing dependencies..."
npm ci --only=production
if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 2: Type checking
print_status "🔍 Running TypeScript type check..."
npm run type-check
if [ $? -eq 0 ]; then
    print_success "Type check passed"
else
    print_error "Type check failed"
    exit 1
fi

# Step 3: Linting
print_status "🧹 Running ESLint..."
npm run lint
if [ $? -eq 0 ]; then
    print_success "Linting passed"
else
    print_warning "Linting issues found. Attempting to fix..."
    npm run lint:fix
    if [ $? -eq 0 ]; then
        print_success "Linting issues fixed"
    else
        print_error "Linting issues could not be automatically fixed"
        exit 1
    fi
fi

# Step 4: Clean build directory
print_status "🧹 Cleaning previous build..."
rm -rf .next
print_success "Build directory cleaned"

# Step 5: Production build
print_status "🏗️ Building for production..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Production build completed successfully"
else
    print_error "Production build failed"
    exit 1
fi

# Step 6: Check build output
if [ -d ".next" ]; then
    print_success "Build output directory created"
    
    # Check if static files exist
    if [ -d ".next/static" ]; then
        print_success "Static assets generated"
    else
        print_warning "Static assets directory not found"
    fi
    
    # Check build size
    BUILD_SIZE=$(du -sh .next | cut -f1)
    print_success "Build size: $BUILD_SIZE"
else
    print_error "Build output directory not found"
    exit 1
fi

# Step 7: Security checks
print_status "🔒 Running security checks..."

# Check for console.log statements in build output
if grep -r "console.log" .next/static 2>/dev/null; then
    print_warning "Console.log statements found in build output"
else
    print_success "No console.log statements in build output"
fi

# Check for source maps (should be disabled in production)
if find .next -name "*.map" | grep -q .; then
    print_warning "Source maps found in build output"
else
    print_success "No source maps in build output"
fi

# Step 8: Performance check
print_status "⚡ Performance check..."
if command -v lighthouse &> /dev/null; then
    print_warning "Lighthouse available - run 'lighthouse http://localhost:3000' after starting the server"
else
    print_warning "Lighthouse not installed - install with 'npm install -g lighthouse' for performance testing"
fi

# Step 9: Final checks
print_status "🔍 Final production readiness checks..."

# Check environment variables
if grep -q "your-project-id" .env.local; then
    print_error "Please update Supabase URL in .env.local"
    exit 1
fi

if grep -q "your_supabase_anon_key" .env.local; then
    print_error "Please update Supabase anon key in .env.local"
    exit 1
fi

if grep -q "your-email@gmail.com" .env.local; then
    print_error "Please update email configuration in .env.local"
    exit 1
fi

print_success "Environment variables configured"

# Step 10: Deployment instructions
print_status "📋 Next steps for deployment:"
echo ""
echo "1. Test the production build locally:"
echo "   npm run preview"
echo ""
echo "2. Deploy to your hosting platform:"
echo "   - Vercel: npm run deploy:vercel"
echo "   - Netlify: npm run deploy:netlify"
echo "   - Manual: Upload .next directory to your server"
echo ""
echo "3. Configure your hosting platform:"
echo "   - Set environment variables"
echo "   - Configure custom domain"
echo "   - Enable SSL certificate"
echo ""
echo "4. Update Supabase configuration:"
echo "   - Update Site URL in Supabase Dashboard"
echo "   - Add your domain to Redirect URLs"
echo "   - Run database migration: production-database-migration.sql"
echo ""

# Step 11: Success message
print_success "Production build completed successfully! 🎉"
print_success "Your vtoraraka marketplace is ready for deployment!"
echo ""
print_status "Build output: .next/"
print_status "Ready for deployment to production! 🚀"

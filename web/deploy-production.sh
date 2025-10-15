#!/bin/bash

# Production Deployment Script
# This script helps deploy your application to production with proper database setup

set -e  # Exit on any error

echo "🚀 Starting Production Deployment"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
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
    print_error "Please run this script from the web directory"
    exit 1
fi

# Step 1: Pre-deployment checks
print_status "Running pre-deployment checks..."

# Check if environment variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    print_error "Production environment variables not set!"
    print_warning "Please set the following environment variables:"
    echo "  - NEXT_PUBLIC_SUPABASE_URL"
    echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "  - SUPABASE_SERVICE_ROLE_KEY"
    echo "  - NEXT_PUBLIC_APP_URL"
    echo "  - NEXT_PUBLIC_SITE_URL"
    echo "  - EMAIL_USER"
    echo "  - EMAIL_APP_PASSWORD"
    exit 1
fi

print_success "Environment variables are set"

# Step 2: Run production database setup
print_status "Setting up production database..."
node setup-production-db.js

if [ $? -ne 0 ]; then
    print_error "Production database setup failed!"
    exit 1
fi

print_success "Production database setup completed"

# Step 3: Run type checking and linting
print_status "Running type checking..."
npm run type-check

if [ $? -ne 0 ]; then
    print_error "Type checking failed!"
    exit 1
fi

print_success "Type checking passed"

print_status "Running linting..."
npm run lint

if [ $? -ne 0 ]; then
    print_warning "Linting issues found, but continuing..."
else
    print_success "Linting passed"
fi

# Step 4: Build the application
print_status "Building application for production..."
npm run build:production

if [ $? -ne 0 ]; then
    print_error "Build failed!"
    exit 1
fi

print_success "Build completed successfully"

# Step 5: Test API endpoints (if running locally)
if [ "$1" = "--test" ]; then
    print_status "Testing API endpoints..."
    
    # Start the production server in background
    npm start &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 10
    
    # Test endpoints
    print_status "Testing database connection..."
    curl -f http://localhost:3000/api/test-database > /dev/null
    if [ $? -eq 0 ]; then
        print_success "Database connection test passed"
    else
        print_error "Database connection test failed"
    fi
    
    print_status "Testing items API..."
    curl -f http://localhost:3000/api/items > /dev/null
    if [ $? -eq 0 ]; then
        print_success "Items API test passed"
    else
        print_error "Items API test failed"
    fi
    
    print_status "Testing categories API..."
    curl -f http://localhost:3000/api/categories > /dev/null
    if [ $? -eq 0 ]; then
        print_success "Categories API test passed"
    else
        print_error "Categories API test failed"
    fi
    
    # Stop the server
    kill $SERVER_PID
fi

# Step 6: Deployment instructions
print_success "Build completed successfully!"
echo ""
print_status "Next steps for deployment:"
echo "1. Deploy to your platform (Vercel, Netlify, etc.)"
echo "2. Set environment variables in your deployment platform"
echo "3. Test all functionality in production"
echo "4. Set up monitoring and backups"
echo ""
print_warning "Remember to:"
echo "• Never commit .env.local to version control"
echo "• Use different credentials for dev and production"
echo "• Set up proper RLS policies in production database"
echo "• Monitor both databases for performance"

echo ""
print_success "Deployment script completed! 🎉"
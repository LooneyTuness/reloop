# Production Build Script for vtoraraka (Windows)
Write-Host "🚀 Building vtoraraka for production..." -ForegroundColor Green

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ Error: .env.local file not found!" -ForegroundColor Red
    Write-Host "Please create .env.local with your production environment variables." -ForegroundColor Yellow
    Write-Host "See PRODUCTION_SETUP.md for details." -ForegroundColor Yellow
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm ci --only=production

# Type check
Write-Host "🔍 Running type check..." -ForegroundColor Blue
npm run type-check

# Lint check
Write-Host "🧹 Running lint check..." -ForegroundColor Blue
npm run lint

# Build for production
Write-Host "🏗️ Building for production..." -ForegroundColor Blue
npm run build

# Check build success
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Production build completed successfully!" -ForegroundColor Green
    Write-Host "📁 Build output: .next/" -ForegroundColor Cyan
    Write-Host "🚀 Ready for deployment!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

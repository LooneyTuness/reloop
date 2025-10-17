# 🔄 Database Switch Guide - Fix Seller Login Issue

## 🚨 Problem Identified

Sellers are currently logging into the **old reloop database** instead of the **production database**. This is caused by:

1. **Hardcoded database URL** in `next.config.js` (line 14)
2. **Missing environment variables** for production database
3. **Image domain configuration** pointing to old database

## ✅ Solution Implemented

### 1. Fixed Hardcoded Database URL

**File:** `web/next.config.js`

- **Before:** `domains: ["wkttbmstlttzuavtqpxb.supabase.co", "localhost", "127.0.0.1"]`
- **After:** `domains: [process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '') || "localhost", "localhost", "127.0.0.1"]`

### 2. Created Setup Scripts

- **`setup-production-env.js`** - Interactive script to configure production environment
- **`switch-to-production-db.js`** - Quick diagnostic and switch script
- **Updated `package.json`** with new npm scripts

## 🚀 Quick Fix Steps

### Option 1: Automated Setup (Recommended)

```bash
cd web
npm run setup:env
```

This will:

- Prompt for your production database credentials
- Create `.env.local` with correct configuration
- Set up all required environment variables

### Option 2: Manual Setup

1. **Create `.env.local` file in the `web` directory:**

```bash
# Production Environment Variables
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# Application Configuration
NEXT_PUBLIC_WAITLIST_ONLY=false
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com

# Email Notifications (Production)
EMAIL_USER=your-production-email@gmail.com
EMAIL_APP_PASSWORD=your_production_gmail_app_password

# Environment
NODE_ENV=production
```

2. **Restart your development server:**

```bash
npm run dev
```

### Option 3: Quick Diagnostic

```bash
cd web
npm run switch:production
```

This will:

- Check current database configuration
- Identify if you're using the old reloop database
- Provide guidance on switching to production

## 🧪 Verification Steps

### 1. Test Database Connection

```bash
cd web
npm run test:production
```

### 2. Check Environment Variables

```bash
cd web
node -e "console.log('Database URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

### 3. Verify Seller Login

1. Start the development server: `npm run dev`
2. Navigate to seller login page
3. Test seller authentication
4. Verify seller dashboard loads with correct data

## 🔍 Troubleshooting

### Issue: Still using old database

**Solution:**

1. Check if `.env.local` exists and has correct values
2. Restart the development server
3. Clear browser cache
4. Verify environment variables are loaded

### Issue: Environment variables not loading

**Solution:**

1. Ensure `.env.local` is in the `web` directory
2. Check file permissions
3. Restart terminal/IDE
4. Use `npm run switch:production` to diagnose

### Issue: Database connection fails

**Solution:**

1. Verify production database credentials
2. Check Supabase project is active
3. Ensure RLS policies are configured
4. Test with `npm run test:production`

## 📋 Production Deployment

### For Vercel/Netlify:

1. Set environment variables in your deployment platform:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_SITE_URL`
   - `EMAIL_USER`
   - `EMAIL_APP_PASSWORD`

2. Deploy your application

3. Test seller login on production

## 🎯 Expected Results

After implementing this fix:

- ✅ Sellers will log into the **production database**
- ✅ All seller data will be consistent
- ✅ Image uploads will work with production storage
- ✅ Authentication will use production credentials
- ✅ No more old reloop database references

## 📞 Support

If you encounter issues:

1. Run `npm run switch:production` for diagnostics
2. Check the console for error messages
3. Verify all environment variables are set correctly
4. Test database connection with `npm run test:production`

---

**Note:** This fix ensures that your application uses the correct production database for all seller operations, resolving the login issue you identified.

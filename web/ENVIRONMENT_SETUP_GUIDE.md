# Environment Setup Guide

## Setting Up Separate Development and Production Databases

### 1. Create Two Supabase Projects

#### Development Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project for development (e.g., "reloop-dev")
3. Note down the following credentials:
   - Project URL
   - Anon public key
   - Service role key

#### Production Database

1. Create another project for production (e.g., "reloop-prod")
2. Note down the following credentials:
   - Project URL
   - Anon public key
   - Service role key

### 2. Environment Files Setup

#### For Local Development (.env.local)

Create a `.env.local` file in the `web` directory:

```bash
# Development Environment Variables
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_dev_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_dev_service_role_key

# Application Configuration
NEXT_PUBLIC_WAITLIST_ONLY=false
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email Notifications (Development)
EMAIL_USER=your-dev-email@gmail.com
EMAIL_APP_PASSWORD=your_dev_gmail_app_password

# PostHog Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Environment
NODE_ENV=development
```

#### For Production (Vercel/Netlify Environment Variables)

Set these in your deployment platform:

```bash
# Production Environment Variables
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_prod_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_prod_service_role_key

# Application Configuration
NEXT_PUBLIC_WAITLIST_ONLY=false
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com

# Email Notifications (Production)
EMAIL_USER=your-prod-email@gmail.com
EMAIL_APP_PASSWORD=your_prod_gmail_app_password

# PostHog Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Environment
NODE_ENV=production
```

### 3. Database Schema Migration

#### Development Database

1. Set up your development database with all tables and data
2. Test all functionality locally

#### Production Database

1. **Option A: Manual Setup**

   - Create the same schema in production database
   - Run all migration scripts
   - Set up initial data

2. **Option B: Supabase CLI (Recommended)**

   ```bash
   # Initialize Supabase in your project
   supabase init

   # Link to development project
   supabase link --project-ref your-dev-project-id

   # Generate types for development
   supabase gen types typescript --local > src/lib/supabase/supabase.types.ts

   # Link to production project
   supabase link --project-ref your-prod-project-id

   # Deploy schema to production
   supabase db push
   ```

### 4. Environment-Specific Configuration

The application will automatically use the correct database based on the environment variables:

- **Development**: Uses `.env.local` variables
- **Production**: Uses deployment platform environment variables

### 5. Testing the Setup

#### Test Development Database

```bash
# Start development server
npm run dev

# Test API endpoints
curl http://localhost:3000/api/test-database
curl http://localhost:3000/api/items
curl http://localhost:3000/api/categories
```

#### Test Production Database

1. Deploy to your platform (Vercel/Netlify)
2. Test the same endpoints on your production domain

### 6. Security Considerations

1. **Never commit `.env.local`** to version control
2. **Use different email accounts** for dev and prod notifications
3. **Set up proper RLS policies** in both databases
4. **Monitor both databases** for performance and errors
5. **Backup production database** regularly

### 7. Deployment Checklist

- [ ] Development database configured and tested
- [ ] Production database created and schema deployed
- [ ] Environment variables set in deployment platform
- [ ] Email configuration tested for both environments
- [ ] All API endpoints working in production
- [ ] Database backups configured
- [ ] Monitoring set up for both environments

### 8. Troubleshooting

#### Common Issues:

1. **503 Errors**: Check if `SUPABASE_SERVICE_ROLE_KEY` is set correctly
2. **Database Connection Issues**: Verify project URLs and keys
3. **Schema Mismatches**: Ensure both databases have identical schemas
4. **RLS Policy Issues**: Check Row Level Security policies in both databases

#### Debug Commands:

```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# Test database connection
curl http://localhost:3000/api/test-database
```

# 🚀 Production Deployment Guide

## Prerequisites

- [ ] Supabase project set up
- [ ] Domain name purchased
- [ ] Gmail account with app password
- [ ] Hosting platform account (Vercel/Netlify/AWS)

## Step 1: Environment Setup

### 1.1 Supabase Configuration

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or use existing
3. Go to **Settings** → **API**
4. Copy your project URL and anon key

### 1.2 Gmail SMTP Setup

1. Enable 2-Factor Authentication on Gmail
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate an app password for "Mail"
4. Save the 16-character password

### 1.3 Environment Variables

Create `.env.local` in the `web` directory:

```bash
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration
NEXT_PUBLIC_WAITLIST_ONLY=false
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Email Notifications (REQUIRED)
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password

# PostHog Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## Step 2: Database Setup

### 2.1 Run Database Migrations

1. Go to Supabase Dashboard → **SQL Editor**
2. Run the following SQL scripts in order:
   - `fix-user-deletion-constraints.sql` (if not already run)
   - Any other migration scripts

### 2.2 Configure Row Level Security (RLS)

Ensure RLS is enabled on all tables:

- `items`
- `cart_items`
- `orders`

## Step 3: Build and Test

### 3.1 Local Production Build

```bash
# Windows
.\build-production.ps1

# Linux/Mac
./build-production.sh

# Or manually
npm run build:production
```

### 3.2 Test Production Build

```bash
npm run preview
```

## Step 4: Deploy to Hosting Platform

### 4.1 Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Configure environment variables in Vercel dashboard
4. Set up custom domain

### 4.2 Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Configure environment variables
5. Set up custom domain

### 4.3 AWS Amplify

1. Connect your repository
2. Set build settings:
   - Build command: `npm run build`
   - Base directory: `web`
3. Configure environment variables
4. Set up custom domain

## Step 5: Post-Deployment

### 5.1 Domain Configuration

1. Point your domain to the hosting platform
2. Set up SSL certificate (usually automatic)
3. Update `NEXT_PUBLIC_APP_URL` with your domain

### 5.2 Supabase Configuration

1. Update **Site URL** in Supabase Dashboard
2. Add your domain to **Redirect URLs**
3. Configure email templates if needed

### 5.3 Email Testing

1. Test user registration
2. Check email delivery
3. Test email confirmation flow
4. Verify seller/buyer notifications

## Step 6: Monitoring and Maintenance

### 6.1 Set Up Monitoring

- [ ] Error tracking (Sentry, LogRocket)
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Database monitoring

### 6.2 Security Checklist

- [ ] All environment variables secured
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Database backups configured

### 6.3 Performance Optimization

- [ ] Image optimization enabled
- [ ] CDN configured
- [ ] Caching strategies implemented
- [ ] Bundle size optimized

## Troubleshooting

### Common Issues

1. **Build fails**: Check environment variables
2. **Email not working**: Verify Gmail app password
3. **Database errors**: Check RLS policies
4. **Domain issues**: Verify DNS settings

### Support

- Check logs in hosting platform
- Review Supabase logs
- Test locally with production environment

## Success Metrics

- [ ] Site loads in < 3 seconds
- [ ] All features working
- [ ] Email notifications working
- [ ] Mobile responsive
- [ ] SEO optimized
- [ ] Security headers present

---

**Your vtoraraka marketplace is now ready for production! 🎉**

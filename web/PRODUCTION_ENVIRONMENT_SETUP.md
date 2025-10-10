# Production Environment Setup

## Issue: Confirmation emails showing localhost URLs

The confirmation emails are showing `localhost` URLs because the `NEXT_PUBLIC_APP_URL` environment variable is not set.

## Solution

### 1. Create `.env.local` file in the `web` directory:

```bash
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration (CRITICAL FOR EMAIL LINKS)
NEXT_PUBLIC_APP_URL=https://your-production-domain.com

# Email Notifications (REQUIRED - Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password

# PostHog Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Database (Optional - for direct access)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Configure Supabase Auth Settings

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Set **Site URL** to your production domain: `https://your-production-domain.com`
4. Add **Redirect URLs**:
   - `https://your-production-domain.com/auth/callback`
   - `https://your-production-domain.com/auth/confirm`

### 3. For Vercel Deployment

Add these environment variables in Vercel dashboard:
- `NEXT_PUBLIC_APP_URL` = `https://your-vercel-app.vercel.app`
- `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
- `EMAIL_USER` = your Gmail address
- `EMAIL_APP_PASSWORD` = your Gmail app password

## Why This Happens

Supabase uses the `NEXT_PUBLIC_APP_URL` environment variable to generate confirmation email links. If this is not set or set to `localhost`, the confirmation emails will contain localhost URLs that don't work on mobile devices.

## Testing

After setting up the environment variables:
1. Deploy to production
2. Test sign-up with a real email
3. Check that the confirmation email contains the correct production URL
4. Verify the link works on mobile devices

# vtoraraka Platform - Environment Variables Template

Copy this to `.env.local` in your `web` directory and fill in your actual values:

```bash
# ==============================================
# SUPABASE CONFIGURATION (REQUIRED)
# ==============================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# ==============================================
# APPLICATION CONFIGURATION (CRITICAL)
# ==============================================
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
NEXT_PUBLIC_WAITLIST_ONLY=false

# ==============================================
# EMAIL NOTIFICATIONS (REQUIRED - Gmail SMTP)
# ==============================================
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
ADMIN_EMAIL=admin@yourdomain.com

# ==============================================
# ANALYTICS (OPTIONAL)
# ==============================================
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# ==============================================
# DEVELOPMENT OVERRIDES (Optional)
# ==============================================
# NEXT_PUBLIC_DEBUG_MODE=false
# ANALYZE=false
```

## 🔧 How to Get These Values

### Supabase Configuration

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the Project URL and anon/public key
4. For service role key, copy the service_role key (keep this secret!)

### Email Configuration (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password as `EMAIL_APP_PASSWORD`

### Domain Configuration

- Replace `your-production-domain.com` with your actual domain
- This is critical for email links to work correctly

## ⚠️ Security Notes

- **Never commit `.env.local` to version control**
- **Keep service role key secret** - it has admin access to your database
- **Use app passwords for email**, not your regular Gmail password
- **Test email functionality** before going live

## 🧪 Testing Your Configuration

After setting up your environment variables, test them:

1. **Start development server**: `npm run dev`
2. **Test Supabase connection**: Visit `/api/test-supabase`
3. **Test email functionality**: Use the email test endpoint
4. **Verify environment variables**: Check the debug endpoint

## 🚀 Production Deployment

For production deployment on platforms like Vercel or Netlify:

1. **Add all environment variables** to your hosting platform's dashboard
2. **Set `NEXT_PUBLIC_APP_URL`** to your production domain
3. **Configure Supabase auth settings** with your production domain
4. **Test email functionality** in production environment

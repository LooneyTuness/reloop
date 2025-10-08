# Production Setup Guide

## Environment Variables

Create a `.env.local` file in the `web` directory with the following variables:

```bash
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration
NEXT_PUBLIC_WAITLIST_ONLY=false
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Email Notifications (REQUIRED - Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password

# PostHog Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Database (Optional - for direct access)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Build Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

## Deployment Checklist

- [ ] Set up production Supabase project
- [ ] Configure environment variables
- [ ] Set up domain and SSL certificate
- [ ] Configure CDN for static assets
- [ ] Set up monitoring and error tracking
- [ ] Test all functionality in production environment
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Set up security headers (already configured in next.config.js)

## Security Considerations

- All debug logs have been removed
- Security headers are configured
- Input validation is in place
- Authentication is properly secured
- Cart security measures are implemented

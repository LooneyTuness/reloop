# 🌐 Domain Configuration Guide

This guide will help you configure your public domain for the Reloop application.

## ⚡ Quick Start

If you just want to get started quickly:

1. **Add domain to hosting platform** (Vercel/Netlify) → Get DNS instructions
2. **Configure DNS records** at your domain registrar
3. **Update environment variables** with your domain:
   - `NEXT_PUBLIC_APP_URL=https://yourdomain.com`
   - `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`
4. **Update Supabase redirect URLs** to include your domain
5. **Wait for DNS/SSL propagation** (usually 1-2 hours)
6. **Test your domain** in a browser

For detailed instructions, continue reading below.

## 📋 Prerequisites

- ✅ Domain purchased and accessible in your domain registrar
- ✅ Hosting platform account (Vercel, Netlify, Railway, etc.)
- ✅ Supabase project set up
- ✅ Application deployed or ready to deploy

## 🚀 Step-by-Step Configuration

### Step 1: Configure DNS Records

Point your domain to your hosting provider. The exact steps depend on your hosting platform:

#### For Vercel:

1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Domains**
3. Click **Add Domain**
4. Enter your domain (e.g., `yourdomain.com`)
5. Follow the DNS configuration instructions:
   - **For apex domain** (`yourdomain.com`): Add an A record pointing to Vercel's IP
   - **For www subdomain** (`www.yourdomain.com`): Add a CNAME record pointing to `cname.vercel-dns.com`
6. Vercel will automatically provision SSL certificate

#### For Netlify:

1. Go to your site in Netlify dashboard
2. Navigate to **Domain settings**
3. Click **Add custom domain**
4. Enter your domain
5. Configure DNS:
   - **Apex domain**: Point to Netlify's load balancer IPs
   - **www subdomain**: Add CNAME pointing to your Netlify site URL
6. SSL certificate will be auto-provisioned

#### For Other Platforms:

- Check your hosting provider's documentation for DNS configuration
- Ensure you configure both apex domain and www subdomain
- Wait for DNS propagation (can take up to 48 hours, usually 1-2 hours)

### Step 2: Update Environment Variables

Update your environment variables to use your new domain:

#### For Local Development (`.env.local` in `web` directory):

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application Configuration - UPDATE THESE WITH YOUR DOMAIN
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_WAITLIST_ONLY=false

# Email Notifications (REQUIRED)
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password

# PostHog Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Environment
NODE_ENV=production
```

#### For Production (Hosting Platform Environment Variables):

Set these in your hosting platform's environment variables section:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_WAITLIST_ONLY=false
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
NODE_ENV=production
```

**⚠️ Important:**

- Use `https://` (not `http://`) for production URLs
- Update both `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_SITE_URL`
- These URLs are used in email links and authentication redirects

### Step 3: Configure Supabase Redirect URLs

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. Add your domain to **Site URL**:
   ```
   https://yourdomain.com
   ```
5. Add redirect URLs:
   ```
   https://yourdomain.com/auth/callback
   https://yourdomain.com/**/callback
   https://www.yourdomain.com/auth/callback
   ```
6. Save the changes

### Step 4: Configure www vs non-www Redirect

Decide whether to use `www.yourdomain.com` or `yourdomain.com` as your primary domain. It's recommended to redirect one to the other for SEO consistency.

#### Option A: Redirect www to non-www (Recommended)

Add this to your `next.config.js` in the `redirects()` function:

```javascript
async redirects() {
  return [
    {
      source: '/:path*',
      has: [
        {
          type: 'host',
          value: 'www.yourdomain.com',
        },
      ],
      destination: 'https://yourdomain.com/:path*',
      permanent: true,
    },
  ];
},
```

#### Option B: Redirect non-www to www

```javascript
async redirects() {
  return [
    {
      source: '/:path*',
      has: [
        {
          type: 'host',
          value: 'yourdomain.com',
        },
      ],
      destination: 'https://www.yourdomain.com/:path*',
      permanent: true,
    },
  ];
},
```

**Note:** Most hosting platforms (Vercel, Netlify) can also handle this redirect at the DNS/hosting level, which is often more efficient.

### Step 5: Update Next.js Configuration (if needed)

The `next.config.js` file should already be configured correctly. You may need to make these updates:

#### Update Image Domains

If you're hosting images on your domain, add it to the allowed domains:

```javascript
images: {
  domains: [
    process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "") || "localhost",
    "yourdomain.com",  // Add if you host images on your domain
    "www.yourdomain.com",  // Add if using www
    "localhost",
    "127.0.0.1",
  ],
}
```

#### Update Content Security Policy (if needed)

If you need to allow resources from your domain, update the CSP in `next.config.js`:

```javascript
"Content-Security-Policy",
  "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://app.posthog.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://app.posthog.com https://yourdomain.com;";
```

### Step 6: Update Supabase Site URL

Make sure your Supabase project's Site URL matches your chosen primary domain (www or non-www):

1. Go to Supabase Dashboard → **Settings** → **API**
2. Update **Site URL** to your primary domain:
   - `https://yourdomain.com` (if using non-www)
   - `https://www.yourdomain.com` (if using www)

### Step 7: Configure Backend Server (if applicable)

If you're running the NestJS backend separately, update the server configuration:

1. Create or update `.env` in the `server` directory:

```env
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

2. Update `server/src/main.ts` to handle CORS if needed:

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for your domain
  app.enableCors({
    origin: process.env.CORS_ORIGIN || "https://yourdomain.com",
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

### Step 8: Test Your Configuration

1. **DNS Check**: Verify DNS propagation

   ```bash
   # Check if domain resolves
   nslookup yourdomain.com
   # or
   dig yourdomain.com
   ```

2. **SSL Check**: Verify SSL certificate is active

   - Visit `https://yourdomain.com` in your browser
   - Check for the padlock icon
   - Use [SSL Labs](https://www.ssllabs.com/ssltest/) to test SSL configuration

3. **Application Test**:

   - Visit your domain in a browser
   - Test authentication flow
   - Check email links (they should use your domain)
   - Verify API endpoints work

4. **Supabase Test**:
   - Try signing up a new user
   - Check that confirmation emails contain correct domain links
   - Verify redirects work after authentication

## 🔧 Troubleshooting

### Domain Not Resolving

- **Wait for DNS propagation** (can take up to 48 hours)
- **Check DNS records** are correctly configured
- **Verify TTL** settings (lower TTL = faster updates)

### SSL Certificate Issues

- **Wait for auto-provisioning** (usually 5-10 minutes)
- **Check domain verification** in hosting platform
- **Ensure DNS is correctly configured** before SSL provisioning

### Authentication Redirects Not Working

- **Verify Supabase redirect URLs** include your domain
- **Check environment variables** are set correctly
- **Clear browser cache** and cookies
- **Check browser console** for errors

### Email Links Using Wrong Domain

- **Verify `NEXT_PUBLIC_APP_URL`** is set correctly
- **Rebuild and redeploy** your application
- **Check email templates** in Supabase

### CORS Errors

- **Update CORS settings** in backend server
- **Check `next.config.js`** headers configuration
- **Verify API routes** allow your domain

## 📝 Checklist

- [ ] DNS records configured and propagated
- [ ] Domain added to hosting platform
- [ ] SSL certificate active
- [ ] Environment variables updated with domain
- [ ] Supabase redirect URLs configured
- [ ] Application rebuilt and redeployed
- [ ] Authentication flow tested
- [ ] Email links tested
- [ ] API endpoints working
- [ ] Mobile responsive design verified

## 🎯 Next Steps

After configuring your domain:

1. **Set up monitoring** (uptime, error tracking)
2. **Configure backups** (database, files)
3. **Set up analytics** (if not already done)
4. **Review security settings** (firewall, rate limiting)
5. **Document your setup** for future reference

## 📚 Additional Resources

- [Vercel Domain Configuration](https://vercel.com/docs/concepts/projects/domains)
- [Netlify Domain Configuration](https://docs.netlify.com/domains-https/custom-domains/)
- [Supabase Authentication Configuration](https://supabase.com/docs/guides/auth)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

**Need Help?** If you encounter issues, check the troubleshooting section or review your hosting platform's documentation.

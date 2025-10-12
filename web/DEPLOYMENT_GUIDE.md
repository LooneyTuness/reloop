# vtoraraka Seller Dashboard Deployment Guide

This guide covers deploying both the buyer-facing application and the new seller dashboard.

## Architecture Overview

```
┌─────────────────────┐    ┌─────────────────────┐
│   Buyer App         │    │   Seller Dashboard   │
│   (Port 3000)      │    │   (Port 3001)       │
│                     │    │                     │
│   - Browse products │    │   - Manage products  │
│   - Cart & checkout │    │   - View orders      │
│   - Order history   │    │   - Notifications   │
│   - User auth       │    │   - Seller auth     │
└─────────────────────┘    └─────────────────────┘
           │                           │
           └───────────┬───────────────┘
                       │
            ┌─────────────────────┐
            │   Supabase Database │
            │   - Shared data     │
            │   - RLS policies    │
            │   - Auth system     │
            └─────────────────────┘
```

## Prerequisites

- Supabase project with database
- Domain or subdomain for seller dashboard
- Hosting platform (Vercel, Netlify, etc.)

## Step 1: Database Setup

1. **Run the database migration**:

   ```sql
   -- Execute the contents of seller-dashboard/database-migration.sql
   -- in your Supabase SQL editor
   ```

2. **Create your first admin user**:

   ```sql
   INSERT INTO seller_profiles (user_id, email, role, is_approved)
   SELECT id, email, 'admin', true
   FROM auth.users
   WHERE email = 'your-admin-email@domain.com';
   ```

3. **Verify RLS policies** are active and working correctly.

## Step 2: Buyer App Cleanup

1. **Remove seller-specific components**:

   ```bash
   # Move these files to seller dashboard or delete
   rm web/src/components/VendorOrdersPanel.tsx
   rm web/src/components/NotificationPanel.tsx
   rm web/src/components/SellItem.jsx
   ```

2. **Update dashboard page** to redirect sellers:

   ```bash
   # Replace with redirect logic (see BUYER_APP_CLEANUP.md)
   ```

3. **Update navigation** to remove seller links

4. **Add environment variable**:
   ```env
   NEXT_PUBLIC_SELLER_DASHBOARD_URL=https://sellers.yourdomain.com
   ```

## Step 3: Deploy Buyer App

1. **Build and deploy** the main application:

   ```bash
   cd web
   npm run build
   # Deploy to your hosting platform
   ```

2. **Configure domain**: `https://yourdomain.com`

## Step 4: Deploy Seller Dashboard

1. **Build seller dashboard**:

   ```bash
   cd web/seller-dashboard
   npm run build
   ```

2. **Deploy to hosting platform**:

   - Vercel: Connect GitHub repo and deploy
   - Netlify: Drag and drop build folder
   - Other platforms: Follow their deployment guides

3. **Configure domain**: `https://sellers.yourdomain.com` or subdomain

## Step 5: Environment Configuration

### Buyer App Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
NEXT_PUBLIC_SELLER_DASHBOARD_URL=https://sellers.yourdomain.com
```

### Seller Dashboard Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
NEXT_PUBLIC_SELLER_DASHBOARD_URL=https://sellers.yourdomain.com
NEXT_PUBLIC_MAIN_APP_URL=https://yourdomain.com
```

## Step 6: Domain Configuration

### Option 1: Subdomain Approach

- Main app: `https://yourdomain.com`
- Seller dashboard: `https://sellers.yourdomain.com`

### Option 2: Path-based Approach

- Main app: `https://yourdomain.com`
- Seller dashboard: `https://yourdomain.com/sellers`

### DNS Configuration

```
yourdomain.com          A    your-server-ip
sellers.yourdomain.com  A    your-server-ip
```

## Step 7: Testing

### Buyer App Testing

1. ✅ Browse products
2. ✅ Add to cart
3. ✅ Checkout process
4. ✅ Order confirmation
5. ✅ User authentication
6. ✅ Seller redirection (if seller tries to access buyer dashboard)

### Seller Dashboard Testing

1. ✅ Seller login
2. ✅ Product management
3. ✅ Order management
4. ✅ Notifications
5. ✅ Revenue tracking
6. ✅ Access control (non-sellers can't access)

### Security Testing

1. ✅ RLS policies working
2. ✅ Seller data isolation
3. ✅ Admin-only functions protected
4. ✅ Authentication flows secure

## Step 8: Monitoring and Maintenance

### Database Monitoring

```sql
-- Check seller profiles
SELECT sp.*, au.email as auth_email
FROM seller_profiles sp
JOIN auth.users au ON sp.user_id = au.id;

-- Monitor vendor orders
SELECT COUNT(*) FROM vendor_orders;

-- Check notifications
SELECT COUNT(*) FROM notifications WHERE is_read = false;
```

### Application Monitoring

- Set up error tracking (Sentry, Bugsnag)
- Monitor performance metrics
- Track user authentication issues
- Monitor database query performance

## Troubleshooting

### Common Issues

1. **Seller can't access dashboard**:

   - Check seller profile exists in database
   - Verify `is_approved = true`
   - Check RLS policies

2. **Orders not showing**:

   - Verify `vendor_orders` view exists
   - Check user permissions
   - Validate data in `order_items` table

3. **Authentication issues**:

   - Check Supabase configuration
   - Verify environment variables
   - Test auth flows

4. **Database connection errors**:
   - Verify Supabase URL and keys
   - Check network connectivity
   - Validate RLS policies

### Debug Queries

```sql
-- Check seller profiles
SELECT * FROM seller_profiles WHERE email = 'seller@example.com';

-- Check vendor orders
SELECT * FROM vendor_orders WHERE vendor_id = 'user-uuid';

-- Check notifications
SELECT * FROM notifications WHERE user_id = 'user-uuid';

-- Test RLS policies
SET row_security = on;
SELECT * FROM seller_profiles;
```

## Security Checklist

- [ ] RLS policies enabled on all tables
- [ ] Seller profiles table secured
- [ ] Admin functions protected
- [ ] Authentication flows secure
- [ ] Data isolation verified
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database access restricted

## Performance Optimization

1. **Database indexes**:

   ```sql
   CREATE INDEX idx_items_user_id_status ON items(user_id, status);
   CREATE INDEX idx_vendor_orders_vendor_id ON vendor_orders(vendor_id);
   ```

2. **Caching**:

   - Implement Redis for session caching
   - Use CDN for static assets
   - Cache database queries where appropriate

3. **Monitoring**:
   - Set up database query monitoring
   - Track application performance metrics
   - Monitor error rates and response times

## Backup and Recovery

1. **Database backups**:

   - Enable Supabase automatic backups
   - Test restore procedures
   - Document recovery steps

2. **Application backups**:
   - Version control all code
   - Backup environment configurations
   - Document deployment procedures

## Support and Documentation

- Keep deployment documentation updated
- Document any custom configurations
- Maintain troubleshooting guides
- Train team on new architecture

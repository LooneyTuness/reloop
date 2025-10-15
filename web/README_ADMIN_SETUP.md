# Admin User Setup Guide

This guide explains how to create an admin user for your seller registration system.

## 🚨 Important: Admin User Required

Before you can use the seller registration API (`/api/admin/sellers`), you need at least one admin user in your database. The API requires authentication and admin role verification.

## 📋 Three Methods to Create Admin User

### Method 1: Manual Database Insert (Simplest)

**Step 1: Create Auth User**

1. Go to your Supabase Dashboard
2. Navigate to Authentication > Users
3. Click "Add user"
4. Enter admin email and password
5. Set "Email Confirm" to `true`
6. Copy the generated User ID

**Step 2: Insert Admin Profile**

1. Go to Supabase SQL Editor
2. Run the SQL from `create-admin-user.sql`
3. Replace `YOUR_USER_ID_HERE` with the User ID from Step 1
4. Update email and name as needed

### Method 2: Automated SQL Script

1. Go to Supabase SQL Editor
2. Run `create-admin-user-automated.sql`
3. Note: This creates a placeholder - you'll still need to create the auth user manually

### Method 3: API Script (Recommended for Production)

1. Install dependencies:

   ```bash
   npm install @supabase/supabase-js
   ```

2. Set environment variables:

   ```bash
   export NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```

3. Update admin details in `create-admin-user-via-api.js`:

   ```javascript
   const ADMIN_EMAIL = "admin@yourdomain.com";
   const ADMIN_PASSWORD = "your-secure-password";
   const ADMIN_NAME = "Platform Administrator";
   ```

4. Run the script:
   ```bash
   node create-admin-user-via-api.js
   ```

## ✅ Verify Admin User Creation

After creating the admin user, verify it was created correctly:

```sql
SELECT
    id,
    user_id,
    email,
    full_name,
    role,
    is_approved,
    created_at
FROM seller_profiles
WHERE role = 'admin';
```

You should see your admin user with:

- `role = 'admin'`
- `is_approved = true`
- Valid `user_id` and `email`

## 🔐 Using the Admin User

Once created, you can use the admin user to:

1. **Authenticate** with your app using the admin email/password
2. **Create sellers** via the `/api/admin/sellers` endpoint
3. **Manage seller applications** via admin interfaces

### Example API Usage:

```javascript
// Get admin auth token first
const { data: authData } = await supabase.auth.signInWithPassword({
  email: "admin@yourdomain.com",
  password: "your-password",
});

// Use token to create sellers
const response = await fetch("/api/admin/sellers", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authData.session.access_token}`,
  },
  body: JSON.stringify({
    email: "seller@example.com",
    fullName: "John Doe",
    createdBy: "Admin Name",
  }),
});
```

## 🚨 Security Notes

1. **Use strong passwords** for admin accounts
2. **Limit admin access** to trusted personnel only
3. **Monitor admin activity** through audit logs
4. **Consider multi-factor authentication** for production
5. **Rotate admin credentials** regularly

## 🔧 Troubleshooting

### "Admin access required" error

- Verify the user has `role = 'admin'` in `seller_profiles`
- Check that the auth token is valid
- Ensure the user is authenticated

### "Invalid authentication token" error

- Verify the user is signed in
- Check token expiration
- Ensure proper Authorization header format

### "User already exists" error

- Check if admin user already exists
- Use different email or update existing user

## 📞 Support

If you encounter issues:

1. Check Supabase logs for detailed error messages
2. Verify database schema matches expected structure
3. Ensure all environment variables are set correctly
4. Test with a simple admin user creation first

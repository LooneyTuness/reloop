# 🔧 Fixing the 500 Internal Server Error

## 🚨 **Root Cause Analysis**

The 500 error is likely caused by one of these issues:

1. **Missing Environment Variables** - `SUPABASE_SERVICE_ROLE_KEY` not set
2. **Database Table Missing** - `seller_applications` table doesn't exist
3. **Email Configuration** - Email service not properly configured

## 🔍 **Step 1: Run Diagnostic**

First, test the system with the diagnostic endpoint:

```
GET http://localhost:3000/api/seller-applications/debug
```

This will show you:

- ✅ Which environment variables are set
- ✅ Database connection status
- ✅ Table existence check

## 🛠️ **Step 2: Fix Environment Variables**

Add these to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Configuration (optional for testing)
EMAIL_USER=your_gmail_address
EMAIL_APP_PASSWORD=your_gmail_app_password
ADMIN_EMAIL=admin@yourdomain.com
```

## 🗄️ **Step 3: Create Database Table**

Run this SQL in your Supabase SQL editor:

```sql
-- Execute the contents of create-seller-applications-table.sql
```

## 🧪 **Step 4: Test the System**

1. **Check diagnostic endpoint**:

   ```
   http://localhost:3000/api/seller-applications/debug
   ```

2. **Test the application form**:
   ```
   http://localhost:3000/seller-application
   ```

## 🔧 **Common Issues & Solutions**

### Issue 1: "Database connection failed"

**Solution**: Run the database migration script

### Issue 2: "Server configuration error"

**Solution**: Set `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`

### Issue 3: "Table doesn't exist"

**Solution**: Execute `create-seller-applications-table.sql`

### Issue 4: Email errors

**Solution**: Set `EMAIL_USER` and `EMAIL_APP_PASSWORD` (optional for testing)

## 📋 **Quick Checklist**

- [ ] Environment variables set in `.env.local`
- [ ] Database migration script executed
- [ ] Diagnostic endpoint returns success
- [ ] Application form loads without errors
- [ ] Form submission works

## 🚀 **Testing Without Email**

If you want to test without email configuration, the system will:

- ✅ Still save applications to database
- ✅ Show success message
- ⚠️ Skip email notifications (but log errors)

## 📞 **Still Having Issues?**

1. Check browser console for client-side errors
2. Check server logs for API errors
3. Run the diagnostic endpoint
4. Verify all environment variables are set
5. Ensure database table exists

The improved error handling will now give you specific error messages instead of generic 500 errors! 🎉

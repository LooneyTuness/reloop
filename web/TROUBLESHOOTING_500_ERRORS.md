# 🚨 Troubleshooting 500 Errors

## 🔍 **Step 1: Test Basic Environment**

Try this simple endpoint first:

```
GET http://localhost:3000/api/seller-applications/debug
```

This should now work and show you which environment variables are missing.

## 🔍 **Step 2: Test Supabase Import**

If the debug endpoint works, test the Supabase import:

```
GET http://localhost:3000/api/test-supabase
```

This will tell you if the admin client can be imported.

## 🛠️ **Step 3: Fix Environment Variables**

Based on the debug results, add missing variables to `.env.local`:

```env
# Required for seller applications
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional (for email notifications)
EMAIL_USER=your_gmail@gmail.com
EMAIL_APP_PASSWORD=your_app_password
ADMIN_EMAIL=admin@yourdomain.com
```

## 🔄 **Step 4: Restart Development Server**

After adding environment variables:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

## 🗄️ **Step 5: Create Database Table**

Run this SQL in your Supabase SQL editor:

```sql
-- Copy and paste the contents of create-seller-applications-table.sql
```

## 🧪 **Step 6: Test Again**

1. **Debug endpoint**: `http://localhost:3000/api/seller-applications/debug`
2. **Supabase test**: `http://localhost:3000/api/test-supabase`
3. **Application form**: `http://localhost:3000/seller-application`

## 🔧 **Common Issues**

### Issue: "serviceRoleKey: false"

**Solution**: Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`

### Issue: "Failed to import admin client"

**Solution**: Check if the file `src/lib/supabase/supabase.admin.ts` exists

### Issue: "Database connection failed"

**Solution**: Run the database migration script

### Issue: Still getting 500 errors

**Solution**: Check server console logs for detailed error messages

## 📋 **Quick Checklist**

- [ ] `.env.local` file exists in project root
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set
- [ ] Development server restarted after adding env vars
- [ ] Database migration script executed
- [ ] Debug endpoint returns success

## 🆘 **Still Stuck?**

If you're still getting 500 errors:

1. **Check server logs** in your terminal
2. **Try the debug endpoints** to see specific error messages
3. **Verify file paths** - make sure all files exist
4. **Check Supabase project** - ensure it's active and accessible

The simplified debug endpoint should now work and give you specific information about what's missing! 🎯

# 🚨 API Route 500 Error - Step by Step Fix

## 🔍 **Step 1: Test Basic API Routes**

Try these endpoints in order:

1. **Super Simple Test**:

   ```
   GET http://localhost:3000/api/simple-test
   ```

   Should return: `{"status":"ok","message":"Simple test endpoint working"}`

2. **Minimal Debug Test**:

   ```
   GET http://localhost:3000/api/seller-applications/debug
   ```

   Should return: `{"status":"ok","message":"Debug endpoint working"}`

3. **Supabase Test**:
   ```
   GET http://localhost:3000/api/test-supabase
   ```

## 🛠️ **Step 2: If Simple Test Fails**

If even the simple test fails, the issue is with Next.js API routes:

1. **Check if development server is running**:

   ```bash
   npm run dev
   ```

2. **Check for TypeScript errors**:

   ```bash
   npm run build
   ```

3. **Check console logs** for any error messages

## 🛠️ **Step 3: If Debug Test Fails**

If simple test works but debug fails:

1. **Check file exists**: `src/app/api/seller-applications/debug/route.ts`
2. **Check for syntax errors** in the file
3. **Restart development server**

## 🛠️ **Step 4: If Supabase Test Fails**

If debug works but Supabase test fails:

1. **Add environment variables** to `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Restart development server**:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

## 🛠️ **Step 5: Test Seller Application**

Once debug endpoints work:

1. **Create database table**:

   ```sql
   -- Run create-seller-applications-table.sql in Supabase
   ```

2. **Test application form**:
   ```
   http://localhost:3000/seller-application
   ```

## 🔧 **Common Issues**

### Issue: All API routes return 500

**Solution**: Check Next.js development server is running properly

### Issue: Simple test works, debug fails

**Solution**: Check file syntax and restart server

### Issue: Debug works, Supabase test fails

**Solution**: Add missing environment variables

### Issue: Supabase test works, application fails

**Solution**: Run database migration script

## 📋 **Quick Checklist**

- [ ] Development server running (`npm run dev`)
- [ ] Simple test endpoint works
- [ ] Debug endpoint works
- [ ] Environment variables set in `.env.local`
- [ ] Server restarted after adding env vars
- [ ] Database migration executed

## 🆘 **Still Getting 500?**

If you're still getting 500 errors:

1. **Check terminal logs** for detailed error messages
2. **Try the endpoints in order** (simple → debug → supabase)
3. **Verify file structure** matches expected layout
4. **Check for TypeScript compilation errors**

The minimal debug endpoint should now work! 🎯

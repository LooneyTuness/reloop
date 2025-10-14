# Debug Item Creation Issues

## 🔍 Step-by-Step Debugging Guide

### 1. Check Browser Console

Open your browser's developer console (F12) and look for:

- Any error messages when creating a product
- The debug logs we added (should show data being passed)
- Supabase connection errors

### 2. Test Supabase Connection

Run this in your browser console on localhost:3000:

```javascript
// Test Supabase connection
import { createBrowserClient } from "./src/lib/supabase/supabase.browser.js";

const supabase = createBrowserClient();

// Check auth
const {
  data: { user },
} = await supabase.auth.getUser();
console.log("User:", user);

// Check if we can read from items table
const { data, error } = await supabase.from("items").select("*").limit(1);
console.log("Read test:", { data, error });
```

### 3. Check RLS Policies

In your Supabase dashboard:

1. Go to Authentication > Policies
2. Check if there are RLS policies on the `items` table
3. Look for policies that might block INSERT operations

### 4. Test Direct Insert

Try this in your browser console:

```javascript
const supabase = createBrowserClient();
const {
  data: { user },
} = await supabase.auth.getUser();

const { data, error } = await supabase
  .from("items")
  .insert({
    title: "Test Item",
    price: 10,
    user_id: user.id,
    status: "active",
    is_active: true,
    quantity: 1,
  })
  .select();

console.log("Direct insert result:", { data, error });
```

### 5. Check Database Permissions

In Supabase SQL Editor, run:

```sql
-- Check if the items table exists and has the right columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'items'
ORDER BY ordinal_position;

-- Check RLS status
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'items';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'items';
```

### 6. Common Issues & Solutions

#### Issue: RLS Policy Blocking

**Solution:** Create or update RLS policy:

```sql
-- Allow authenticated users to insert their own items
CREATE POLICY "Users can insert their own items" ON items
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to read all active items
CREATE POLICY "Anyone can read active items" ON items
FOR SELECT USING (is_active = true);
```

#### Issue: Missing Required Fields

**Solution:** Check that all required fields are provided:

- `title` (required)
- `price` (required)
- `user_id` (required for RLS)

#### Issue: Authentication Problems

**Solution:** Ensure user is properly authenticated before creating items.

### 7. Debug Logs to Look For

When you try to create a product, you should see these logs in console:

1. `DashboardContext: Adding new product with data:`
2. `DashboardContext: User ID:`
3. `Creating item with data:`
4. `Item created successfully:` OR error details

If any of these are missing, that's where the issue is.

## 🚨 Quick Fixes

### If No Logs Appear:

- Check if the form submission is working
- Verify the `addNewProduct` function is being called

### If User ID is Missing:

- Check authentication state
- Ensure user is logged in

### If Supabase Error:

- Check RLS policies
- Verify table permissions
- Check if all required fields are provided

### If Item Created But Not Visible:

- Check the filtering logic
- Verify `is_active` and `status` values
- Check if there are any additional filters


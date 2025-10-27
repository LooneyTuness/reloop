# Vendor Onboarding Guide

## Overview

When a new user signs up or logs in with Supabase Auth, they are automatically created in the `auth.users` table. For vendors who need to sell on the platform, you need to also create a corresponding entry in the `seller_profiles` table.

## Database Schema

The `seller_profiles` table has the following structure:

```typescript
{
  id: string (UUID, auto-generated)
  user_id: string (UUID, references auth.users.id) ✅ REQUIRED
  email: string ✅ REQUIRED
  role: 'admin' | 'seller' ✅ REQUIRED
  is_approved: boolean (default: false for production, true for development)
  full_name?: string
  business_name?: string
  business_type?: string
  phone?: string
  bio?: string
  location?: string
  website?: string
  avatar_url?: string
  tax_id?: string
  bank_account?: string
  created_at: timestamp
  updated_at: timestamp
}
```

## When to Create Seller Profiles

You have **three scenarios** for creating seller profiles:

### 1. **Automatic On Sign-Up** (Recommended for Streamlined Flow)

When a user explicitly signs up as a vendor, automatically create their seller profile during the authentication process.

**Implementation:**

- Add a "Sign up as Vendor" option in your sign-up form
- After successful auth sign-up, immediately call the create seller profile API
- This ensures vendors have instant access to their dashboard

### 2. **After Application Approval** (Current Implementation)

When an admin approves a seller application from the `seller_applications` table.

**Current Flow:**

1. Vendor submits application via `/seller-application` page
2. Application is stored in `seller_applications` table
3. Admin reviews and approves via admin panel
4. System creates auth user + seller profile (see `web/src/app/api/admin/seller-applications/route.ts`)

### 3. **On-Demand Creation** (For Existing Users)

Allow existing authenticated users to become vendors by filling out vendor information.

**Use Case:** A user who initially signed up as a buyer later wants to sell items.

## Implementation Examples

### Example 1: Create Seller Profile API (Already Exists)

Location: `web/src/app/api/create-seller-profile/route.ts`

```typescript
// POST /api/create-seller-profile
{
  userId: string,  // From auth.users
  email: string,   // From auth.users
  role: 'seller'   // Default
}

// Creates entry in seller_profiles table
```

### Example 2: During Application Approval (Admin)

Location: `web/src/app/api/admin/seller-applications/route.ts` (lines 140-246)

```typescript
// When approving an application:
1. Create auth user (if doesn't exist)
2. Create seller profile with:
   - user_id: new user's ID
   - email: applicant's email
   - full_name: applicant's name
   - role: "seller"
   - is_approved: true (if auto-approved) or false (for manual review)
```

### Example 3: Direct Seller Creation (Admin)

Location: `web/src/app/api/admin/sellers/route.ts` (lines 208-248)

```typescript
// Admin can manually create sellers:
1. Check if seller profile exists
2. Create auth user (if needed)
3. Insert into seller_profiles table
```

## Recommended Approach for Your Vendor Onboarding

Since you already have a seller application system, here's the **recommended flow**:

### **Option A: Automatic Creation on Vendor Sign-Up** (Best UX)

```typescript
// In your vendor sign-up form submission
async function handleVendorSignUp(email, password, fullName) {
  // 1. Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        is_vendor: true, // Flag to indicate vendor
      },
    },
  });

  // 2. If successful, immediately create seller profile
  if (data.user && !error) {
    const response = await fetch("/api/create-seller-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: data.user.id,
        email: data.user.email,
        role: "seller",
      }),
    });
  }
}
```

### **Option B: Based on Application Flow** (Your Current System)

1. **Vendor fills application** → Stored in `seller_applications`
2. **Admin approves** → System automatically:
   - Creates auth user (if needed)
   - Creates seller profile
   - Sets `is_approved` to false for manual review
   - Sends approval email

## Key Points to Remember

1. **Every seller profile MUST have:**

   - `user_id`: From Supabase Auth
   - `email`: User's email
   - `role`: Set to `'seller'` for vendors

2. **Don't duplicate users:**

   - Always check if a seller profile exists before creating
   - Use the existing API at `/api/create-seller-profile`

3. **Approval workflow:**

   - Set `is_approved: false` in production for manual review
   - Set `is_approved: true` in development for faster testing

4. **One user, one seller profile:**
   - `user_id` is UNIQUE in the table
   - Each auth user can only have one seller profile

## Testing Your Vendor Onboarding

```sql
-- Check if vendor profile was created correctly
SELECT
  sp.id,
  sp.user_id,
  sp.email,
  sp.full_name,
  sp.role,
  sp.is_approved,
  au.email as auth_email
FROM seller_profiles sp
LEFT JOIN auth.users au ON sp.user_id = au.id
WHERE sp.email = 'vendor@example.com';
```

## Summary

**When a new vendor logs in:**

1. ✅ They are automatically in `auth.users` (auth system)
2. ❌ They need manual creation in `seller_profiles` (your system)
3. ✅ Use existing API: `/api/create-seller-profile`
4. ✅ Check existing profile first to avoid duplicates
5. ✅ Set appropriate approval status based on environment

**Recommendation:** Add an automatic seller profile creation step after vendor sign-up for the smoothest user experience.

# Vendor Onboarding Guide

## Overview

When a new user signs up or logs in with Supabase Auth, they are automatically created in the `auth.users` table. **This system now automatically creates seller profiles** when vendors sign up, eliminating the need for manual profile creation.

### Key Features:

- ✅ **Automatic Profile Creation** - Seller profiles created during email confirmation
- ✅ **Duplicate Prevention** - Checks for existing profiles before creating
- ✅ **Environment-Aware** - Auto-approves in development, requires manual approval in production
- ✅ **Vendor Sign-Up UI** - Complete sign-up modal for vendor registration
- ✅ **Multiple Flows** - Supports direct sign-up and application approval workflows

## Quick Start

### For New Vendors:

1. Fill out the vendor sign-up form (name + email)
2. Click the magic link in your email
3. Seller profile is created automatically
4. Access your vendor dashboard

### For Developers:

The vendor onboarding system is **fully implemented** and ready to use. Simply integrate the `VendorSignUpModal` component wherever you want vendors to sign up.

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

## Vendor Onboarding Flow ✅ IMPLEMENTED

Your system now supports **automatic vendor onboarding** when users sign up as vendors. The seller profile is created automatically when they confirm their email.

### How It Works:

1. **Vendor Request Sign-Up** → User fills out vendor sign-up form
2. **Magic Link Sent** → Email link includes vendor metadata
3. **Email Confirmation** → User clicks confirmation link
4. **Automatic Profile Creation** → System creates seller profile automatically
5. **Dashboard Access** → Vendor redirected to their dashboard

## Implementation Details

### 1. Vendor Sign-Up Hook ✅

**Location:** `web/src/app/api/auth/sign-in/sign-in.hook.ts`

```typescript
export function useSignUpAsVendor() {
  return useMutation({
    mutationFn: async (data: {
      email: string;
      fullName: string;
      isVendor: boolean;
    }) => {
      const supabase = createBrowserClient();

      // Create auth user with vendor flag
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          data: {
            full_name: data.fullName,
            is_vendor: data.isVendor, // ✅ Vendor flag
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm?vendor=true`,
        },
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t("checkEmailForMagicLink"));
      localStorage.setItem("pending_vendor_signup", "true");
      router.push("/auth/success?from=vendor-signup");
    },
  });
}
```

**Key Points:**

- Stores `is_vendor: true` in user metadata
- Magic link URL includes `vendor=true` parameter
- Redirects to vendor-specific success page

### 2. Automatic Profile Creation ✅

**Location:** `web/src/app/auth/confirm/route.ts`

```typescript
// When vendor confirms their email
if (isVendor && user.user_metadata?.is_vendor && supabaseAdmin) {
  console.log("Vendor sign-up detected, creating seller profile...");

  try {
    // Check if profile exists
    const { data: existingProfile } = await supabaseAdmin
      .from("seller_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!existingProfile) {
      // Auto-approved in development, needs approval in production
      const isApproved = process.env.NODE_ENV !== "production";

      // Create seller profile automatically
      const { data: sellerProfile, error: createError } = await supabaseAdmin
        .from("seller_profiles")
        .insert({
          user_id: user.id,
          email: user.email || "",
          full_name: user.user_metadata?.full_name || "",
          role: "seller",
          is_approved: isApproved,
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating seller profile:", createError);
      } else {
        console.log("Seller profile created successfully");
      }
    }
  } catch (error) {
    console.error("Error in vendor profile creation:", error);
  }
}
```

**Key Points:**

- Automatically creates seller profile on email confirmation
- Checks for duplicates before creating
- Sets approval status based on environment
- Includes user_id, email, full_name, role, and is_approved

### 3. Vendor Sign-Up UI Component ✅

**Location:** `web/src/components/VendorSignUpModal.tsx`

A complete sign-up modal specifically for vendors that:

- Collects full name and email
- Uses the `useSignUpAsVendor` hook
- Shows vendor-specific benefits
- Provides success confirmation

### 4. Manual API Endpoint (Backup Method) ✅

**Location:** `web/src/app/api/create-seller-profile/route.ts`

For manual seller profile creation if needed:

```typescript
// POST /api/create-seller-profile
{
  userId: string,  // From auth.users
  email: string,   // From auth.users
  role: 'seller'   // Default
}

// Creates entry in seller_profiles table
```

## Alternative Flows

### After Application Approval (Existing Implementation)

**Location:** `web/src/app/api/admin/seller-applications/route.ts`

When an admin approves a seller application:

1. Vendor submits application via `/seller-application` page
2. Application stored in `seller_applications` table
3. Admin reviews and approves via admin panel
4. System creates auth user + seller profile automatically

**Code Flow:**

```typescript
// Lines 140-246 in seller-applications/route.ts
const { data: newUser } = await supabaseAdmin.auth.admin.createUser({
  email: application.email,
  email_confirm: true,
  user_metadata: {
    full_name: application.full_name,
    store_name: application.store_name,
  },
});

// Then create seller profile
const { data: seller } = await supabaseAdmin.from("seller_profiles").insert({
  user_id: newUser.user.id,
  email: application.email,
  full_name: application.full_name,
  role: "seller",
  is_approved: autoApprove,
});
```

## Key Points to Remember

### ✅ Required Fields for Seller Profiles

- `user_id`: From Supabase Auth (auth.users.id)
- `email`: User's email address
- `role`: Set to `'seller'` for vendors

### ✅ Duplicate Prevention

- Always check if a seller profile exists before creating
- The confirmation route checks for existing profiles automatically
- Use the existing API at `/api/create-seller-profile` for manual creation

### ✅ Approval Workflow

- **Development:** `is_approved: true` (instant access)
- **Production:** `is_approved: false` (manual review required)

### ✅ One-to-One Relationship

- `user_id` is UNIQUE in the table
- Each auth user can only have one seller profile
- If profile exists, it won't be recreated

## Testing Your Vendor Onboarding

### Check Profile Creation

```sql
-- Verify vendor profile was created
SELECT
  sp.id,
  sp.user_id,
  sp.email,
  sp.full_name,
  sp.role,
  sp.is_approved,
  au.email as auth_email,
  au.user_metadata->>'is_vendor' as is_vendor_flag
FROM seller_profiles sp
LEFT JOIN auth.users au ON sp.user_id = au.id
WHERE sp.email = 'vendor@example.com';
```

### Test the Flow

1. **Start Dev Server:**

   ```bash
   npm run dev
   ```

2. **Open Vendor Sign-Up:**

   - Navigate to any page with vendor sign-up option
   - Or use the VendorSignUpModal component

3. **Fill Form:**

   - Enter full name
   - Enter email address
   - Click "Create Vendor Account"

4. **Check Email:**

   - Receive magic link email
   - Click confirmation link

5. **Automatic Profile Creation:**

   - Check console logs for "Seller profile created successfully"
   - Vendor redirected to dashboard or application page

6. **Verify in Database:**
   - Run the SQL query above
   - Confirm all fields are populated correctly

## Summary

### ✅ What's Implemented

1. **Automatic Vendor Onboarding** - Seller profiles created on email confirmation
2. **Vendor Sign-Up Hook** - `useSignUpAsVendor` with vendor metadata
3. **Smart Profile Creation** - Automatic in auth confirm route
4. **Duplicate Prevention** - Checks existing profiles before creating
5. **Environment-Aware Approval** - Different settings for dev/prod
6. **UI Components** - VendorSignUpModal for vendor registration

### 🎯 How to Use

**For Vendors:**

1. Use `VendorSignUpModal` component in your app
2. User provides name and email
3. Magic link sent with vendor flag
4. Click link → profile created automatically
5. Access vendor dashboard

**For Admins:**

1. Approve applications via admin panel
2. System creates auth user + seller profile
3. Set approval status as needed

**For Developers:**

- The implementation is complete and ready to use
- No additional code needed for basic flow
- Modify approval logic in `route.ts` as needed

### 🚀 Next Steps

1. Add the `VendorSignUpModal` to your sign-up page
2. Test the flow in development
3. Configure production approval settings
4. Customize vendor onboarding UI as needed

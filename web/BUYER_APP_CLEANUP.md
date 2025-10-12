# Buyer App Cleanup Guide

This guide helps you remove seller-specific functionality from the main buyer-facing application.

## Files to Remove or Modify

### 1. Seller-Specific Components

- `src/components/VendorOrdersPanel.tsx` - Move to seller dashboard
- `src/components/NotificationPanel.tsx` - Move to seller dashboard
- `src/components/SellItem.jsx` - Move to seller dashboard or remove

### 2. Seller-Specific Pages

- `src/app/dashboard/page.tsx` - Replace with redirect logic (see below)
- Any seller-specific routes

### 3. Seller-Specific API Routes

- `src/app/api/orders/notify-sellers/route.ts` - Move to seller dashboard
- Any other seller-specific API endpoints

### 4. Navigation Updates

Update `src/components/Navbar.tsx` to remove seller-specific links:

- Remove "Dashboard" link for sellers
- Remove "Sell Item" link
- Keep only buyer-focused navigation

### 5. Context Updates

- Remove seller-specific logic from `src/contexts/AuthContext.jsx`
- Remove seller-specific translations from `src/contexts/LanguageContext.jsx`

## Recommended Changes

### Dashboard Page Replacement

Replace the current dashboard with a redirect page:

```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createBrowserClient } from "@/lib/supabase/supabase.browser";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    // Check if user is a seller and redirect to seller dashboard
    const checkSellerStatus = async () => {
      try {
        const supabase = createBrowserClient();
        const { data: profile } = await supabase
          .from("seller_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profile && profile.is_approved) {
          // User is an approved seller, redirect to seller dashboard
          window.location.href =
            process.env.NEXT_PUBLIC_SELLER_DASHBOARD_URL ||
            "http://localhost:3001";
          return;
        }

        // User is not a seller, show buyer dashboard or redirect to products
        router.push("/products");
      } catch (error) {
        console.error("Error checking seller status:", error);
        // Default to products page if there's an error
        router.push("/products");
      }
    };

    checkSellerStatus();
  }, [user, authLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  );
}
```

### Navigation Component Updates

Update `src/components/Navbar.tsx` to remove seller-specific elements:

```tsx
// Remove seller-specific navigation items
// Add seller dashboard link for approved sellers
// Keep only buyer-focused navigation
```

### Authentication Context Updates

Add seller detection to `src/contexts/AuthContext.jsx`:

```jsx
// Add function to check if user is approved seller
// Add redirect logic for sellers
// Keep buyer-focused authentication logic
```

## Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_SELLER_DASHBOARD_URL=http://localhost:3001
```

## Testing

After cleanup:

1. Test buyer flows (browse, cart, checkout)
2. Test seller redirection to seller dashboard
3. Ensure no seller-specific UI elements remain
4. Verify all buyer functionality still works

## Deployment

1. Deploy the cleaned buyer app
2. Deploy the separate seller dashboard
3. Update DNS/domain configuration
4. Test both applications work correctly

## Database Migration

Run the database migration script in the seller dashboard to set up seller profiles:

```sql
-- Execute database-migration.sql in Supabase SQL editor
```

## Security Considerations

- Ensure RLS policies are properly configured
- Verify seller-only access to seller dashboard
- Test authentication flows for both apps
- Validate data isolation between buyer and seller data

# Buyer App Cleanup Script
# This script helps remove seller-specific functionality from the main buyer-facing application

echo "🧹 Starting cleanup of buyer-facing application..."

# 1. Remove or redirect dashboard page (seller-specific)
echo "📝 Updating dashboard page to redirect sellers..."
cat > web/src/app/dashboard/page.tsx << 'EOF'
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createBrowserClient } from '@/lib/supabase/supabase.browser';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/sign-in');
      return;
    }

    // Check if user is a seller and redirect to seller dashboard
    const checkSellerStatus = async () => {
      try {
        const supabase = createBrowserClient();
        const { data: profile } = await supabase
          .from('seller_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profile && profile.is_approved) {
          // User is an approved seller, redirect to seller dashboard
          window.location.href = process.env.NEXT_PUBLIC_SELLER_DASHBOARD_URL || 'http://localhost:3001';
          return;
        }

        // User is not a seller, show buyer dashboard or redirect to products
        router.push('/products');
      } catch (error) {
        console.error('Error checking seller status:', error);
        // Default to products page if there's an error
        router.push('/products');
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
EOF

# 2. Update navigation to remove seller-specific links
echo "🔗 Updating navigation..."

# 3. Create a cleanup guide
cat > web/BUYER_APP_CLEANUP.md << 'EOF'
# Buyer App Cleanup Guide

This guide helps you remove seller-specific functionality from the main buyer-facing application.

## Files to Remove or Modify

### 1. Seller-Specific Components
- `src/components/VendorOrdersPanel.tsx` - Move to seller dashboard
- `src/components/NotificationPanel.tsx` - Move to seller dashboard
- `src/components/SellItem.jsx` - Move to seller dashboard or remove

### 2. Seller-Specific Pages
- `src/app/dashboard/page.tsx` - Replace with redirect logic (see above)
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

### Navigation Component
Remove seller-specific navigation items and add a link to the seller dashboard for approved sellers.

### Authentication Context
Add seller detection logic to redirect approved sellers to the seller dashboard.

### Language Context
Remove seller-specific translations and keep only buyer-focused content.

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
EOF

echo "✅ Cleanup script completed!"
echo "📋 See BUYER_APP_CLEANUP.md for detailed instructions"
echo ""
echo "Next steps:"
echo "1. Review the cleanup guide"
echo "2. Remove seller-specific components and pages"
echo "3. Update navigation and authentication logic"
echo "4. Test buyer flows"
echo "5. Deploy both applications"

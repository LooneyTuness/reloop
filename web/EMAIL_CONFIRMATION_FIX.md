# Email Confirmation Fix

## Problem

Users were getting stuck in a redirect loop when clicking email confirmation links. The issue was caused by inconsistent redirect URLs:

- Some components redirected to `/auth/success`
- Others redirected to `/auth/callback`
- The callback route was trying to redirect to `/auth/success`

## Solution

1. **Standardized all redirect URLs** to use `/auth/callback`
2. **Updated callback route** to redirect directly to home page (`/`) with confirmation flag
3. **Home page handles confirmation** by showing a success toast message

## Files Changed

- `web/src/app/api/auth/callback/route.ts` - Now redirects to home page
- `web/src/components/SignUp.tsx` - Fixed redirect URL
- `web/src/app/page.tsx` - Already had confirmation handling

## How It Works Now

1. User signs up → receives email
2. User clicks confirmation link → goes to `/auth/callback?code=...`
3. Callback exchanges code for session → redirects to `/?confirmed=true`
4. Home page shows success toast → cleans up URL

## Test

1. Sign up with a new email
2. Check email and click confirmation link
3. Should redirect to home page with success message
4. User should be automatically logged in

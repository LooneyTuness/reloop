# Seller Application System

This document describes the implementation of the seller application system for vtoraraka.mk, allowing users to apply to become sellers on the platform.

## Overview

The seller application system provides a curated approach to seller onboarding, where users must apply and be approved before they can start selling on the platform. This ensures quality control and alignment with platform values.

## Features Implemented

### 1. Homepage CTA Button

- **Location**: Hero section of the homepage
- **Text Options**:
  - Macedonian: "Стани продавач" (Become a Seller)
  - English: "Become a Seller"
- **Action**: Links to `/seller-application` page

### 2. Seller Application Form

- **Location**: `/seller-application` page
- **Fields**:
  - Full Name (required)
  - Email Address (required)
  - Store Name or Brand Name (optional)
  - Website/Social Media (optional)
  - Product Description (required)
  - Terms acknowledgment checkbox (required)

### 3. Database Schema

- **Table**: `seller_applications`
- **Fields**:
  - `id` (UUID, primary key)
  - `full_name` (text, required)
  - `email` (text, required)
  - `store_name` (text, optional)
  - `website_social` (text, optional)
  - `product_description` (text, required)
  - `understands_application` (boolean, required)
  - `status` (enum: pending, approved, rejected)
  - `created_at`, `updated_at` (timestamps)
  - `reviewed_by`, `reviewed_at`, `notes` (admin fields)

### 4. API Endpoint

- **Route**: `/api/seller-applications`
- **Method**: POST
- **Features**:
  - Form validation
  - Duplicate application prevention
  - Email confirmation to applicant
  - Admin notification emails
  - Multilingual support

### 5. Success Flow

- **Success Page**: Shows confirmation message
- **Email Confirmation**: Sent to applicant
- **Admin Notification**: Sent to platform admins
- **Follow-up Instructions**: 7-day response timeline

## File Structure

```
web/
├── create-seller-applications-table.sql          # Database schema
├── src/
│   ├── app/
│   │   ├── api/seller-applications/route.ts      # API endpoint
│   │   └── seller-application/page.tsx            # Application page
│   ├── components/
│   │   ├── SellerApplicationForm.tsx              # Main form component
│   │   └── SellerApplicationSuccess.tsx           # Success page component
│   ├── contexts/LanguageContext.jsx               # Updated with new translations
│   └── lib/supabase/supabase.types.ts            # Updated with new table types
└── src/components/Home.jsx                        # Updated homepage CTA
```

## Database Setup

Run the following SQL script in your Supabase SQL editor:

```sql
-- Execute the contents of create-seller-applications-table.sql
```

This will create:

- The `seller_applications` table
- Appropriate indexes for performance
- Row Level Security (RLS) policies
- Comments for documentation

## Translation Keys Added

### Macedonian (mk)

- `becomeSeller`: "Стани продавач"
- `applyToSell`: "Аплицирај за продавање"

### English (en)

- `becomeSeller`: "Become a Seller"
- `applyToSell`: "Apply to Sell"

## Email Templates

The system sends two types of emails:

### 1. Applicant Confirmation Email

- Sent to the person who submitted the application
- Includes application details
- Provides follow-up contact information
- Available in both Macedonian and English

### 2. Admin Notification Email

- Sent to all platform admins
- Contains application summary
- Includes review instructions
- Available in both Macedonian and English

## Security Features

### Row Level Security (RLS)

- **Insert**: Anyone can submit applications
- **Select**: Admins can view all applications, users can view their own
- **Update**: Only admins can approve/reject applications

### Validation

- Required field validation
- Email format validation
- Duplicate application prevention
- Terms acknowledgment requirement

## Admin Workflow

1. **Application Submission**: User submits application via form
2. **Email Notifications**: Both applicant and admins receive emails
3. **Admin Review**: Admins can review applications in the admin panel
4. **Approval/Rejection**: Admins can update application status
5. **User Notification**: Approved users can access seller dashboard

## Integration Points

### Homepage Integration

- Updated hero section CTA button
- Updated footer "Sell With Us" link
- Maintains existing design consistency

### Seller Dashboard Integration

- Approved applications create seller profiles
- Existing seller dashboard handles approved sellers
- Maintains separation between buyer and seller experiences

## Future Enhancements

Potential improvements for the seller application system:

1. **Application Status Tracking**: Allow users to check application status
2. **Bulk Application Management**: Admin tools for managing multiple applications
3. **Application Analytics**: Track application metrics and conversion rates
4. **Automated Screening**: Basic automated checks before human review
5. **Application Categories**: Different application types for different seller tiers

## Testing

To test the seller application system:

1. **Database Setup**: Run the SQL migration script
2. **Form Submission**: Submit a test application
3. **Email Verification**: Check that confirmation emails are sent
4. **Admin Review**: Test admin notification emails
5. **Success Flow**: Verify success page displays correctly

## Deployment Checklist

Before deploying to production:

- [ ] Run database migration script
- [ ] Verify email service configuration
- [ ] Test form submission flow
- [ ] Confirm email delivery
- [ ] Update admin email addresses
- [ ] Test multilingual support
- [ ] Verify RLS policies work correctly

## Support

For issues or questions about the seller application system:

1. Check the database migration script
2. Verify API endpoint configuration
3. Test email service setup
4. Review RLS policy configuration
5. Check translation key implementation

The system is designed to be robust and user-friendly while maintaining security and quality control standards.

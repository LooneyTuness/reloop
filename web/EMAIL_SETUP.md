# Email Notification Setup (Gmail SMTP - FREE)

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# Gmail SMTP Configuration (FREE - No domain verification required)
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
```

## Setting up Gmail SMTP (FREE)

1. **Enable 2-Factor Authentication**: Go to your Google Account settings
2. **Generate App Password**: Visit https://myaccount.google.com/apppasswords
3. **Select App**: Choose "Mail" and your device
4. **Copy Password**: Use this 16-character password (not your regular Gmail password)
5. **Add to Environment**: Set `EMAIL_APP_PASSWORD` to this generated password

## Testing Email Notifications

1. Set up the environment variables
2. Visit `http://localhost:3001/test-email`
3. Enter your email and click "Send Test Email"
4. Check your inbox (and spam folder)
5. Place a test order to verify buyer/seller notifications

## Benefits of Gmail SMTP

- ✅ **Completely FREE** (500 emails/day)
- ✅ **No domain verification required**
- ✅ **Reliable delivery**
- ✅ **Easy setup**
- ✅ **Professional appearance**

## Troubleshooting

### Common Issues:

- **"Missing EMAIL_USER"**: Make sure the environment variable is set
- **"Authentication failed"**: Check your app password (not regular password)
- **"2FA not enabled"**: Enable 2-Factor Authentication first
- **No emails received**: Check spam folder, verify email addresses
- **Seller emails missing**: Ensure items have `user_email` field populated

### Debug Steps:

1. Test with `/test-email` page first
2. Check browser console for errors during checkout
3. Verify Gmail app password is correct
4. Ensure 2FA is enabled on Gmail account

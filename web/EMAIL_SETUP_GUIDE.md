# Email Configuration Guide

## 🔧 **Fix Email Not Sending Issue**

The invite emails aren't being sent because your email configuration is using placeholder values. Here's how to fix it:

### **📧 Step 1: Set Up Gmail App Password**

1. **Go to**: [Google Account Settings](https://myaccount.google.com/)
2. **Security** → **2-Step Verification** (enable if not already)
3. **Security** → **App passwords**
4. **Generate** a new app password for "Mail"
5. **Copy** the 16-character password (e.g., `abcd efgh ijkl mnop`)

### **📧 Step 2: Update Environment Variables**

Update your `web/.env.local` file:

```bash
# Replace these placeholder values:
EMAIL_USER=viktorijamatejevik@Live.com
EMAIL_APP_PASSWORD=your_16_character_app_password_here
ADMIN_EMAIL=viktorijamatejevik@Live.com
```

### **📧 Step 3: Test Email Configuration**

1. **Go to**: `http://localhost:3002/api/test-email`
2. **Check** if email configuration is set up correctly
3. **Send test email** using the POST endpoint

### **📧 Step 4: Test Invite System**

1. **Go to**: `/admin/seller-invites`
2. **Create invite** with your email
3. **Check** your inbox (and spam folder)
4. **Click invite link** to test acceptance

### **🔍 Debugging Steps**

If emails still don't work:

1. **Check server logs** for email errors
2. **Verify** Gmail app password is correct
3. **Check** spam/junk folder
4. **Test** with different email provider
5. **Use** the test email endpoint

### **📱 Alternative: Use Different Email Service**

If Gmail doesn't work, you can use:

- **SendGrid** (free tier available)
- **Mailgun** (free tier available)
- **Resend** (developer-friendly)

### **✅ Quick Test**

Run this command to test your email config:

```bash
curl -X POST http://localhost:3002/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"your-email@example.com","subject":"Test","message":"Hello World"}'
```

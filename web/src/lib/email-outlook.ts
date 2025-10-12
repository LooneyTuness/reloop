import nodemailer from 'nodemailer';

// Create reusable transporter object using Microsoft Outlook SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // Your Microsoft email address
      pass: process.env.EMAIL_APP_PASSWORD, // Your Microsoft password or app password
    },
    tls: {
      ciphers: 'SSLv3'
    }
  });
};

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  // Check if email configuration is available
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error('Email configuration missing. Please set EMAIL_USER and EMAIL_APP_PASSWORD environment variables.');
  }

  const transporter = createTransporter();
  
  const mailOptions = {
    from: from || `vtoraraka <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

// Test email function
export async function sendTestEmail(to: string) {
  const testHtml = `
    <div style="font-family: system-ui, Segoe UI, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #059669; margin: 0;">vtoraraka</h1>
        <p style="color: #6b7280; margin: 5px 0 0 0;">Test Email - Microsoft Outlook SMTP</p>
      </div>
      
      <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #0ea5e9;">
        <h2 style="color: #0c4a6e; margin: 0 0 15px 0;">✅ Email Test Successful!</h2>
        <p style="color: #0c4a6e; margin: 0;">
          This is a test email to verify that Microsoft Outlook SMTP is working correctly.
        </p>
      </div>

      <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
        <h3 style="color: #111827; margin: 0 0 10px 0;">Configuration Details:</h3>
        <ul style="color: #374151; margin: 0; padding-left: 20px;">
          <li>Email Service: Microsoft Outlook SMTP</li>
          <li>From Address: ${process.env.EMAIL_USER || 'Not set'}</li>
          <li>Test Time: ${new Date().toISOString()}</li>
          <li>Status: ✅ Working</li>
        </ul>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          If you received this email, your Microsoft Outlook SMTP configuration is working perfectly!
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject: 'vtoraraka Email Test - Microsoft Outlook SMTP',
    html: testHtml,
  });
}

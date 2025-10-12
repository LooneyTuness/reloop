import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, message } = await req.json();

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: "to, subject, and message are required" },
        { status: 400 }
      );
    }

    // Test email sending
    const result = await sendEmail({
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Email Test</h2>
          <p>${message}</p>
          <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
          <p><strong>From:</strong> ${process.env.EMAIL_USER}</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      result
    });

  } catch (error) {
    console.error("Email test error:", error);
    return NextResponse.json(
      { 
        error: "Failed to send test email",
        details: error instanceof Error ? error.message : "Unknown error",
        emailConfig: {
          emailUser: process.env.EMAIL_USER,
          emailPassword: process.env.EMAIL_APP_PASSWORD ? "SET" : "NOT SET"
        }
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    emailConfig: {
      emailUser: process.env.EMAIL_USER,
      emailPassword: process.env.EMAIL_APP_PASSWORD ? "SET" : "NOT SET",
      adminEmail: process.env.ADMIN_EMAIL
    },
    instructions: [
      "1. Update EMAIL_USER in .env.local with your Gmail address",
      "2. Update EMAIL_APP_PASSWORD with your Gmail App Password",
      "3. Test email sending with POST request",
      "4. Check spam folder if emails don't arrive"
    ]
  });
}
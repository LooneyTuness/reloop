import { NextRequest, NextResponse } from "next/server";
import { sendTestEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const result = await sendTestEmail(email);
    
    return NextResponse.json({ 
      success: true, 
      message: "Test email sent successfully via Gmail SMTP",
      messageId: result.messageId 
    });
    
  } catch (error) {
    console.error("Email test error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Unknown error",
      details: "Check your EMAIL_USER and EMAIL_APP_PASSWORD environment variables"
    }, { status: 500 });
  }
}

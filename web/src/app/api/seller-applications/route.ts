import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase.admin";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    // Check environment variables first
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const {
      fullName,
      email,
      storeName,
      websiteSocial,
      productDescription,
      understandsApplication,
      language = "mk"
    }: {
      fullName: string;
      email: string;
      storeName?: string;
      websiteSocial?: string;
      productDescription: string;
      understandsApplication: boolean;
      language?: string;
    } = await req.json();

    // Validate required fields
    if (!fullName || !email || !productDescription) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate that user understands this is an application
    if (!understandsApplication) {
      return NextResponse.json(
        { error: "Must acknowledge application terms" },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Admin service not available" },
        { status: 503 }
      );
    }

    const supabase = supabaseAdmin;

    // Test database connection first
    try {
      const { error: testError } = await supabase
        .from("seller_applications")
        .select("id")
        .limit(1);
      
      if (testError) {
        console.error('Database connection test failed:', testError);
        return NextResponse.json(
          { error: "Database connection failed. Please ensure the seller_applications table exists." },
          { status: 500 }
        );
      }
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 500 }
      );
    }

    // Check if user already has a pending application
    const { data: existingApplication } = await supabase
      .from("seller_applications")
      .select("id, status")
      .eq("email", email)
      .eq("status", "pending")
      .single();

    if (existingApplication) {
      return NextResponse.json(
        { error: "Application already submitted" },
        { status: 409 }
      );
    }

    // Insert the application
    const { data: application, error: insertError } = await supabase
      .from("seller_applications")
      .insert({
        full_name: fullName,
        email: email,
        store_name: storeName || null,
        website_social: websiteSocial || null,
        product_description: productDescription,
        understands_application: understandsApplication,
        status: "pending"
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting seller application:", insertError);
      return NextResponse.json(
        { error: "Failed to submit application" },
        { status: 500 }
      );
    }

    // Send confirmation email to applicant
    const isMacedonian = language === "mk";
    
    const subject = "Seller Application Confirmation - vtoraraka";

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; font-size: 28px; margin-bottom: 10px;">vtoraraka.mk</h1>
          <p style="color: #6b7280; font-size: 16px;">Second-hand. First choice.</p>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
          <h2 style="color: #1f2937; font-size: 24px; margin-bottom: 20px;">Thank you for applying!</h2>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hello ${fullName},
          </p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            We've received your application to become a seller on vtoraraka.mk. Our team will review your application and reach out if it's a good fit.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #059669;">
            <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 15px;">Application Details:</h3>
            <p style="color: #374151; font-size: 14px; margin-bottom: 8px;"><strong>Name:</strong> ${fullName}</p>
            <p style="color: #374151; font-size: 14px; margin-bottom: 8px;"><strong>Email:</strong> ${email}</p>
            ${storeName ? `<p style="color: #374151; font-size: 14px; margin-bottom: 8px;"><strong>Store Name:</strong> ${storeName}</p>` : ''}
            ${websiteSocial ? `<p style="color: #374151; font-size: 14px; margin-bottom: 8px;"><strong>Website/Social:</strong> ${websiteSocial}</p>` : ''}
            <p style="color: #374151; font-size: 14px; margin-bottom: 8px;"><strong>Product Description:</strong> ${productDescription}</p>
          </div>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-top: 20px;">
            We'll be in touch soon with more information. If you don't hear from us within 7 days, feel free to contact us at <a href="mailto:info@vtoraraka.mk" style="color: #059669;">info@vtoraraka.mk</a>.
          </p>
        </div>
        
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Follow us on <a href="https://www.instagram.com/relovedmk/" style="color: #059669;">Instagram</a> for the latest pieces!
          </p>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 10px;">
            © 2024 vtoraraka.mk. All rights reserved.
          </p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: email,
        subject: subject,
        html: emailContent,
      });
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
      // Don't fail the request if email fails
    }

    // Send notification to admins
    try {
      // For now, send to a hardcoded admin email
      // TODO: Implement proper admin management system
      const adminEmails = process.env.ADMIN_EMAIL ? [process.env.ADMIN_EMAIL] : [];
        
        const adminSubject = "New Seller Application - vtoraraka";

        const adminContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1f2937; font-size: 24px; margin-bottom: 20px;">New Seller Application</h2>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
              <p style="color: #374151; font-size: 16px; margin-bottom: 15px;"><strong>Name:</strong> ${fullName}</p>
              <p style="color: #374151; font-size: 16px; margin-bottom: 15px;"><strong>Email:</strong> ${email}</p>
              ${storeName ? `<p style="color: #374151; font-size: 16px; margin-bottom: 15px;"><strong>Store Name:</strong> ${storeName}</p>` : ''}
              ${websiteSocial ? `<p style="color: #374151; font-size: 16px; margin-bottom: 15px;"><strong>Website/Social:</strong> ${websiteSocial}</p>` : ''}
              <p style="color: #374151; font-size: 16px; margin-bottom: 15px;"><strong>Product Description:</strong> ${productDescription}</p>
              <p style="color: #374151; font-size: 16px; margin-bottom: 15px;"><strong>Application Date:</strong> ${new Date().toLocaleDateString('en-US')}</p>
            </div>
            
            <p style="color: #374151; font-size: 14px; margin-top: 20px;">
              You can review and approve/reject the application in the admin panel.
            </p>
          </div>
        `;

        if (adminEmails.length > 0) {
          await sendEmail({
            to: adminEmails.join(','),
            subject: adminSubject,
            html: adminContent,
          });
        }
    } catch (adminEmailError) {
      console.error("Error sending admin notification:", adminEmailError);
      // Don't fail the request if admin email fails
    }

    return NextResponse.json({ 
      success: true, 
      applicationId: application.id,
      message: "Application submitted successfully!"
    });

  } catch (error) {
    console.error("Error in seller application API:", error);
    
    // Return a proper JSON error response
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase.admin";
import { sendEmail } from "@/lib/email";

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Admin service not available" },
        { status: 503 }
      );
    }

    // Optimized query with limited fields and index usage
    const { data: applications, error } = await supabaseAdmin
      .from("seller_applications")
      .select("id, full_name, email, store_name, website_social, product_description, status, created_at, updated_at, reviewed_at, notes")
      .order("created_at", { ascending: false })
      .limit(200); // Reasonable limit for admin panel

    if (error) {
      console.error("Error fetching seller applications:", error);
      return NextResponse.json(
        { error: "Failed to fetch applications" },
        { status: 500 }
      );
    }

    // Return with caching headers (10 seconds cache)
    const response = NextResponse.json({ applications });
    response.headers.set('Cache-Control', 'private, max-age=10, stale-while-revalidate=20');
    
    return response;
  } catch (error) {
    console.error("Error in GET seller applications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Admin service not available" },
        { status: 503 }
      );
    }

    const { applicationId, action, notes, adminUserId } = await req.json();

    if (!applicationId || !action || !adminUserId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["approved", "rejected"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approved' or 'rejected'" },
        { status: 400 }
      );
    }

    // Get the application details
    const { data: application, error: fetchError } = await supabaseAdmin
      .from("seller_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (fetchError || !application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (application.status !== "pending") {
      return NextResponse.json(
        { error: "Application has already been reviewed" },
        { status: 400 }
      );
    }

    // Update the application status
    const { data: updatedApplication, error: updateError } = await supabaseAdmin
      .from("seller_applications")
      .update({
        status: action,
        reviewed_by: adminUserId,
        reviewed_at: new Date().toISOString(),
        notes: notes || null
      })
      .eq("id", applicationId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating application:", updateError);
      return NextResponse.json(
        { error: "Failed to update application" },
        { status: 500 }
      );
    }

    // If approved, create seller profile
    if (action === "approved") {
      try {
        // Try to find existing user by email
        let existingUser = null;
        try {
          const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
          if (listError) {
            console.log("Could not list users:", listError.message);
          } else {
            existingUser = users.users.find(user => 
              user.email && user.email.toLowerCase() === application.email.toLowerCase()
            );
            console.log("User lookup result:", existingUser ? "Found" : "Not found");
          }
        } catch (listError) {
          console.log("Error listing users:", listError);
        }

        let userId = null;

        if (!existingUser) {
          // User doesn't exist, try to create them
          console.log("Creating new user for:", application.email);
          const { data: newUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
            email: application.email,
            email_confirm: true,
            user_metadata: {
              full_name: application.full_name,
              store_name: application.store_name || null,
              website_social: application.website_social || null
            }
          });

          if (createUserError) {
            console.error("Error creating user:", createUserError);
            // If user already exists, try to find them again
            if (createUserError.code === 'email_exists') {
              console.log("User already exists, trying to find them...");
              try {
                const { data: users } = await supabaseAdmin.auth.admin.listUsers();
                existingUser = users.users.find(user => 
                  user.email && user.email.toLowerCase() === application.email.toLowerCase()
                );
                if (existingUser) {
                  userId = existingUser.id;
                  console.log("Found existing user after creation error");
                }
              } catch (findError) {
                console.error("Error finding existing user:", findError);
              }
            }
            
            if (!userId) {
              return NextResponse.json(
                { error: "Failed to create user account: " + createUserError.message },
                { status: 500 }
              );
            }
          } else if (newUser.user) {
            userId = newUser.user.id;
            console.log("Successfully created new user");
          }
        } else {
          userId = existingUser.id;
          console.log("Using existing user");
        }

        if (!userId) {
          return NextResponse.json(
            { error: "Could not determine user ID" },
            { status: 500 }
          );
        }

        // Check if seller profile already exists
        const { data: existingProfile } = await supabaseAdmin
          .from("seller_profiles")
          .select("id")
          .eq("email", application.email)
          .single();

        if (existingProfile) {
          console.log("Seller profile already exists for this email");
          return NextResponse.json(
            { error: "Seller profile already exists for this email" },
            { status: 409 }
          );
        }

        // Create seller profile
        console.log("Creating seller profile for user:", userId);
        const { error: profileError } = await supabaseAdmin
          .from("seller_profiles")
          .insert({
            user_id: userId,
            email: application.email,
            role: "seller",
            is_approved: true
          });

        if (profileError) {
          console.error("Error creating seller profile:", profileError);
          return NextResponse.json(
            { error: "Failed to create seller profile: " + profileError.message },
            { status: 500 }
          );
        }

        console.log("Successfully created seller profile");
      } catch (profileError) {
        console.error("Error in seller profile creation:", profileError);
        return NextResponse.json(
          { error: "Failed to create seller profile" },
          { status: 500 }
        );
      }
    }

    // Send email notification to applicant
    try {
      const isApproved = action === "approved";
      const subject = isApproved 
        ? "🎉 Your Seller Application Has Been Approved! - vtoraraka"
        : "Seller Application Update - vtoraraka";

      const emailContent = isApproved ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; font-size: 28px; margin-bottom: 10px;">vtoraraka.mk</h1>
            <p style="color: #6b7280; font-size: 16px;">Second-hand. First choice.</p>
          </div>
          
          <div style="background: #f0fdf4; padding: 30px; border-radius: 12px; margin-bottom: 30px; border: 2px solid #059669;">
            <h2 style="color: #059669; font-size: 24px; margin-bottom: 20px;">🎉 Congratulations! You're Approved!</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Здраво ${application.full_name},
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Excellent! Your seller application has been approved! You can now start selling on vtoraraka.mk.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #059669;">
              <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 15px;">Next Steps:</h3>
              <ol style="color: #374151; font-size: 14px; line-height: 1.6;">
                <li style="margin-bottom: 8px;">Use your email to sign in</li>
                <li style="margin-bottom: 8px;">Go to the seller dashboard</li>
                <li style="margin-bottom: 8px;">Add your first products</li>
                <li style="margin-bottom: 8px;">Start selling!</li>
              </ol>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/seller-dashboard" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                Open Seller Dashboard
              </a>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              If you have any questions, contact us at <a href="mailto:${process.env.EMAIL_USER}" style="color: #059669; text-decoration: none;">${process.env.EMAIL_USER}</a>.
            </p>
            <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">
              &copy; ${new Date().getFullYear()} vtoraraka.mk. All rights reserved.
            </p>
          </div>
        </div>
      ` : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; font-size: 28px; margin-bottom: 10px;">vtoraraka.mk</h1>
            <p style="color: #6b7280; font-size: 16px;">Second-hand. First choice.</p>
          </div>
          
          <div style="background: #fef2f2; padding: 30px; border-radius: 12px; margin-bottom: 30px; border: 2px solid #dc2626;">
            <h2 style="color: #dc2626; font-size: 24px; margin-bottom: 20px;">Seller Application Update</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hello ${application.full_name},
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Thank you for your interest in becoming a seller on vtoraraka.mk. After careful review, we unfortunately cannot approve your application at this time.
            </p>
            
            ${notes ? `
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626;">
                <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 15px;">Notes:</h3>
                <p style="color: #374151; font-size: 14px; line-height: 1.6;">${notes}</p>
              </div>
            ` : ''}

            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-top: 20px; margin-bottom: 20px;">
              Please don't be discouraged. You can apply again in the future when you have more experience or different products.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              If you have any questions, contact us at <a href="mailto:${process.env.EMAIL_USER}" style="color: #059669; text-decoration: none;">${process.env.EMAIL_USER}</a>.
            </p>
            <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">
              &copy; ${new Date().getFullYear()} vtoraraka.mk. All rights reserved.
            </p>
          </div>
        </div>
      `;

      await sendEmail({
        to: application.email,
        subject: subject,
        html: emailContent,
      });
    } catch (emailError) {
      console.error("Error sending notification email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      application: updatedApplication,
      message: `Application ${action} successfully`
    });

  } catch (error) {
    console.error("Error in PUT seller applications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase.admin";
import { sendEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  try {
    // Get all seller applications (not just pending)
    const { data: applications, error } = await supabaseAdmin
      .from("seller_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching seller applications:", error);
      return NextResponse.json(
        { error: "Failed to fetch applications" },
        { status: 500 }
      );
    }

    return NextResponse.json({ applications });
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
            <p style="color: #6b7280; font-size: 16px;">Втора рака. Прв избор.</p>
          </div>
          
          <div style="background: #f0fdf4; padding: 30px; border-radius: 12px; margin-bottom: 30px; border: 2px solid #059669;">
            <h2 style="color: #059669; font-size: 24px; margin-bottom: 20px;">🎉 Congratulations! You're Approved!</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Здраво ${application.full_name},
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Одлично! Вашата апликација за продавач е одобрена! Сега можете да започнете да продавате на vtoraraka.mk.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #059669;">
              <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 15px;">Следни чекори:</h3>
              <ol style="color: #374151; font-size: 14px; line-height: 1.6;">
                <li style="margin-bottom: 8px;">Користете ја вашата е-пошта за да се најавите</li>
                <li style="margin-bottom: 8px;">Одете на продавачкиот панел</li>
                <li style="margin-bottom: 8px;">Додадете ги вашите први производи</li>
                <li style="margin-bottom: 8px;">Започнете да продавате!</li>
              </ol>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/seller-dashboard" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                Отвори продавачки панел
              </a>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Ако имате прашања, контактирајте не на <a href="mailto:${process.env.EMAIL_USER}" style="color: #059669; text-decoration: none;">${process.env.EMAIL_USER}</a>.
            </p>
            <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">
              &copy; ${new Date().getFullYear()} vtoraraka.mk. Сите права се задржани.
            </p>
          </div>
        </div>
      ` : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; font-size: 28px; margin-bottom: 10px;">vtoraraka.mk</h1>
            <p style="color: #6b7280; font-size: 16px;">Втора рака. Прв избор.</p>
          </div>
          
          <div style="background: #fef2f2; padding: 30px; border-radius: 12px; margin-bottom: 30px; border: 2px solid #dc2626;">
            <h2 style="color: #dc2626; font-size: 24px; margin-bottom: 20px;">Seller Application Update</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Здраво ${application.full_name},
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Благодариме за вашето интерес за да станете продавач на vtoraraka.mk. По внимателно разгледување, за жал не можеме да ја одобриме вашата апликација во моментов.
            </p>
            
            ${notes ? `
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626;">
                <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 15px;">Забелешки:</h3>
                <p style="color: #374151; font-size: 14px; line-height: 1.6;">${notes}</p>
              </div>
            ` : ''}

            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-top: 20px; margin-bottom: 20px;">
              Ве молиме, не се обесхрабрувате. Можете да аплицирате повторно во иднина кога ќе имате повеќе искуство или различни производи.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Ако имате прашања, контактирајте не на <a href="mailto:${process.env.EMAIL_USER}" style="color: #059669; text-decoration: none;">${process.env.EMAIL_USER}</a>.
            </p>
            <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">
              &copy; ${new Date().getFullYear()} vtoraraka.mk. Сите права се задржани.
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

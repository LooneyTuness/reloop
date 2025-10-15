// Create Admin User via API Script
// Run this script to create an admin user programmatically
// This is the recommended approach for production

const { createClient } = require("@supabase/supabase-js");

// Configuration - Update these values
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "your-supabase-url";
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "your-service-role-key";

// Admin user details - Update these
const ADMIN_EMAIL = "admin@yourdomain.com";
const ADMIN_PASSWORD = "your-secure-password";
const ADMIN_NAME = "Platform Administrator";

async function createAdminUser() {
  try {
    // Create Supabase admin client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log("Creating admin user...");

    // Step 1: Create auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: {
          full_name: ADMIN_NAME,
        },
      });

    if (authError) {
      console.error("Error creating auth user:", authError);
      return;
    }

    console.log("Auth user created:", authData.user.id);

    // Step 2: Create seller profile with admin role
    const { data: profileData, error: profileError } = await supabase
      .from("seller_profiles")
      .insert({
        user_id: authData.user.id,
        email: ADMIN_EMAIL,
        full_name: ADMIN_NAME,
        role: "admin",
        is_approved: true,
        business_name: "Platform Administration",
      })
      .select()
      .single();

    if (profileError) {
      console.error("Error creating admin profile:", profileError);
      return;
    }

    console.log("Admin profile created successfully:", profileData);
    console.log("Admin user ID:", authData.user.id);
    console.log("Admin email:", ADMIN_EMAIL);
    console.log("Admin password:", ADMIN_PASSWORD);
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

// Run the script
createAdminUser();

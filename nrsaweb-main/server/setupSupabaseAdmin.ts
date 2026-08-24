import { supabase } from "./lib/supabase.js";

async function setupAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@nrsa.com.ng";
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "NRSA Super Administrator";

  if (!password) {
    console.error("❌ ERROR: ADMIN_PASSWORD environment variable is required");
    console.error("Set it before running this script:");
    console.error("  ADMIN_PASSWORD=YourSecurePassword tsx server/setupSupabaseAdmin.ts");
    process.exit(1);
  }

  console.log("🔧 Setting up Supabase admin account...");
  console.log("Email:", email);

  try {
    console.log("\n1️⃣ Creating user in Supabase Auth...");
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        console.log("✅ User already exists in Supabase Auth");
      } else {
        console.error("❌ Auth creation failed:", authError.message);
        throw authError;
      }
    } else {
      console.log("✅ User created in Supabase Auth");
      console.log("   User ID:", authData.user.id);
    }

    console.log("\n2️⃣ Creating/updating admin record in database...");
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (existingAdmin) {
      console.log("✅ Admin record already exists in database");
      console.log("   Admin ID:", existingAdmin.id);
      console.log("   Role:", existingAdmin.role);
      
      const { error: updateError } = await supabase
        .from('admins')
        .update({
          name,
          role: 'super-admin',
          protected: true
        })
        .eq('email', email);

      if (updateError) {
        console.error("❌ Failed to update admin:", updateError.message);
      } else {
        console.log("✅ Admin record updated to super-admin with protection");
      }
    } else {
      const { data: newAdmin, error: createError } = await supabase
        .from('admins')
        .insert({
          email,
          name,
          role: 'super-admin',
          protected: true
        })
        .select()
        .single();

      if (createError) {
        console.error("❌ Failed to create admin:", createError.message);
        throw createError;
      } else {
        console.log("✅ Admin record created in database");
        console.log("   Admin ID:", newAdmin.id);
      }
    }

    console.log("\n✅ SETUP COMPLETE!");
    console.log("\nYou can now login with:");
    console.log("Email:", email);
    console.log("Password: [password from environment]");

  } catch (error: any) {
    console.error("\n❌ Setup failed:", error.message);
    process.exit(1);
  }
}

setupAdmin().then(() => process.exit(0));

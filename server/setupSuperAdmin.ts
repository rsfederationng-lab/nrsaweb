import { supabase } from "./lib/supabase.js";

/**
 * Setup Super Admin Account
 * 
 * This script creates the super admin in both:
 * 1. Supabase Auth (for authentication)
 * 2. Admins table (for role and metadata)
 * 
 * Required Environment Variables:
 * - ADMIN_EMAIL: Admin email (default: admin@nrsa.com.ng)
 * - ADMIN_PASSWORD: Admin password (REQUIRED)
 * - ADMIN_NAME: Display name (default: NRSA Administrator)
 */

async function setupSuperAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@nrsa.com.ng";
  const password = process.env.ADMIN_PASSWORD || "nrsa@Admin2024!";
  const name = process.env.ADMIN_NAME || "NRSA Administrator";

  if (!supabase) {
    console.error("❌ Supabase not configured");
    process.exit(1);
  }

  console.log(`🔧 Setting up super admin: ${email}`);

  try {
    // Step 1: Create or update user in Supabase Auth
    console.log("Step 1: Creating/updating Supabase Auth user...");
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    });

    if (authError) {
      // User might already exist, try to update password
      console.log("User might exist, attempting to update...");
      const { data: users } = await supabase.auth.admin.listUsers();
      const existingUser = users?.users.find(u => u.email === email);
      
      if (existingUser) {
        await supabase.auth.admin.updateUserById(existingUser.id, { password });
        console.log("✅ Updated existing Supabase Auth user");
      } else {
        throw authError;
      }
    } else {
      console.log("✅ Created Supabase Auth user");
    }

    // Step 2: Create or update admin in admins table
    console.log("Step 2: Creating/updating admin in database...");
    
    const { data: existing } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (existing) {
      // Update existing
      await supabase
        .from('admins')
        .update({
          name,
          role: 'super-admin',
          protected: true
        })
        .eq('email', email);
      console.log("✅ Updated existing admin record");
    } else {
      // Create new
      await supabase
        .from('admins')
        .insert({
          email,
          name,
          password_hash: 'managed_by_supabase_auth', // Placeholder - actual auth is via Supabase
          role: 'super-admin',
          protected: true
        });
      console.log("✅ Created new admin record");
    }

    console.log("\n✅ Super admin setup complete!");
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password.substring(0, 3)}***`);
    console.log(`   Name: ${name}`);
    console.log(`   Role: super-admin`);
    console.log(`   Protected: true`);
    console.log("\nYou can now login at /admin/login");

    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error setting up super admin:", error.message);
    console.error(error);
    process.exit(1);
  }
}

setupSuperAdmin();

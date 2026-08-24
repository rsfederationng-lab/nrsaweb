import bcrypt from "bcrypt";
import { storage } from "./storage.js";

/**
 * Create Super Admin Account
 * 
 * This script creates or updates the default super-admin account.
 * All credentials are read from environment variables for security.
 * 
 * Required Environment Variables:
 * - ADMIN_EMAIL: Admin email address (default: admin@nrsa.com.ng)
 * - ADMIN_PASSWORD: Admin password (REQUIRED - no default)
 * - ADMIN_NAME: Admin display name (default: NRSA Admin)
 * 
 * Usage:
 *   Set environment variables and run: npm run create-admin
 * 
 * Security:
 * - Password is hashed with bcrypt (10 rounds) before storage
 * - Never logs or exposes the password
 * - Account is marked as protected to prevent deletion
 */
async function main() {
  // ✅ Read from environment variables
  const email = process.env.ADMIN_EMAIL || "admin@nrsa.com.ng";
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "NRSA Admin";

  // ✅ Validate required fields
  if (!password) {
    console.error("❌ ERROR: ADMIN_PASSWORD environment variable is required");
    console.error("Set it in your .env file or environment:");
    console.error("  ADMIN_PASSWORD=YourSecurePassword123!");
    process.exit(1);
  }

  // ✅ Hash password securely
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if admin already exists
  const existing = await storage.getAdminByEmail(email);
  
  if (existing) {
    // Update existing admin to ensure it's a super-admin with protection
    await storage.updateAdmin(existing.id, {
      name,
      passwordHash: hashedPassword,
      role: "super-admin",
      protected: true as any  // TypeScript workaround - field exists in DB schema
    });
    console.log("✅ Super-admin account updated successfully");
    console.log(`   Email: ${email}`);
    console.log(`   Name: ${name}`);
  } else {
    // Create new admin
    const admin = await storage.createAdmin({
      name,
      email,
      passwordHash: hashedPassword,
      role: "super-admin"
    });
    
    // Immediately update to set protected flag
    await storage.updateAdmin(admin.id, { protected: true as any });
    
    console.log("✅ Super-admin account created successfully");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.name}`);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Failed to create/update admin:", error.message);
  process.exit(1);
});

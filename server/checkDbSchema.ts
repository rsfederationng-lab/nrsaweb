import { supabase } from "./lib/supabase.js";

async function checkSchema() {
  console.log("🔍 Auditing Supabase database schema...\n");

  const tablesToCheck = [
    { name: "admins", expectedColumns: ["id", "name", "email", "password_hash", "role", "protected", "created_at"] },
    { name: "contacts", expectedColumns: ["id", "name", "email", "phone", "subject", "message", "is_read", "created_at"] },
    { name: "events", expectedColumns: ["id", "title", "description", "venue", "city", "state", "event_date", "registration_deadline", "registration_link", "image_url", "is_featured", "created_at"] },
    { name: "leaders", expectedColumns: ["id", "name", "position", "photo_url", "bio", "order", "created_at"] },
    { name: "news", expectedColumns: ["id", "title", "content", "excerpt", "image_url", "is_featured", "published_at", "created_at"] },
    { name: "players", expectedColumns: ["id", "name", "photo_url", "club", "state", "category", "total_points", "achievements", "awards_won", "games_played", "biography", "created_at"] },
    { name: "clubs", expectedColumns: ["id", "name", "logo_url", "city", "state", "manager_name", "contact_email", "contact_phone", "is_registered", "created_at"] },
    { name: "media", expectedColumns: ["id", "title", "description", "image_url", "category", "is_external", "thumbnail_url", "created_at"] },
    { name: "affiliations", expectedColumns: ["id", "name", "logo_url", "website", "description", "order", "created_at"] },
    { name: "hero_slides", expectedColumns: ["id", "image_url", "headline", "subheadline", "cta_text", "cta_link", "order", "is_active", "created_at"] },
    { name: "site_settings", expectedColumns: ["id", "key", "value", "updated_at"] },
  ];

  const mismatches: Array<{ table: string; missing: string[]; extra: string[] }> = [];

  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table.name)
        .select("*")
        .limit(1);

      if (error) {
        console.log(`❌ Table "${table.name}": ${error.message}`);
        continue;
      }

      const actualColumns = data && data[0] ? Object.keys(data[0]) : [];
      const missing = table.expectedColumns.filter(col => !actualColumns.includes(col));
      const extra = actualColumns.filter(col => !table.expectedColumns.includes(col));

      if (missing.length > 0 || extra.length > 0) {
        mismatches.push({ table: table.name, missing, extra });
        console.log(`⚠️  Table "${table.name}":`);
        if (missing.length > 0) console.log(`   Missing columns: ${missing.join(", ")}`);
        if (extra.length > 0) console.log(`   Extra columns: ${extra.join(", ")}`);
      } else {
        console.log(`✅ Table "${table.name}": Schema matches`);
      }
    } catch (err: any) {
      console.log(`❌ Table "${table.name}": ${err.message}`);
    }
  }

  console.log("\n" + "=".repeat(60));
  if (mismatches.length === 0) {
    console.log("✅ All schemas match!");
  } else {
    console.log(`⚠️  Found ${mismatches.length} table(s) with schema mismatches`);
    console.log("\n📋 Summary of fixes needed:");
    
    for (const mismatch of mismatches) {
      if (mismatch.missing.length > 0) {
        console.log(`\n-- Add missing columns to ${mismatch.table}:`);
        for (const col of mismatch.missing) {
          console.log(`ALTER TABLE ${mismatch.table} ADD COLUMN ${col} [TYPE];`);
        }
      }
    }
  }
}

checkSchema().then(() => process.exit(0)).catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});

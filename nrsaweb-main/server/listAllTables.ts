import { supabase } from "./lib/supabase.js";

async function listTables() {
  if (!supabase) {
    console.error("❌ Supabase not configured");
    process.exit(1);
  }

  console.log("Checking all tables in Supabase...\n");

  const tableNames = [
    'admins', 'hero_slides', 'news', 'events', 'players', 
    'clubs', 'leaders', 'media', 'affiliations', 'contacts', 'site_settings'
  ];

  for (const table of tableNames) {
    try {
      // Try to fetch data
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        const columns = data && data.length > 0 ? Object.keys(data[0]).join(', ') : 'Empty table';
        console.log(`✅ ${table}: ${columns}`);
      }
    } catch (err: any) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }

  console.log("\n💡 Note: Tables that exist but are empty will show 'Empty table'");
  console.log("💡 Tables with errors might not exist or have permission issues");

  process.exit(0);
}

listTables();

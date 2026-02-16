import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const tables = [
  'contacts',
  'news',
  'events',
  'players',
  'clubs',
  'leaders',
  'media',
  'hero_slides',
  'affiliations',
  'site_settings',
  'member_states',
  'admins'
];

async function disableRLS() {
  console.log('🔧 Disabling Row Level Security on all tables...\n');
  
  for (const table of tables) {
    try {
      const { error } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE ${table} DISABLE ROW LEVEL SECURITY;`
      });
      
      if (error) {
        console.error(`❌ Failed to disable RLS on ${table}:`, error.message);
      } else {
        console.log(`✅ Disabled RLS on ${table}`);
      }
    } catch (err: any) {
      console.error(`❌ Error disabling RLS on ${table}:`, err.message);
    }
  }
  
  console.log('\n✅ RLS disable process complete');
}

disableRLS().catch(console.error);

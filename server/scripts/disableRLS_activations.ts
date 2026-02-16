
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const tables = [
    'interschool_years',
    'school_standings',
    'school_activations'
];

async function disableRLS() {
    console.log('🔧 Disabling Row Level Security on Interschool tables...\n');

    for (const table of tables) {
        try {
            // Try using raw SQL via pgv8/exec_sql if available, or just straight query if allowed
            // The previous script used rpc 'exec_sql'. Let's try that first.
            const { error } = await supabase.rpc('exec_sql', {
                sql: `ALTER TABLE ${table} DISABLE ROW LEVEL SECURITY;`
            });

            if (error) {
                console.error(`❌ Failed to disable RLS on ${table} (RPC error):`, error.message);
                // Fallback: maybe we can just run it if we have direct connection? No, Supabase JS client only allows data ops unless we have specific RPCs.
                // But wait, if RLS is the problem, disabling it requires being an owner or superuser. The service role key should have permissions.
                // If exec_sql doesn't work, we might be stuck unless we have direct PG checkout.
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


import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function createTableViaRPC() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        console.error('❌ Supabase credentials missing in .env');
        process.exit(1);
    }

    console.log('Initializing Supabase client...');
    const supabase = createClient(url, key);

    const sql = `
    CREATE TABLE IF NOT EXISTS affiliations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        logo_url TEXT NOT NULL,
        website TEXT,
        description TEXT,
        "order" INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;

    console.log('Running SQL via "exec_sql" RPC...');

    const { data, error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
        console.error('❌ Error executing SQL via RPC:', error);
        console.error('Detailed message:', error.message);
        // If exec_sql doesn't exist, this will fail.
        if (error.message && error.message.includes('function "exec_sql" does not exist')) {
            console.error('⚠️ The "exec_sql" RPC function does not exist in your database.');
        }
    } else {
        console.log('✅ SQL executed successfully (Result may be null if no rows returned)');
        console.log('Table "affiliations" should now exist.');
    }
}

createTableViaRPC();

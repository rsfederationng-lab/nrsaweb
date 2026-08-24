
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env manually
const envPath = path.resolve(process.cwd(), '.env');
const env = fs.readFileSync(envPath, 'utf8');
const lines = env.split('\n');
let SUPABASE_URL = '';
let SUPABASE_SERVICE_ROLE_KEY = '';

lines.forEach(line => {
    if (line.startsWith('SUPABASE_URL=')) SUPABASE_URL = line.split('=')[1].trim();
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) SUPABASE_SERVICE_ROLE_KEY = line.split('=')[1].trim();
});

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

const tables = ['school_activations', 'interschool_years', 'school_standings'];

async function disableRLS() {
    console.log("Starting RLS Disable...");
    for (const table of tables) {
        console.log(`Disabling RLS on ${table}...`);
        const { error } = await supabase.rpc('exec_sql', {
            sql: `ALTER TABLE ${table} DISABLE ROW LEVEL SECURITY;`
        });

        if (error) {
            console.error(`Error on ${table}:`, error.message);
            // Fallback strategy: if exec_sql fails, maybe we can't do it via client.
        } else {
            console.log(`Success: ${table} RLS disabled.`);
        }
    }
}

disableRLS();


const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load env manualy
const env = fs.readFileSync('.env', 'utf8');
const lines = env.split('\n');
let SUPABASE_URL = '';
let SUPABASE_SERVICE_ROLE_KEY = '';

lines.forEach(line => {
    if (line.startsWith('SUPABASE_URL=')) SUPABASE_URL = line.split('=')[1].trim();
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) SUPABASE_SERVICE_ROLE_KEY = line.split('=')[1].trim();
});

console.log('URL:', SUPABASE_URL ? 'Found' : 'Missing');
console.log('Key:', SUPABASE_SERVICE_ROLE_KEY ? 'Found' : 'Missing');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function testInsert() {
    console.log("Attempting insert...");

    // Check if we can select first
    const { data: list, error: listError } = await supabase.from('school_activations').select('*').limit(1);
    if (listError) console.error("List Error:", listError);
    else console.log("List success, count:", list.length);

    // Attempt insert
    const payload = {
        year_id: 1, // Assumption: year_id 1 exists or constraint will fail, but that's different from RLS
        school_name: 'Test School',
        event_title: 'Test Event',
        event_date: new Date().toISOString()
    };

    // We need a valid year_id. Let's fetch one.
    const { data: years } = await supabase.from('interschool_years').select('id').limit(1);
    if (!years || years.length === 0) {
        console.error("No years found to link to.");
        return;
    }
    payload.year_id = years[0].id;

    const { data, error } = await supabase.from('school_activations').insert(payload).select();

    if (error) {
        console.error("Insert Error:", error);
    } else {
        console.log("Insert Success:", data);
        // Cleanup
        await supabase.from('school_activations').delete().eq('id', data[0].id);
        console.log("Cleanup Success");
    }
}

testInsert();

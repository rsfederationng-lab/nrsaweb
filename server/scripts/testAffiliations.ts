
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function testAffiliations() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        console.error('❌ Supabase credentials missing');
        process.exit(1);
    }

    const supabase = createClient(url, key);

    console.log('Testing "affiliations" table existence...');

    const { data, error } = await supabase
        .from('affiliations')
        .select('*')
        .limit(1);

    if (error) {
        console.error('❌ Error selecting from affiliations:', error);
        console.error('Message:', error.message);
        console.error('Hint:', error.hint);
    } else {
        console.log('✅ Table "affiliations" exists!');
        console.log('Data:', data);
    }
}

testAffiliations();

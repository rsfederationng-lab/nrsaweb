
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function checkData() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        console.error('❌ Supabase credentials missing');
        process.exit(1);
    }

    const supabase = createClient(url, key);

    console.log('Fetching all affiliations...');
    const { data, error } = await supabase.from('affiliations').select('*');

    if (error) {
        console.error('❌ Error:', error.message);
    } else {
        console.log('✅ Affiliations found:', data?.length);
        console.log(JSON.stringify(data, null, 2));
    }
}

checkData();

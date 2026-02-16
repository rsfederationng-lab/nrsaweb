
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = 'https://jrijjoszmlupeljifedk.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_KEY;

console.log(`Testing frontend connection to ${supabaseUrl}`);
console.log(`Using key length: ${supabaseKey ? supabaseKey.length : 0}`);

if (!supabaseKey) {
    console.error("VITE_SUPABASE_KEY is missing in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        // Try to select from a public table, e.g. 'news' or just check health if possible.
        // We'll try to get 1 row from 'interschool_years' which we know exists from previous tasks.
        const { data, error } = await supabase.from('interschool_years').select('count').limit(1);

        if (error) {
            console.error("Connection failed:", error.message);
        } else {
            console.log("Connection successful! Data:", data);
        }
    } catch (err) {
        console.error("Unexpected error:", err);
    }
}

testConnection();

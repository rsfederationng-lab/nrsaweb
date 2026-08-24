
import dotenv from 'dotenv';
dotenv.config();

const HARDCODED_URL = 'https://jrijjoszmlupeljifedk.supabase.co';

console.log('--- Env Check 2 ---');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('Match Hardcoded:', process.env.SUPABASE_URL === HARDCODED_URL);
console.log('VITE_SUPABASE_KEY present:', !!process.env.VITE_SUPABASE_KEY);
console.log('VITE_SUPABASE_ANON_KEY present:', !!process.env.VITE_SUPABASE_ANON_KEY);
console.log('--- End Check ---');
process.exit(0);

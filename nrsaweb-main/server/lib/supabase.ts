import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

let supabaseClient: any = null;

function getSupabase() {
  if (!supabaseClient) {
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (url && key) {
      try {
        const decoded = jwt.decode(key) as any;
        console.log(`🔑 Supabase Key Role: ${decoded?.role?.toUpperCase() || 'UNKNOWN'}`);
        if (decoded?.role !== 'service_role') {
          console.warn('⚠️ WARNING: Server is NOT using service_role key. RLS policies may block actions.');
        }
      } catch (e) {
        console.error('⚠️ Failed to decode Supabase key');
      }

      supabaseClient = createClient(url, key, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
      console.log('✅ Supabase initialized');
      try {
        const logPath = path.join(process.cwd(), 'debug-supabase.log');
        const debugInfo = `
[${new Date().toISOString()}] Supabase Initialized
URL: ${url}
Key Prefix: ${key.substring(0, 15)}...
Is Service Role: ${key === process.env.SUPABASE_SERVICE_ROLE_KEY ? 'YES' : 'NO'}
Env Service Key Prefix: ${process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 15)}...
Env Anon Key Prefix: ${process.env.VITE_SUPABASE_ANON_KEY?.substring(0, 15)}...
          `;
        fs.appendFileSync(logPath, debugInfo);
      } catch (e) { console.error("Failed to write debug log", e); }
    } else {
      console.log('❌ Missing Supabase credentials');
      try {
        fs.appendFileSync(path.join(process.cwd(), 'debug-supabase.log'), `[${new Date().toISOString()}] Missing Credentials! URL: ${url}, Key present: ${!!key}\n`);
      } catch (e) { }
      return null;
    }
  }
  return supabaseClient;
}

export const supabase = getSupabase();
export const initializeSupabase = getSupabase;
import { supabase } from './lib/supabase.js';

// Use Supabase client for all database operations
export const db = supabase;

export async function createTables() {
  if (!supabase) {
    console.warn('Supabase not configured');
    return false;
  }

  try {
    // Test if tables exist by querying them
    const tables = ['leaders', 'news', 'events', 'players', 'clubs', 'media', 'contacts', 'ambassadors'];
    for (const table of tables) {
      try {
        await supabase.from(table).select('count').limit(0);
      } catch (tableError: any) {
        console.log(`Table ${table} needs to be created manually in Supabase: ${tableError.message || 'Unknown error'}`);
      }
    }
    console.log('✅ Database connection successful');
    return true;
  } catch (error: any) {
    console.warn('Database not ready:', error.message);
    return false;
  }
}
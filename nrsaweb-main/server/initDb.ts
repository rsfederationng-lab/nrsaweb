import { supabase } from './lib/supabase.js';
import fs from 'fs';
import path from 'path';

async function initializeDatabase() {
  if (!supabase) {
    console.error('Supabase not configured');
    return;
  }

  try {
    const sqlPath = path.join(process.cwd(), 'supabase-init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement.trim() + ';' });
        if (error) {
          console.error('SQL Error:', error.message);
        }
      }
    }
    
    console.log('✅ Database initialized successfully');
  } catch (error: any) {
    console.error('Database initialization failed:', error.message);
  }
}

initializeDatabase();
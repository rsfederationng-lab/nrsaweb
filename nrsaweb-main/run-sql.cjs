
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load .env manually
const envPath = path.resolve(process.cwd(), '.env');
const env = fs.readFileSync(envPath, 'utf8');
const lines = env.split('\n');
let DATABASE_URL = '';

lines.forEach(line => {
    if (line.startsWith('DATABASE_URL=')) DATABASE_URL = line.split('=')[1].trim();
});

if (!DATABASE_URL) {
    console.error("Missing DATABASE_URL");
    process.exit(1);
}

// Remove surrounding quotes if present
if (DATABASE_URL.startsWith('"') && DATABASE_URL.endsWith('"')) {
    DATABASE_URL = DATABASE_URL.slice(1, -1);
}

const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Supabase
});

async function runSQL() {
    try {
        await client.connect();
        console.log("Connected to database.");

        const queries = [
            'ALTER TABLE school_activations DISABLE ROW LEVEL SECURITY;',
            'ALTER TABLE interschool_years DISABLE ROW LEVEL SECURITY;',
            'ALTER TABLE school_standings DISABLE ROW LEVEL SECURITY;'
        ];

        for (const query of queries) {
            console.log(`Executing: ${query}`);
            await client.query(query);
            console.log("Success.");
        }
    } catch (err) {
        console.error("Error executing SQL:", err);
    } finally {
        await client.end();
    }
}

runSQL();

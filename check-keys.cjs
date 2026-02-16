
const fs = require('fs');
const jwt = require('jsonwebtoken'); // Assuming jsonwebtoken is installed, else we'll need basic base64 decode

function decode(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return "Invalid Token";
        const payload = Buffer.from(parts[1], 'base64').toString();
        return JSON.parse(payload);
    } catch (e) {
        return "Error decoding";
    }
}

const env = fs.readFileSync('.env', 'utf8');
const lines = env.split('\n');

lines.forEach(line => {
    if (line.startsWith('VITE_SUPABASE_KEY=')) {
        const key = line.split('=')[1].trim();
        const decoded = decode(key);
        console.log('VITE_SUPABASE_KEY role:', decoded.role);
    }
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
        const key = line.split('=')[1].trim();
        const decoded = decode(key);
        console.log('SUPABASE_SERVICE_ROLE_KEY role:', decoded.role);
    }
});

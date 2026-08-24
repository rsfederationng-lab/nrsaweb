// Check environment variables during build
console.log('Environment Variables Check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VITE_API_URL:', process.env.VITE_API_URL);

// Check if .env.production exists
const fs = require('fs');
const envPath = './client/.env.production';

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  console.log('✅ .env.production exists:', content.trim());
} else {
  console.log('❌ .env.production missing');
}
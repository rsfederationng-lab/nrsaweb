// Check Railway environment variables
const requiredVars = [
  'NODE_ENV',
  'JWT_SECRET', 
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_ANON_KEY',
  'DATABASE_URL',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'ADMIN_NAME'
];

console.log('Railway Environment Variables Check:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  console.log(`${varName}: ${value ? '✅ Set' : '❌ Missing'}`);
});

if (process.env.PORT) {
  console.log(`PORT: ✅ ${process.env.PORT}`);
}
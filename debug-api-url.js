// Debug frontend API URL configuration
const fs = require('fs');
const path = require('path');

// Check if build files exist
const buildPath = path.join(__dirname, 'dist', 'public');
const indexPath = path.join(buildPath, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.log('❌ Build files not found. Run npm run build:client first');
  process.exit(1);
}

// Read built files to check API URL
const indexContent = fs.readFileSync(indexPath, 'utf8');
const jsFiles = fs.readdirSync(path.join(buildPath, 'assets')).filter(f => f.endsWith('.js'));

console.log('🔍 Checking API URL in build files...');

let foundApiUrl = false;
jsFiles.forEach(file => {
  const content = fs.readFileSync(path.join(buildPath, 'assets', file), 'utf8');
  if (content.includes('api.nrsa.com.ng')) {
    console.log(`✅ Found api.nrsa.com.ng in ${file}`);
    foundApiUrl = true;
  }
});

if (!foundApiUrl) {
  console.log('❌ api.nrsa.com.ng NOT found in build files');
  console.log('💡 Check client/.env.production file exists');
} else {
  console.log('✅ Frontend correctly configured for api.nrsa.com.ng');
}
// Verify frontend build uses correct API URL
const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'dist', 'public', 'index.html');

if (fs.existsSync(indexPath)) {
  const content = fs.readFileSync(indexPath, 'utf8');
  if (content.includes('api.nrsa.com.ng')) {
    console.log('✅ Frontend configured for api.nrsa.com.ng');
  } else {
    console.log('❌ Frontend not using production API URL');
  }
} else {
  console.log('❌ Build files not found. Run npm run build:client first');
}
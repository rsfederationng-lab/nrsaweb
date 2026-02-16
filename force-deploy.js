#!/usr/bin/env node

// Force deployment script to clear all caches and redeploy
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🚀 Starting force deployment...');

// 1. Clear all cache directories
const cacheDirs = [
  'node_modules/.vite',
  'dist',
  'public_html'
];

cacheDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`🗑️  Clearing ${dir}...`);
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// 2. Create cache-busting timestamp
const timestamp = Date.now();
console.log(`⏰ Cache-bust timestamp: ${timestamp}`);

// 3. Update index.html with cache-busting
const indexPath = 'client/index.html';
if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  // Add timestamp to prevent caching
  indexContent = indexContent.replace(
    '<meta charset="UTF-8" />',
    `<meta charset="UTF-8" />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <meta name="cache-bust" content="${timestamp}" />`
  );
  fs.writeFileSync(indexPath, indexContent);
  console.log('📝 Updated index.html with cache-busting headers');
}

console.log('✅ Force deployment preparation complete!');
console.log('📋 Next steps:');
console.log('   1. Run: npm run build');
console.log('   2. Run: npm run deploy:cpanel');
console.log('   3. Clear browser cache (Ctrl+Shift+R)');
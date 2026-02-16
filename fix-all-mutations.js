#!/usr/bin/env node

// Quick script to fix all forceRefresh calls to use queryClient parameter

const fs = require('fs');
const path = require('path');

const adminPages = [
  'Events.tsx',
  'Players.tsx', 
  'Clubs.tsx',
  'Leaders.tsx',
  'Media.tsx',
  'Contacts.tsx',
  'Admins.tsx',
  'Memberstate.tsx'
];

const adminDir = 'c:/Users/ABBEY/Downloads/nrsa-website/client/src/pages/admin/';

adminPages.forEach(page => {
  const filePath = path.join(adminDir, page);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace all forceRefresh calls to include queryClient parameter
    content = content.replace(/await forceRefresh\(\[([^\]]+)\]\)/g, 'await forceRefresh([$1], queryClient)');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${page}`);
  }
});

console.log('All admin pages fixed to use queryClient parameter');
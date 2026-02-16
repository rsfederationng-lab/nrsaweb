#!/usr/bin/env node

/**
 * CRUD Operations Test Script
 * Tests Create, Read, Update, Delete operations for all entities
 */

const API_BASE = process.env.API_URL || 'http://localhost:3000';

// Test data for each entity
const testData = {
  news: {
    title: "Test News Article",
    excerpt: "This is a test excerpt",
    content: "This is test content for the news article",
    imageUrl: "https://example.com/test.jpg",
    isFeatured: false
  },
  events: {
    title: "Test Event",
    description: "This is a test event description",
    venue: "Test Venue",
    city: "Test City",
    state: "Test State",
    eventDate: new Date().toISOString(),
    isFeatured: false
  },
  players: {
    name: "Test Player",
    club: "Test Club",
    state: "Test State",
    category: "Senior",
    totalPoints: 100,
    awardsWon: 5,
    gamesPlayed: 20
  },
  clubs: {
    name: "Test Club",
    city: "Test City",
    state: "Test State",
    managerName: "Test Manager",
    contactEmail: "test@example.com",
    contactPhone: "1234567890",
    isRegistered: true
  },
  leaders: {
    name: "Test Leader",
    position: "Test Position",
    bio: "Test biography",
    order: 1
  },
  media: {
    title: "Test Media",
    description: "Test media description",
    imageUrl: "https://example.com/test.jpg",
    category: "photos"
  },
  contacts: {
    name: "Test Contact",
    email: "test@example.com",
    phone: "1234567890",
    subject: "Test Subject",
    message: "Test message"
  }
};

async function makeRequest(method, endpoint, data = null) {
  const url = `${API_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`${response.status}: ${result.error || response.statusText}`);
    }
    
    return result;
  } catch (error) {
    console.error(`❌ ${method} ${endpoint} failed:`, error.message);
    throw error;
  }
}

async function testCRUD(entity, endpoint) {
  console.log(`\n🧪 Testing ${entity.toUpperCase()} CRUD operations...`);
  
  try {
    // CREATE
    console.log(`  📝 Creating ${entity}...`);
    const created = await makeRequest('POST', endpoint, testData[entity]);
    console.log(`  ✅ Created ${entity} with ID: ${created.id}`);
    
    // READ (Get All)
    console.log(`  📖 Reading all ${entity}...`);
    const all = await makeRequest('GET', endpoint);
    console.log(`  ✅ Retrieved ${all.length} ${entity} records`);
    
    // UPDATE
    console.log(`  ✏️  Updating ${entity}...`);
    const updateData = { ...testData[entity] };
    if (updateData.title) updateData.title += " (Updated)";
    if (updateData.name) updateData.name += " (Updated)";
    
    const updated = await makeRequest('PATCH', `${endpoint}/${created.id}`, updateData);
    console.log(`  ✅ Updated ${entity} ID: ${updated.id}`);
    
    // DELETE
    console.log(`  🗑️  Deleting ${entity}...`);
    await makeRequest('DELETE', `${endpoint}/${created.id}`);
    console.log(`  ✅ Deleted ${entity} ID: ${created.id}`);
    
    console.log(`  🎉 ${entity.toUpperCase()} CRUD test completed successfully!`);
    
  } catch (error) {
    console.error(`  ❌ ${entity.toUpperCase()} CRUD test failed:`, error.message);
    return false;
  }
  
  return true;
}

async function runAllTests() {
  console.log('🚀 Starting CRUD Operations Test Suite...');
  console.log(`📡 API Base URL: ${API_BASE}`);
  
  const entities = [
    { name: 'news', endpoint: '/api/news' },
    { name: 'events', endpoint: '/api/events' },
    { name: 'players', endpoint: '/api/players' },
    { name: 'clubs', endpoint: '/api/clubs' },
    { name: 'leaders', endpoint: '/api/leaders' },
    { name: 'media', endpoint: '/api/media' },
    { name: 'contacts', endpoint: '/api/contacts' }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const entity of entities) {
    const success = await testCRUD(entity.name, entity.endpoint);
    if (success) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All CRUD operations are working correctly!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some CRUD operations failed. Check the logs above.');
    process.exit(1);
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ with built-in fetch support');
  console.log('💡 Alternatively, install node-fetch: npm install node-fetch');
  process.exit(1);
}

runAllTests().catch(error => {
  console.error('💥 Test suite crashed:', error);
  process.exit(1);
});
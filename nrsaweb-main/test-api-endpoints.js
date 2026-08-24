// Test all API endpoints
const BASE_URL = 'http://localhost:3000/api';

const endpoints = [
  'GET /test',
  'GET /health',
  'GET /hero-slides',
  'GET /news',
  'GET /events', 
  'GET /players',
  'GET /clubs',
  'GET /member-states',
  'GET /leaders',
  'GET /media',
  'GET /contacts',
  'GET /site-settings'
];

async function testEndpoints() {
  for (const endpoint of endpoints) {
    const [method, path] = endpoint.split(' ');
    try {
      const response = await fetch(`${BASE_URL}${path}`);
      console.log(`${endpoint}: ${response.status} ${response.ok ? '✓' : '✗'}`);
    } catch (error) {
      console.log(`${endpoint}: ERROR - ${error.message}`);
    }
  }
}

testEndpoints();
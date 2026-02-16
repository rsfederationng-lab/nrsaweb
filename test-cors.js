// Test CORS configuration after redeployment
const API_URL = 'https://api.nrsa.com.ng';

async function testCORS() {
  console.log('Testing CORS configuration...');
  
  try {
    // Test preflight OPTIONS request
    const optionsResponse = await fetch(`${API_URL}/api/leaders`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://nrsa.com.ng',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('OPTIONS request:', optionsResponse.status);
    console.log('CORS headers:', {
      'Access-Control-Allow-Origin': optionsResponse.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Credentials': optionsResponse.headers.get('Access-Control-Allow-Credentials'),
      'Access-Control-Allow-Methods': optionsResponse.headers.get('Access-Control-Allow-Methods')
    });
    
    // Test actual GET request
    const getResponse = await fetch(`${API_URL}/api/leaders`, {
      method: 'GET',
      headers: {
        'Origin': 'https://nrsa.com.ng'
      },
      credentials: 'include'
    });
    
    console.log('GET request:', getResponse.status);
    if (getResponse.ok) {
      const data = await getResponse.json();
      console.log('✅ CORS working - received data:', data.length, 'items');
    } else {
      console.log('❌ GET request failed');
    }
    
  } catch (error) {
    console.log('❌ CORS test failed:', error.message);
  }
}

testCORS();
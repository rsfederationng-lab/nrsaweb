// Check if Railway API is accessible
const API_URL = 'https://api.nrsa.com.ng';

async function checkAPI() {
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    console.log('✅ API Status:', data);
  } catch (error) {
    console.log('❌ API Error:', error.message);
  }
}

checkAPI();
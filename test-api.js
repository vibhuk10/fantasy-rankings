const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing API endpoints...');
    
    // Test QB endpoint
    const qbResponse = await axios.get('http://localhost:5000/api/qb');
    console.log('QB API Response:', qbResponse.data);
    
    // Test ADP endpoint
    const adpResponse = await axios.get('http://localhost:5000/api/adp/qb');
    console.log('ADP API Response:', adpResponse.data);
    
  } catch (error) {
    console.error('API Test Error:', error.message);
  }
}

testAPI(); 
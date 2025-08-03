const axios = require('axios');

async function testBackendAPI() {
    console.log('🧪 Testing Backend API...\n');

    try {
        // Test QB endpoint
        console.log('📊 Testing QB endpoint...');
        const qbResponse = await axios.get('http://localhost:5000/api/qb');
        console.log(`✅ QB data: ${qbResponse.data.data.length} players`);

        if (qbResponse.data.data.length > 0) {
            console.log('Sample QB:', qbResponse.data.data[0]);
        }

        // Test RB endpoint
        console.log('\n📊 Testing RB endpoint...');
        const rbResponse = await axios.get('http://localhost:5000/api/rb');
        console.log(`✅ RB data: ${rbResponse.data.data.length} players`);

        // Test WR endpoint
        console.log('\n📊 Testing WR endpoint...');
        const wrResponse = await axios.get('http://localhost:5000/api/wr');
        console.log(`✅ WR data: ${wrResponse.data.data.length} players`);

        // Test TE endpoint
        console.log('\n📊 Testing TE endpoint...');
        const teResponse = await axios.get('http://localhost:5000/api/te');
        console.log(`✅ TE data: ${teResponse.data.data.length} players`);

        console.log('\n🎉 All endpoints working!');

    } catch (error) {
        console.error('❌ API Error:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 Make sure the backend server is running: npm start');
        }
    }
}

testBackendAPI(); 
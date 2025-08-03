// Test script to verify API functions work locally
const testAPI = require('./api/test.js');
const qbSimpleAPI = require('./api/qb-simple.js');

// Mock request and response objects
const mockReq = {
    method: 'GET',
    url: '/api/test',
    headers: {}
};

const mockRes = {
    statusCode: 200,
    headers: {},
    setHeader: function (name, value) {
        this.headers[name] = value;
    },
    status: function (code) {
        this.statusCode = code;
        return this;
    },
    json: function (data) {
        console.log('Response:', JSON.stringify(data, null, 2));
        return this;
    },
    end: function () {
        console.log('Response ended');
    }
};

console.log('Testing API functions...\n');

// Test the test API
console.log('1. Testing /api/test:');
testAPI(mockReq, mockRes);

console.log('\n' + '='.repeat(50) + '\n');

// Test the QB simple API
console.log('2. Testing /api/qb-simple:');
qbSimpleAPI(mockReq, mockRes);

console.log('\nAPI tests completed!'); 
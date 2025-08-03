const axios = require('axios');
const cheerio = require('cheerio');

async function testPFRSelectors() {
  console.log('🔍 Testing PFR Selectors for all stats...\n');
  
  // Test Passing
  console.log('📊 Testing PFR Passing Stats...');
  try {
    const passingResponse = await axios.get('https://www.pro-football-reference.com/years/2024/passing.htm', {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    
    const $passing = cheerio.load(passingResponse.data);
    const passingSelectors = ['#stats_passing tbody tr', '#passing tbody tr', 'table tbody tr'];
    
    passingSelectors.forEach(selector => {
      const rows = $passing(selector);
      console.log(`  ${selector}: ${rows.length} rows found`);
      if (rows.length > 0) {
        console.log('  ✅ Passing data found!');
      }
    });
  } catch (error) {
    console.error('❌ Passing test error:', error.message);
  }
  
  // Test Rushing
  console.log('\n📊 Testing PFR Rushing Stats...');
  try {
    const rushingResponse = await axios.get('https://www.pro-football-reference.com/years/2024/rushing.htm', {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    
    const $rushing = cheerio.load(rushingResponse.data);
    const rushingSelectors = ['#stats_rushing tbody tr', '#rushing tbody tr', 'table tbody tr'];
    
    rushingSelectors.forEach(selector => {
      const rows = $rushing(selector);
      console.log(`  ${selector}: ${rows.length} rows found`);
      if (rows.length > 0) {
        console.log('  ✅ Rushing data found!');
      }
    });
  } catch (error) {
    console.error('❌ Rushing test error:', error.message);
  }
  
  // Test Receiving (we already know this one works)
  console.log('\n📊 Testing PFR Receiving Stats...');
  try {
    const receivingResponse = await axios.get('https://www.pro-football-reference.com/years/2024/receiving.htm', {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    
    const $receiving = cheerio.load(receivingResponse.data);
    const receivingSelectors = ['#stats_receiving tbody tr', '#receiving tbody tr', 'table tbody tr'];
    
    receivingSelectors.forEach(selector => {
      const rows = $receiving(selector);
      console.log(`  ${selector}: ${rows.length} rows found`);
      if (rows.length > 0) {
        console.log('  ✅ Receiving data found!');
      }
    });
  } catch (error) {
    console.error('❌ Receiving test error:', error.message);
  }
}

testPFRSelectors().catch(console.error); 
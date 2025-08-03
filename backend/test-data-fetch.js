const axios = require('axios');
const cheerio = require('cheerio');

// Test Pro Football Reference API
async function testPFR() {
  console.log('Testing Pro Football Reference API...');

  try {
    const response = await axios.get('https://www.pro-football-reference.com/years/2024/passing.htm', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    console.log('✅ PFR Response Status:', response.status);
    console.log('✅ PFR Response Length:', response.data.length);

    const $ = cheerio.load(response.data);
    const rows = $('#stats_passing tbody tr');
    console.log('✅ PFR Passing Stats Rows Found:', rows.length);

    // Test first few rows
    rows.slice(0, 3).each((i, row) => {
      const $row = $(row);
      const name = $row.find('td[data-stat="player"] a').text().trim();
      const team = $row.find('td[data-stat="team"] a').text().trim();
      const attempts = $row.find('td[data-stat="pass_att"]').text().trim();

      console.log(`  Row ${i + 1}: ${name} (${team}) - ${attempts} attempts`);
    });

    return true;
  } catch (error) {
    console.error('❌ PFR Error:', error.message);
    return false;
  }
}

// Test FantasyPros API
async function testFantasyPros() {
  console.log('\nTesting FantasyPros API...');

  try {
    const response = await axios.get('https://www.fantasypros.com/nfl/stats/qb.php', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    console.log('✅ FantasyPros Response Status:', response.status);
    console.log('✅ FantasyPros Response Length:', response.data.length);

    const $ = cheerio.load(response.data);
    const rows = $('table tbody tr');
    console.log('✅ FantasyPros QB Stats Rows Found:', rows.length);

    // Test first few rows
    rows.slice(0, 3).each((i, row) => {
      const $row = $(row);
      const name = $row.find('td').eq(0).text().trim();
      const team = $row.find('td').eq(1).text().trim();
      const points = $row.find('td').eq(2).text().trim();

      console.log(`  Row ${i + 1}: ${name} (${team}) - ${points} points`);
    });

    return true;
  } catch (error) {
    console.error('❌ FantasyPros Error:', error.message);
    return false;
  }
}

// Test PFR Rushing
async function testPFRRushing() {
  console.log('\nTesting PFR Rushing Stats...');

  try {
    const response = await axios.get('https://www.pro-football-reference.com/years/2024/rushing.htm', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    console.log('✅ PFR Rushing Response Status:', response.status);

    const $ = cheerio.load(response.data);
    const rows = $('#stats_rushing tbody tr');
    console.log('✅ PFR Rushing Stats Rows Found:', rows.length);

    // Test first few rows
    rows.slice(0, 3).each((i, row) => {
      const $row = $(row);
      const name = $row.find('td[data-stat="player"] a').text().trim();
      const team = $row.find('td[data-stat="team"] a').text().trim();
      const attempts = $row.find('td[data-stat="rush_att"]').text().trim();

      console.log(`  Row ${i + 1}: ${name} (${team}) - ${attempts} attempts`);
    });

    return true;
  } catch (error) {
    console.error('❌ PFR Rushing Error:', error.message);
    return false;
  }
}

// Test PFR Receiving
async function testPFRReceiving() {
  console.log('\nTesting PFR Receiving Stats...');

  try {
    const response = await axios.get('https://www.pro-football-reference.com/years/2024/receiving.htm', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    console.log('✅ PFR Receiving Response Status:', response.status);

    const $ = cheerio.load(response.data);
    const rows = $('#stats_receiving tbody tr');
    console.log('✅ PFR Receiving Stats Rows Found:', rows.length);

    // Test first few rows
    rows.slice(0, 3).each((i, row) => {
      const $row = $(row);
      const name = $row.find('td[data-stat="player"] a').text().trim();
      const team = $row.find('td[data-stat="team"] a').text().trim();
      const targets = $row.find('td[data-stat="targets"]').text().trim();

      console.log(`  Row ${i + 1}: ${name} (${team}) - ${targets} targets`);
    });

    return true;
  } catch (error) {
    console.error('❌ PFR Receiving Error:', error.message);
    return false;
  }
}

// Test FantasyPros RB
async function testFantasyProsRB() {
  console.log('\nTesting FantasyPros RB Stats...');

  try {
    const response = await axios.get('https://www.fantasypros.com/nfl/stats/rb.php', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    console.log('✅ FantasyPros RB Response Status:', response.status);

    const $ = cheerio.load(response.data);
    const rows = $('table tbody tr');
    console.log('✅ FantasyPros RB Stats Rows Found:', rows.length);

    // Test first few rows
    rows.slice(0, 3).each((i, row) => {
      const $row = $(row);
      const name = $row.find('td').eq(0).text().trim();
      const team = $row.find('td').eq(1).text().trim();
      const points = $row.find('td').eq(2).text().trim();

      console.log(`  Row ${i + 1}: ${name} (${team}) - ${points} points`);
    });

    return true;
  } catch (error) {
    console.error('❌ FantasyPros RB Error:', error.message);
    return false;
  }
}

// Test FantasyPros WR
async function testFantasyProsWR() {
  console.log('\nTesting FantasyPros WR Stats...');

  try {
    const response = await axios.get('https://www.fantasypros.com/nfl/stats/wr.php', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    console.log('✅ FantasyPros WR Response Status:', response.status);

    const $ = cheerio.load(response.data);
    const rows = $('table tbody tr');
    console.log('✅ FantasyPros WR Stats Rows Found:', rows.length);

    // Test first few rows
    rows.slice(0, 3).each((i, row) => {
      const $row = $(row);
      const name = $row.find('td').eq(0).text().trim();
      const team = $row.find('td').eq(1).text().trim();
      const points = $row.find('td').eq(2).text().trim();

      console.log(`  Row ${i + 1}: ${name} (${team}) - ${points} points`);
    });

    return true;
  } catch (error) {
    console.error('❌ FantasyPros WR Error:', error.message);
    return false;
  }
}

// Test FantasyPros TE
async function testFantasyProsTE() {
  console.log('\nTesting FantasyPros TE Stats...');

  try {
    const response = await axios.get('https://www.fantasypros.com/nfl/stats/te.php', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    console.log('✅ FantasyPros TE Response Status:', response.status);

    const $ = cheerio.load(response.data);
    const rows = $('table tbody tr');
    console.log('✅ FantasyPros TE Stats Rows Found:', rows.length);

    // Test first few rows
    rows.slice(0, 3).each((i, row) => {
      const $row = $(row);
      const name = $row.find('td').eq(0).text().trim();
      const team = $row.find('td').eq(1).text().trim();
      const points = $row.find('td').eq(2).text().trim();

      console.log(`  Row ${i + 1}: ${name} (${team}) - ${points} points`);
    });

    return true;
  } catch (error) {
    console.error('❌ FantasyPros TE Error:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Starting API Tests...\n');

  const results = {
    pfr: await testPFR(),
    pfrRushing: await testPFRRushing(),
    pfrReceiving: await testPFRReceiving(),
    fantasyPros: await testFantasyPros(),
    fantasyProsRB: await testFantasyProsRB(),
    fantasyProsWR: await testFantasyProsWR(),
    fantasyProsTE: await testFantasyProsTE()
  };

  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });

  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;

  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Data fetching should work.');
  } else {
    console.log('⚠️  Some tests failed. Data fetching may not work properly.');
  }
}

// Run the tests
runAllTests().catch(console.error); 
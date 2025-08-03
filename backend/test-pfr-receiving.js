const axios = require('axios');
const cheerio = require('cheerio');

async function debugPFRReceiving() {
  console.log('🔍 Debugging PFR Receiving Stats...');
  
  try {
    const response = await axios.get('https://www.pro-football-reference.com/years/2024/receiving.htm', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log('✅ Response Status:', response.status);
    console.log('✅ Response Length:', response.data.length);
    
    const $ = cheerio.load(response.data);
    
    // Check for different table selectors
    const possibleSelectors = [
      '#stats_receiving tbody tr',
      '#receiving tbody tr', 
      'table#stats_receiving tbody tr',
      'table tbody tr',
      '.stats_table tbody tr'
    ];
    
    console.log('\n🔍 Testing different selectors:');
    possibleSelectors.forEach(selector => {
      const rows = $(selector);
      console.log(`  ${selector}: ${rows.length} rows found`);
      
      if (rows.length > 0) {
        console.log('  ✅ Found data with this selector!');
        rows.slice(0, 3).each((i, row) => {
          const $row = $(row);
          const name = $row.find('td[data-stat="player"] a').text().trim() || 
                      $row.find('td').eq(0).text().trim();
          const team = $row.find('td[data-stat="team"] a').text().trim() || 
                      $row.find('td').eq(1).text().trim();
          const targets = $row.find('td[data-stat="targets"]').text().trim() || 
                         $row.find('td').eq(2).text().trim();
          
          console.log(`    Row ${i + 1}: ${name} (${team}) - ${targets} targets`);
        });
      }
    });
    
    // Also check for any table with receiving-related content
    const allTables = $('table');
    console.log(`\n📊 Total tables found: ${allTables.length}`);
    
    allTables.each((i, table) => {
      const $table = $(table);
      const tableId = $table.attr('id');
      const tableClass = $table.attr('class');
      const caption = $table.find('caption').text().trim();
      
      console.log(`  Table ${i + 1}: id="${tableId}" class="${tableClass}" caption="${caption}"`);
      
      const rows = $table.find('tbody tr');
      if (rows.length > 0) {
        console.log(`    Has ${rows.length} rows`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugPFRReceiving().catch(console.error); 
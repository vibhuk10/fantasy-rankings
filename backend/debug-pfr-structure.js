const axios = require('axios');
const cheerio = require('cheerio');

async function debugPFRStructure() {
  console.log('🔍 Debugging PFR HTML Structure...\n');
  
  try {
    const response = await axios.get('https://www.pro-football-reference.com/years/2024/passing.htm', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const rows = $('#passing tbody tr');
    
    console.log(`Found ${rows.length} rows`);
    
    // Examine the first few rows in detail
    rows.slice(0, 3).each((i, row) => {
      const $row = $(row);
      console.log(`\n📊 Row ${i + 1} structure:`);
      
      // Check all cells
      const cells = $row.find('td');
      console.log(`  Has ${cells.length} cells`);
      
      cells.each((j, cell) => {
        const $cell = $(cell);
        const dataStat = $cell.attr('data-stat');
        const text = $cell.text().trim();
        const html = $cell.html();
        
        console.log(`    Cell ${j + 1}: data-stat="${dataStat}" text="${text}"`);
        
        // If it's the player cell, show more detail
        if (dataStat === 'player') {
          const link = $cell.find('a');
          console.log(`      Link text: "${link.text().trim()}"`);
          console.log(`      Link href: "${link.attr('href')}"`);
        }
        
        // If it's the team cell, show more detail
        if (dataStat === 'team') {
          const link = $cell.find('a');
          console.log(`      Link text: "${link.text().trim()}"`);
          console.log(`      Link href: "${link.attr('href')}"`);
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugPFRStructure().catch(console.error); 
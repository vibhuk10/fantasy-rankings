const axios = require('axios');
const cheerio = require('cheerio');

async function debugPFRData() {
    console.log('🔍 Debugging PFR Data Fetching...\n');

    try {
        // Test passing stats
        console.log('📊 Testing PFR Passing Stats...');
        const passingResponse = await axios.get('https://www.pro-football-reference.com/years/2024/passing.htm', {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        console.log('✅ Passing Response Status:', passingResponse.status);
        console.log('✅ Passing Response Length:', passingResponse.data.length);

        const $passing = cheerio.load(passingResponse.data);

        // Check what tables exist
        const passingTables = $passing('table');
        console.log(`📊 Found ${passingTables.length} tables in passing page`);

        passingTables.each((i, table) => {
            const $table = $passing(table);
            const tableId = $table.attr('id');
            const tableClass = $table.attr('class');
            const caption = $table.find('caption').text().trim();

            console.log(`  Table ${i + 1}: id="${tableId}" class="${tableClass}" caption="${caption}"`);

            const rows = $table.find('tbody tr');
            console.log(`    Has ${rows.length} rows`);

            if (rows.length > 0) {
                console.log('    ✅ Found data!');
                rows.slice(0, 3).each((j, row) => {
                    const $row = $passing(row);
                    const name = $row.find('td[data-stat="player"] a').text().trim() ||
                        $row.find('td').eq(0).text().trim();
                    const team = $row.find('td[data-stat="team"] a').text().trim() ||
                        $row.find('td').eq(1).text().trim();
                    const attempts = $row.find('td[data-stat="pass_att"]').text().trim() ||
                        $row.find('td').eq(2).text().trim();

                    console.log(`      Row ${j + 1}: ${name} (${team}) - ${attempts} attempts`);
                });
            }
        });

        // Test the specific selector we're using
        const passingRows = $passing('#passing tbody tr');
        console.log(`\n🔍 Using selector '#passing tbody tr': ${passingRows.length} rows found`);

        if (passingRows.length > 0) {
            console.log('✅ Selector is working!');
            passingRows.slice(0, 3).each((i, row) => {
                const $row = $passing(row);
                const name = $row.find('td[data-stat="player"] a').text().trim();
                const team = $row.find('td[data-stat="team"] a').text().trim();
                const attempts = $row.find('td[data-stat="pass_att"]').text().trim();

                console.log(`  Row ${i + 1}: ${name} (${team}) - ${attempts} attempts`);
            });
        } else {
            console.log('❌ Selector not working');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

debugPFRData().catch(console.error); 
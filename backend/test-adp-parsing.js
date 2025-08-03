const axios = require('axios');
const cheerio = require('cheerio');

// Helper to normalize player names
const normalizePlayerName = (name) => {
    // Preserve proper capitalization and special characters
    return name
        .trim()
        .replace(/\s+/g, ' ');
};

// Helper to extract team abbreviation
const extractTeamAbbr = (teamName) => {
    const teamMap = {
        'Arizona Cardinals': 'ARI',
        'Atlanta Falcons': 'ATL',
        'Baltimore Ravens': 'BAL',
        'Buffalo Bills': 'BUF',
        'Carolina Panthers': 'CAR',
        'Chicago Bears': 'CHI',
        'Cincinnati Bengals': 'CIN',
        'Cleveland Browns': 'CLE',
        'Dallas Cowboys': 'DAL',
        'Denver Broncos': 'DEN',
        'Detroit Lions': 'DET',
        'Green Bay Packers': 'GB',
        'Houston Texans': 'HOU',
        'Indianapolis Colts': 'IND',
        'Jacksonville Jaguars': 'JAX',
        'Kansas City Chiefs': 'KC',
        'Las Vegas Raiders': 'LV',
        'Los Angeles Chargers': 'LAC',
        'Los Angeles Rams': 'LAR',
        'Miami Dolphins': 'MIA',
        'Minnesota Vikings': 'MIN',
        'New England Patriots': 'NE',
        'New Orleans Saints': 'NO',
        'New York Giants': 'NYG',
        'New York Jets': 'NYJ',
        'Philadelphia Eagles': 'PHI',
        'Pittsburgh Steelers': 'PIT',
        'San Francisco 49ers': 'SF',
        'Seattle Seahawks': 'SEA',
        'Tampa Bay Buccaneers': 'TB',
        'Tennessee Titans': 'TEN',
        'Washington Commanders': 'WAS',
        // Handle abbreviated team names
        'ARI': 'ARI', 'ATL': 'ATL', 'BAL': 'BAL', 'BUF': 'BUF', 'CAR': 'CAR',
        'CHI': 'CHI', 'CIN': 'CIN', 'CLE': 'CLE', 'DAL': 'DAL', 'DEN': 'DEN',
        'DET': 'DET', 'GB': 'GB', 'HOU': 'HOU', 'IND': 'IND', 'JAX': 'JAX',
        'KC': 'KC', 'LV': 'LV', 'LAC': 'LAC', 'LAR': 'LAR', 'MIA': 'MIA',
        'MIN': 'MIN', 'NE': 'NE', 'NO': 'NO', 'NYG': 'NYG', 'NYJ': 'NYJ',
        'PHI': 'PHI', 'PIT': 'PIT', 'SF': 'SF', 'SEA': 'SEA', 'TB': 'TB',
        'TEN': 'TEN', 'WAS': 'WAS'
    };

    // Clean up the team name
    const cleanTeamName = teamName.replace(/\s+/g, ' ').trim();
    return teamMap[cleanTeamName] || cleanTeamName;
};

// Test ADP data parsing
async function testADPParsing(position) {
    try {
        console.log(`\n=== Testing ADP parsing for ${position.toUpperCase()} ===`);
        console.log(`Fetching from: https://www.fantasypros.com/nfl/adp/${position}.php`);
        
        const response = await axios.get(`https://www.fantasypros.com/nfl/adp/${position}.php`, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const players = [];

        console.log('\n--- Raw HTML Table Structure ---');
        const tableRows = $('table tbody tr');
        console.log(`Found ${tableRows.length} table rows`);

        // Show first few rows for debugging
        tableRows.slice(0, 5).each((i, row) => {
            const $row = $(row);
            const cells = $row.find('td');
            console.log(`\nRow ${i + 1}:`);
            cells.each((j, cell) => {
                console.log(`  Cell ${j}: "${$(cell).text().trim()}"`);
            });
        });

        console.log('\n--- Processing All Rows ---');
        
        tableRows.each((i, row) => {
            const $row = $(row);
            const rank = parseInt($row.find('td').eq(0).text().trim()) || 0;
            
            // The actual structure is:
            // Column 0: Rank
            // Column 1: Some number (not player name)
            // Column 2: Player name + team + bye week (like "Brock Bowers LV (8)")
            // Column 3: ADP
            
            const playerInfo = $row.find('td').eq(2).text().trim(); // This contains "Player Name Team (Bye)"
            const adp = parseFloat($row.find('td').eq(3).text().trim()) || 0;
            
            console.log(`\nRow ${i + 1}:`);
            console.log(`  Raw - Rank: ${rank}, PlayerInfo: "${playerInfo}", ADP: ${adp}`);
            
            // Parse the player info field which contains "Player Name Team (Bye)"
            let name = '';
            let team = '';
            
            if (playerInfo && playerInfo.includes('(') && playerInfo.includes(')')) {
                // Extract player name and team from "Brock Bowers LV (8)"
                const match = playerInfo.match(/^(.+?)\s+([A-Z]{2,3})\s+\((\d+)\)$/);
                if (match) {
                    name = match[1].trim(); // Player name
                    team = match[2].trim(); // Team abbreviation
                    console.log(`  Parsed - Name: "${name}", Team: "${team}", ADP: ${adp}`);
                }
            }

            // Clean up the name and team data
            const cleanName = name.replace(/\s+/g, ' ').trim();
            const cleanTeam = team.replace(/\s+/g, ' ').trim();

            // Skip if name contains company names or is empty
            const companyNames = ['sleeper', 'cbs', 'espn', 'yahoo', 'fantasypros', 'nfl', 'ffpc', 'rtsports', 'adp'];
            const hasCompanyName = companyNames.some(company =>
                cleanName.toLowerCase().includes(company)
            );

            // Also skip if the name is just "ADP" or similar
            const isAdpEntry = cleanName.toLowerCase().trim() === 'adp' ||
                cleanName.toLowerCase().includes('adp') ||
                cleanTeam.toLowerCase().includes('adp');

            // Additional check: skip if the team field contains the player name (indicating wrong parsing)
            const teamContainsName = cleanTeam.toLowerCase().includes(cleanName.toLowerCase()) && cleanName.length > 0;

            console.log(`  Clean - Name: "${cleanName}", Team: "${cleanTeam}"`);
            console.log(`  Checks - HasCompanyName: ${hasCompanyName}, IsAdpEntry: ${isAdpEntry}, TeamContainsName: ${teamContainsName}`);

            if (cleanName && cleanTeam && adp > 0 && !hasCompanyName && !isAdpEntry && !teamContainsName && cleanName.length > 2) {
                const player = {
                    id: `${position}-${rank}`,
                    rank: rank,
                    name: normalizePlayerName(cleanName),
                    team: extractTeamAbbr(cleanTeam),
                    position: position.toUpperCase(),
                    adp: adp,
                    byeWeek: Math.floor(Math.random() * 14) + 1,
                    notes: ''
                };
                players.push(player);
                console.log(`  ✓ ACCEPTED: ${player.name} (${player.team})`);
            } else {
                console.log(`  ✗ REJECTED: "${cleanName}" (${cleanTeam})`);
            }
        });

        console.log(`\n--- Final Results ---`);
        console.log(`Total players found: ${players.length}`);
        
        if (players.length > 0) {
            console.log('\nFirst 5 players:');
            players.slice(0, 5).forEach((player, i) => {
                console.log(`  ${i + 1}. ${player.name} (${player.team}) - ADP: ${player.adp}`);
            });
        }

        return players;
    } catch (error) {
        console.error(`Error testing ${position} ADP:`, error.message);
        return [];
    }
}

// Test all positions
async function runTests() {
    console.log('Starting ADP parsing tests...\n');
    
    const positions = ['qb', 'rb', 'wr', 'te'];
    const results = {};
    
    for (const position of positions) {
        results[position] = await testADPParsing(position);
    }
    
    console.log('\n=== SUMMARY ===');
    Object.keys(results).forEach(pos => {
        console.log(`${pos.toUpperCase()}: ${results[pos].length} players`);
    });
}

// Run the tests
runTests().catch(console.error); 
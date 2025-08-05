const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '..', 'frontend', 'public', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Helper to normalize player names
const normalizePlayerName = (name) => {
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

    const cleanTeamName = teamName.replace(/\s+/g, ' ').trim();
    return teamMap[cleanTeamName] || cleanTeamName;
};

// Scrape ADP data from FantasyPros (same as backend)
async function scrapeADP(position) {
    try {
        console.log(`Fetching ADP data for ${position}...`);
        const response = await axios.get(`https://www.fantasypros.com/nfl/adp/${position}.php`, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const players = [];

        $('table tbody tr').each((i, row) => {
            const $row = $(row);
            const rank = parseInt($row.find('td').eq(0).text().trim()) || 0;

            const playerInfo = $row.find('td').eq(2).text().trim();
            const adp = parseFloat($row.find('td').eq(3).text().trim()) || 0;

            let name = '';
            let team = '';

            if (playerInfo && playerInfo.includes('(') && playerInfo.includes(')')) {
                const match = playerInfo.match(/^(.+?)\s+([A-Z]{2,3})\s+\((\d+)\)$/);
                if (match) {
                    name = match[1].trim();
                    team = match[2].trim();
                }
            }

            const cleanName = name.replace(/\s+/g, ' ').trim();
            const cleanTeam = team.replace(/\s+/g, ' ').trim();

            const companyNames = ['sleeper', 'cbs', 'espn', 'yahoo', 'fantasypros', 'nfl', 'ffpc', 'rtsports', 'adp'];
            const hasCompanyName = companyNames.some(company =>
                cleanName.toLowerCase().includes(company)
            );

            const isAdpEntry = cleanName.toLowerCase().trim() === 'adp' ||
                cleanName.toLowerCase().includes('adp') ||
                cleanTeam.toLowerCase().includes('adp');

            const teamContainsName = cleanTeam.toLowerCase().includes(cleanName.toLowerCase()) && cleanName.length > 0;

            if (cleanName && cleanTeam && adp > 0 && !hasCompanyName && !isAdpEntry && !teamContainsName && cleanName.length > 2) {
                players.push({
                    id: `${position}-${rank}`,
                    rank: rank,
                    name: normalizePlayerName(cleanName),
                    team: extractTeamAbbr(cleanTeam),
                    position: position.toUpperCase(),
                    adp: adp,
                    byeWeek: Math.floor(Math.random() * 14) + 1,
                    notes: ''
                });
            }
        });

        console.log(`Fetched ${players.length} ${position} ADP rankings`);

        if (players.length < 5) {
            console.log(`Not enough players found, using sample data for ${position}`);
            return getSampleADP(position);
        }

        return players;
    } catch (error) {
        console.error(`Error fetching ${position} ADP:`, error.message);
        return getSampleADP(position);
    }
}

// Sample ADP data as fallback (same as backend)
function getSampleADP(position) {
    const sampleData = {
        qb: [
            { id: 'qb-1', rank: 1, name: 'josh allen', team: 'BUF', position: 'QB', adp: 12.5, byeWeek: 13, notes: '' },
            { id: 'qb-2', rank: 2, name: 'patrick mahomes', team: 'KC', position: 'QB', adp: 15.2, byeWeek: 10, notes: '' },
            { id: 'qb-3', rank: 3, name: 'lamar jackson', team: 'BAL', position: 'QB', adp: 18.8, byeWeek: 14, notes: '' },
            { id: 'qb-4', rank: 4, name: 'jalen hurts', team: 'PHI', position: 'QB', adp: 22.1, byeWeek: 9, notes: '' },
            { id: 'qb-5', rank: 5, name: 'justin fields', team: 'CHI', position: 'QB', adp: 25.3, byeWeek: 13, notes: '' },
            { id: 'qb-6', rank: 6, name: 'dak prescott', team: 'DAL', position: 'QB', adp: 28.7, byeWeek: 7, notes: '' },
            { id: 'qb-7', rank: 7, name: 'justin herbert', team: 'LAC', position: 'QB', adp: 31.2, byeWeek: 5, notes: '' },
            { id: 'qb-8', rank: 8, name: 'kyler murray', team: 'ARI', position: 'QB', adp: 34.1, byeWeek: 14, notes: '' }
        ],
        rb: [
            { id: 'rb-1', rank: 1, name: 'christian mccaffrey', team: 'SF', position: 'RB', adp: 1.2, byeWeek: 9, notes: '' },
            { id: 'rb-2', rank: 2, name: 'saquon barkley', team: 'PHI', position: 'RB', adp: 3.8, byeWeek: 9, notes: '' },
            { id: 'rb-3', rank: 3, name: 'derrick henry', team: 'BAL', position: 'RB', adp: 5.1, byeWeek: 14, notes: '' },
            { id: 'rb-4', rank: 4, name: 'austin ekeler', team: 'LAC', position: 'RB', adp: 7.4, byeWeek: 5, notes: '' },
            { id: 'rb-5', rank: 5, name: 'alvin kamara', team: 'NO', position: 'RB', adp: 9.2, byeWeek: 11, notes: '' },
            { id: 'rb-6', rank: 6, name: 'nick chubb', team: 'CLE', position: 'RB', adp: 11.8, byeWeek: 5, notes: '' },
            { id: 'rb-7', rank: 7, name: 'joe mixon', team: 'CIN', position: 'RB', adp: 13.5, byeWeek: 12, notes: '' },
            { id: 'rb-8', rank: 8, name: 'james cook', team: 'BUF', position: 'RB', adp: 15.9, byeWeek: 13, notes: '' }
        ],
        wr: [
            { id: 'wr-1', rank: 1, name: 'tyreek hill', team: 'MIA', position: 'WR', adp: 2.1, byeWeek: 11, notes: '' },
            { id: 'wr-2', rank: 2, name: 'cee dee lamb', team: 'DAL', position: 'WR', adp: 4.3, byeWeek: 7, notes: '' },
            { id: 'wr-3', rank: 3, name: 'amari cooper', team: 'CLE', position: 'WR', adp: 6.7, byeWeek: 5, notes: '' },
            { id: 'wr-4', rank: 4, name: 'aj brown', team: 'PHI', position: 'WR', adp: 8.9, byeWeek: 9, notes: '' },
            { id: 'wr-5', rank: 5, name: 'stefon diggs', team: 'BUF', position: 'WR', adp: 11.2, byeWeek: 13, notes: '' },
            { id: 'wr-6', rank: 6, name: 'mike evans', team: 'TB', position: 'WR', adp: 13.8, byeWeek: 5, notes: '' },
            { id: 'wr-7', rank: 7, name: 'deebo samuel', team: 'SF', position: 'WR', adp: 16.4, byeWeek: 9, notes: '' },
            { id: 'wr-8', rank: 8, name: 'keenan allen', team: 'CHI', position: 'WR', adp: 18.7, byeWeek: 13, notes: '' }
        ],
        te: [
            { id: 'te-1', rank: 1, name: 'travis kelce', team: 'KC', position: 'TE', adp: 8.5, byeWeek: 10, notes: '' },
            { id: 'te-2', rank: 2, name: 'sam laporta', team: 'DET', position: 'TE', adp: 12.8, byeWeek: 9, notes: '' },
            { id: 'te-3', rank: 3, name: 'george kittle', team: 'SF', position: 'TE', adp: 15.3, byeWeek: 9, notes: '' },
            { id: 'te-4', rank: 4, name: 'dallas goedert', team: 'PHI', position: 'TE', adp: 18.7, byeWeek: 9, notes: '' },
            { id: 'te-5', rank: 5, name: 'evan engram', team: 'JAX', position: 'TE', adp: 21.4, byeWeek: 9, notes: '' },
            { id: 'te-6', rank: 6, name: 'mark andrews', team: 'BAL', position: 'TE', adp: 24.1, byeWeek: 14, notes: '' },
            { id: 'te-7', rank: 7, name: 't.j. hockenson', team: 'MIN', position: 'TE', adp: 26.8, byeWeek: 6, notes: '' },
            { id: 'te-8', rank: 8, name: 'cole kmet', team: 'CHI', position: 'TE', adp: 29.5, byeWeek: 13, notes: '' }
        ]
    };

    return sampleData[position] || [];
}

// Helper function to convert data to CSV
function convertToCSV(data, headers) {
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row =>
        headers.map(header => {
            const value = row[header];
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value || '';
        }).join(',')
    );

    return [csvHeaders, ...csvRows].join('\n');
}

// Generate comprehensive ADP data using scraping
async function generateADPData() {
    try {
        console.log('Generating comprehensive ADP data using FantasyPros scraping...');

        const positions = ['qb', 'rb', 'wr', 'te'];
        const allADPData = [];

        for (const position of positions) {
            const players = await scrapeADP(position);
            allADPData.push(...players);
        }

        // Sort all ADP data by ADP value
        allADPData.sort((a, b) => a.adp - b.adp);

        // Update ranks based on ADP order
        allADPData.forEach((player, index) => {
            player.rank = index + 1;
        });

        const headers = ['id', 'rank', 'name', 'team', 'position', 'adp', 'byeWeek'];
        const csvContent = convertToCSV(allADPData, headers);
        fs.writeFileSync(path.join(dataDir, 'adp-data.csv'), csvContent);

        console.log(`Generated ADP data with ${allADPData.length} players`);

        // Count by position
        const counts = {};
        allADPData.forEach(player => {
            counts[player.position] = (counts[player.position] || 0) + 1;
        });

        Object.keys(counts).forEach(pos => {
            console.log(`${pos}: ${counts[pos]} players`);
        });

        return allADPData;

    } catch (error) {
        console.error('Error generating ADP data:', error);
        return [];
    }
}

// Main function
async function main() {
    console.log('Starting ADP data generation...');

    try {
        await generateADPData();
        console.log('✅ ADP data generated successfully!');
        console.log(`📁 File saved to: ${dataDir}/adp-data.csv`);
    } catch (error) {
        console.error('❌ Error generating ADP data:', error);
    }
}

// Run the script if called directly
if (require.main === module) {
    main();
}

module.exports = {
    generateADPData,
    scrapeADP,
    main
}; 
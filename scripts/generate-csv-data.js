const fs = require('fs');
const path = require('path');
const RankingEngine = require('../backend/utils/rankingEngine');
const axios = require('axios');

// Create scripts directory if it doesn't exist
const scriptsDir = path.join(__dirname);
const dataDir = path.join(__dirname, '..', 'frontend', 'public', 'data');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Helper function to convert data to CSV
function convertToCSV(data, headers) {
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => 
        headers.map(header => {
            const value = row[header];
            // Escape quotes and wrap in quotes if contains comma
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value || '';
        }).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
}

// Generate QB rankings CSV
async function generateQBData() {
    try {
        console.log('Generating QB rankings...');
        const rankingEngine = new RankingEngine();
        const qbs = await rankingEngine.rankQBs();
        
        const headers = [
            'id', 'rank', 'name', 'team', 'position', 'passAttempts', 'passYards', 
            'passTds', 'completionPercentage', 'yardsPerAttempt', 'rushYards', 
            'rushTds', 'fantasyPPG', 'compositeScore'
        ];
        
        const csvContent = convertToCSV(qbs, headers);
        fs.writeFileSync(path.join(dataDir, 'qb-rankings.csv'), csvContent);
        console.log(`Generated QB rankings with ${qbs.length} players`);
        
        return qbs;
    } catch (error) {
        console.error('Error generating QB data:', error);
        return [];
    }
}

// Generate RB rankings CSV
async function generateRBData() {
    try {
        console.log('Generating RB rankings...');
        const rankingEngine = new RankingEngine();
        const rbs = await rankingEngine.rankRBs();
        
        const headers = [
            'id', 'rank', 'name', 'team', 'position', 'rushAttempts', 'rushYards', 
            'rushTds', 'yardsPerRush', 'targets', 'receptions', 'recYards', 
            'recTds', 'catchRate', 'fantasyPPG', 'compositeScore'
        ];
        
        const csvContent = convertToCSV(rbs, headers);
        fs.writeFileSync(path.join(dataDir, 'rb-rankings.csv'), csvContent);
        console.log(`Generated RB rankings with ${rbs.length} players`);
        
        return rbs;
    } catch (error) {
        console.error('Error generating RB data:', error);
        return [];
    }
}

// Generate WR rankings CSV
async function generateWRData() {
    try {
        console.log('Generating WR rankings...');
        const rankingEngine = new RankingEngine();
        const wrs = await rankingEngine.rankWRs();
        
        const headers = [
            'id', 'rank', 'name', 'team', 'position', 'targets', 'receptions', 
            'recYards', 'recTds', 'yardsPerReception', 'catchRate', 'fantasyPPG', 
            'compositeScore'
        ];
        
        const csvContent = convertToCSV(wrs, headers);
        fs.writeFileSync(path.join(dataDir, 'wr-rankings.csv'), csvContent);
        console.log(`Generated WR rankings with ${wrs.length} players`);
        
        return wrs;
    } catch (error) {
        console.error('Error generating WR data:', error);
        return [];
    }
}

// Generate TE rankings CSV
async function generateTEData() {
    try {
        console.log('Generating TE rankings...');
        const rankingEngine = new RankingEngine();
        const tes = await rankingEngine.rankTEs();
        
        const headers = [
            'id', 'rank', 'name', 'team', 'position', 'targets', 'receptions', 
            'recYards', 'recTds', 'yardsPerReception', 'catchRate', 'fantasyPPG', 
            'compositeScore'
        ];
        
        const csvContent = convertToCSV(tes, headers);
        fs.writeFileSync(path.join(dataDir, 'te-rankings.csv'), csvContent);
        console.log(`Generated TE rankings with ${tes.length} players`);
        
        return tes;
    } catch (error) {
        console.error('Error generating TE data:', error);
        return [];
    }
}

// Generate ADP data CSV
async function generateADPData() {
    try {
        console.log('Generating ADP data...');
        
        // Start a local server to call the ADP routes
        const baseURL = 'http://localhost:5000';
        
        const positions = ['qb', 'rb', 'wr', 'te'];
        const allADPData = [];
        
        for (const position of positions) {
            try {
                console.log(`Fetching ADP data for ${position}...`);
                const response = await axios.get(`${baseURL}/api/adp/${position}`);
                
                if (response.data && response.data.success && response.data.data) {
                    const players = response.data.data.map(player => ({
                        ...player,
                        position: position.toUpperCase()
                    }));
                    allADPData.push(...players);
                }
            } catch (error) {
                console.error(`Error fetching ADP data for ${position}:`, error.message);
            }
        }
        
        if (allADPData.length > 0) {
            const headers = [
                'id', 'rank', 'name', 'team', 'position', 'adp', 'byeWeek'
            ];
            
            const csvContent = convertToCSV(allADPData, headers);
            fs.writeFileSync(path.join(dataDir, 'adp-data.csv'), csvContent);
            console.log(`Generated ADP data with ${allADPData.length} players`);
        } else {
            console.log('No ADP data generated - using sample data');
            // Generate sample ADP data
            const sampleADP = [
                { id: 'adp-qb-1', rank: 1, name: 'Josh Allen', team: 'BUF', position: 'QB', adp: 1.2, byeWeek: 13 },
                { id: 'adp-qb-2', rank: 2, name: 'Patrick Mahomes', team: 'KC', position: 'QB', adp: 2.1, byeWeek: 10 },
                { id: 'adp-rb-1', rank: 1, name: 'Christian McCaffrey', team: 'SF', position: 'RB', adp: 1.1, byeWeek: 9 },
                { id: 'adp-rb-2', rank: 2, name: 'Breece Hall', team: 'NYJ', position: 'RB', adp: 3.2, byeWeek: 7 },
                { id: 'adp-wr-1', rank: 1, name: 'Tyreek Hill', team: 'MIA', position: 'WR', adp: 2.3, byeWeek: 11 },
                { id: 'adp-wr-2', rank: 2, name: 'CeeDee Lamb', team: 'DAL', position: 'WR', adp: 3.1, byeWeek: 7 },
                { id: 'adp-te-1', rank: 1, name: 'Travis Kelce', team: 'KC', position: 'TE', adp: 4.5, byeWeek: 10 },
                { id: 'adp-te-2', rank: 2, name: 'Sam LaPorta', team: 'DET', position: 'TE', adp: 5.2, byeWeek: 9 }
            ];
            
            const headers = ['id', 'rank', 'name', 'team', 'position', 'adp', 'byeWeek'];
            const csvContent = convertToCSV(sampleADP, headers);
            fs.writeFileSync(path.join(dataDir, 'adp-data.csv'), csvContent);
            console.log('Generated sample ADP data');
        }
        
        return allADPData;
    } catch (error) {
        console.error('Error generating ADP data:', error);
        return [];
    }
}

// Main function to generate all CSV files
async function generateAllCSVData() {
    console.log('Starting CSV data generation...');
    
    try {
        // Generate all position rankings
        await Promise.all([
            generateQBData(),
            generateRBData(),
            generateWRData(),
            generateTEData(),
            generateADPData()
        ]);
        
        console.log('✅ All CSV files generated successfully!');
        console.log(`📁 Files saved to: ${dataDir}`);
        console.log('📄 Generated files:');
        console.log('  - qb-rankings.csv');
        console.log('  - rb-rankings.csv');
        console.log('  - wr-rankings.csv');
        console.log('  - te-rankings.csv');
        console.log('  - adp-data.csv');
        
    } catch (error) {
        console.error('❌ Error generating CSV data:', error);
    }
}

// Run the script if called directly
if (require.main === module) {
    generateAllCSVData();
}

module.exports = {
    generateQBData,
    generateRBData,
    generateWRData,
    generateTEData,
    generateADPData,
    generateAllCSVData
}; 
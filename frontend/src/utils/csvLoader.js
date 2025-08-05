// CSV Loader Utility for Fantasy Football Rankings
// Loads CSV data from the public/data directory

// Helper function to parse CSV text into array of objects
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === headers.length) {
            const row = {};
            headers.forEach((header, index) => {
                let value = values[index];
                // Convert numeric values
                if (!isNaN(value) && value !== '') {
                    value = parseFloat(value);
                }
                row[header] = value;
            });
            data.push(row);
        }
    }
    
    return data;
}

// Helper function to parse a single CSV line, handling quoted values
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                // Escaped quote
                current += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // End of value
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    // Add the last value
    values.push(current.trim());
    return values;
}

// Load CSV data from public/data directory
async function loadCSVData(filename) {
    try {
        const response = await fetch(`/data/${filename}`);
        if (!response.ok) {
            throw new Error(`Failed to load ${filename}: ${response.status}`);
        }
        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (error) {
        console.error(`Error loading CSV data from ${filename}:`, error);
        return [];
    }
}

// Load all ranking data
export async function loadRankingData() {
    try {
        const [qbData, rbData, wrData, teData] = await Promise.all([
            loadCSVData('qb-rankings.csv'),
            loadCSVData('rb-rankings.csv'),
            loadCSVData('wr-rankings.csv'),
            loadCSVData('te-rankings.csv')
        ]);
        
        return {
            qb: qbData,
            rb: rbData,
            wr: wrData,
            te: teData
        };
    } catch (error) {
        console.error('Error loading ranking data:', error);
        return { qb: [], rb: [], wr: [], te: [] };
    }
}

// Load ADP data
export async function loadADPData() {
    try {
        const adpData = await loadCSVData('adp-data.csv');
        return adpData;
    } catch (error) {
        console.error('Error loading ADP data:', error);
        return [];
    }
}

// Load data for a specific position
export async function loadPositionData(position) {
    try {
        const filename = `${position.toLowerCase()}-rankings.csv`;
        return await loadCSVData(filename);
    } catch (error) {
        console.error(`Error loading ${position} data:`, error);
        return [];
    }
}

// Get ADP data for a specific position
export async function loadPositionADPData(position) {
    try {
        const allADPData = await loadADPData();
        return allADPData.filter(player => 
            player.position && player.position.toLowerCase() === position.toLowerCase()
        );
    } catch (error) {
        console.error(`Error loading ${position} ADP data:`, error);
        return [];
    }
}

export default {
    loadRankingData,
    loadADPData,
    loadPositionData,
    loadPositionADPData,
    parseCSV
}; 
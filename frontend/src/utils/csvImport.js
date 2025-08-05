// CSV Import Utility for Custom Rankings
// Imports CSV files to restore custom rankings

// Parse CSV content into rankings data
export function parseCSVToRankings(csvContent) {
    try {
        const lines = csvContent.trim().split('\n');
        if (lines.length < 2) {
            throw new Error('CSV file must have at least a header row and one data row');
        }
        
        const headers = lines[0].split(',').map(h => h.trim());
        const expectedHeaders = ['position', 'rank', 'name', 'team', 'adp', 'byeWeek', 'notes'];
        
        // Validate headers
        const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
            throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
        }
        
        const rankings = {
            qb: [],
            rb: [],
            wr: [],
            te: []
        };
        
        // Parse data rows
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const values = parseCSVLine(line);
            
            if (values.length >= headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    let value = values[index];
                    // Remove quotes if present
                    if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
                        value = value.slice(1, -1);
                    }
                    row[header] = value;
                });
                
                // Validate and add to rankings
                const position = row.position?.toLowerCase();
                if (position && rankings[position]) {
                    const player = {
                        id: `${position}-${row.rank || i}`,
                        rank: parseInt(row.rank) || i,
                        name: row.name || '',
                        team: row.team || '',
                        position: position.toUpperCase(),
                        adp: parseFloat(row.adp) || 0,
                        byeWeek: parseInt(row.byeWeek) || 0,
                        notes: row.notes || ''
                    };
                    
                    rankings[position].push(player);
                }
            }
        }
        
        // Sort each position by rank
        Object.keys(rankings).forEach(position => {
            rankings[position].sort((a, b) => a.rank - b.rank);
        });
        
        return {
            success: true,
            rankings: rankings,
            message: 'CSV imported successfully'
        };
        
    } catch (error) {
        console.error('Error parsing CSV:', error);
        return {
            success: false,
            message: 'Failed to parse CSV file',
            error: error.message
        };
    }
}

// Helper function to parse CSV line, handling quoted values
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

// Handle file upload and import
export function importCSVFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
            try {
                const csvContent = event.target.result;
                const result = parseCSVToRankings(csvContent);
                resolve(result);
            } catch (error) {
                reject({
                    success: false,
                    message: 'Failed to read CSV file',
                    error: error.message
                });
            }
        };
        
        reader.onerror = () => {
            reject({
                success: false,
                message: 'Failed to read file',
                error: 'File reading error'
            });
        };
        
        reader.readAsText(file);
    });
}

// Validate CSV file before import
export function validateCSVFile(file) {
    const validTypes = ['text/csv', 'application/csv'];
    const maxSize = 1024 * 1024; // 1MB
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv')) {
        return {
            valid: false,
            message: 'Please select a valid CSV file'
        };
    }
    
    if (file.size > maxSize) {
        return {
            valid: false,
            message: 'File size must be less than 1MB'
        };
    }
    
    return {
        valid: true,
        message: 'File is valid'
    };
}

export default {
    parseCSVToRankings,
    importCSVFile,
    validateCSVFile
}; 
// CSV Export Utility for Custom Rankings
// Exports custom rankings to CSV format for user download

// Convert rankings data to CSV format
export function exportRankingsToCSV(rankings) {
    const headers = ['position', 'rank', 'name', 'team', 'adp', 'byeWeek', 'notes'];
    const csvRows = [];
    
    // Add header row
    csvRows.push(headers.join(','));
    
    // Add data rows for each position
    Object.keys(rankings).forEach(position => {
        const players = rankings[position];
        players.forEach((player, index) => {
            const row = [
                position.toUpperCase(),
                index + 1, // Custom rank (1-based)
                `"${player.name || ''}"`,
                player.team || '',
                player.adp || '',
                player.byeWeek || '',
                `"${player.notes || ''}"`
            ];
            csvRows.push(row.join(','));
        });
    });
    
    return csvRows.join('\n');
}

// Download CSV file
export function downloadCSV(csvContent, filename = 'custom-rankings.csv') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Export custom rankings to CSV
export function exportCustomRankings(rankings) {
    try {
        const csvContent = exportRankingsToCSV(rankings);
        const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const filename = `fantasy-rankings-${timestamp}.csv`;
        
        downloadCSV(csvContent, filename);
        
        return {
            success: true,
            message: `Rankings exported to ${filename}`,
            filename: filename
        };
    } catch (error) {
        console.error('Error exporting rankings:', error);
        return {
            success: false,
            message: 'Failed to export rankings',
            error: error.message
        };
    }
}

export default {
    exportRankingsToCSV,
    downloadCSV,
    exportCustomRankings
}; 
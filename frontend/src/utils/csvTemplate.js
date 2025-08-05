// CSV Template Utility
// Generates a sample CSV template for users to understand the format

export function generateCSVTemplate() {
    const headers = ['position', 'rank', 'name', 'team', 'adp', 'byeWeek', 'notes'];
    const sampleData = [
        ['QB', '1', 'Josh Allen', 'BUF', '12.5', '13', 'High upside QB'],
        ['QB', '2', 'Patrick Mahomes', 'KC', '15.2', '10', 'Consistent performer'],
        ['RB', '1', 'Christian McCaffrey', 'SF', '1.2', '9', 'Elite RB1'],
        ['RB', '2', 'Saquon Barkley', 'PHI', '3.8', '9', 'Strong volume'],
        ['WR', '1', 'Tyreek Hill', 'MIA', '2.1', '11', 'Speed demon'],
        ['WR', '2', 'CeeDee Lamb', 'DAL', '4.3', '7', 'Target hog'],
        ['TE', '1', 'Travis Kelce', 'KC', '8.5', '10', 'TE1 by far'],
        ['TE', '2', 'Sam LaPorta', 'DET', '12.8', '9', 'Young stud']
    ];
    
    const csvContent = [
        headers.join(','),
        ...sampleData.map(row => 
            row.map((value, index) => {
                // Wrap text values in quotes
                if (index === 2 || index === 6) { // name and notes columns
                    return `"${value}"`;
                }
                return value;
            }).join(',')
        )
    ].join('\n');
    
    return csvContent;
}

export function downloadTemplate() {
    const csvContent = generateCSVTemplate();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'fantasy-rankings-template.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export default {
    generateCSVTemplate,
    downloadTemplate
}; 
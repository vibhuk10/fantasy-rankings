import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (players) => {
    try {
        // Debug: Log the players data structure
        console.log('PDF Export - Players data:', players);

        // Create a temporary div to render the rankings
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '0';
        tempDiv.style.width = '800px';
        tempDiv.style.backgroundColor = 'white';
        tempDiv.style.padding = '20px';
        tempDiv.style.fontFamily = 'Arial, sans-serif';
        tempDiv.style.fontSize = '12px';

        // Add title
        const title = document.createElement('h1');
        title.textContent = 'My 2025 Fantasy Football Rankings';
        title.style.textAlign = 'center';
        title.style.marginBottom = '30px';
        title.style.color = '#333';
        tempDiv.appendChild(title);

        // Add timestamp
        const timestamp = document.createElement('p');
        timestamp.textContent = `Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`;
        timestamp.style.textAlign = 'center';
        timestamp.style.marginBottom = '30px';
        timestamp.style.color = '#666';
        tempDiv.appendChild(timestamp);

        const positions = [
            { key: 'qb', label: 'Quarterbacks (QB)' },
            { key: 'rb', label: 'Running Backs (RB)' },
            { key: 'wr', label: 'Wide Receivers (WR)' },
            { key: 'te', label: 'Tight Ends (TE)' }
        ];

        positions.forEach(({ key, label }) => {
            if (players[key] && players[key].length > 0) {
                // Add position header
                const positionHeader = document.createElement('h2');
                positionHeader.textContent = label;
                positionHeader.style.marginTop = '30px';
                positionHeader.style.marginBottom = '15px';
                positionHeader.style.color = '#333';
                positionHeader.style.borderBottom = '2px solid #007bff';
                positionHeader.style.paddingBottom = '5px';
                tempDiv.appendChild(positionHeader);

                // Create table
                const table = document.createElement('table');
                table.style.width = '100%';
                table.style.borderCollapse = 'collapse';
                table.style.marginBottom = '20px';

                // Add table header
                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');
                const headers = ['Rank', 'Player', 'Team', 'ADP', 'Bye Week', 'Notes'];

                headers.forEach(headerText => {
                    const th = document.createElement('th');
                    th.textContent = headerText;
                    th.style.border = '1px solid #ddd';
                    th.style.padding = '8px';
                    th.style.backgroundColor = '#f8f9fa';
                    th.style.textAlign = 'left';
                    headerRow.appendChild(th);
                });

                thead.appendChild(headerRow);
                table.appendChild(thead);

                // Add table body
                const tbody = document.createElement('tbody');
                players[key].forEach((player, index) => {
                    // Debug: Log each player object
                    console.log(`PDF Export - Player ${index + 1}:`, player);

                    const row = document.createElement('tr');

                    // Rank
                    const rankCell = document.createElement('td');
                    rankCell.textContent = index + 1;
                    rankCell.style.border = '1px solid #ddd';
                    rankCell.style.padding = '8px';
                    row.appendChild(rankCell);

                    // Player name
                    const nameCell = document.createElement('td');
                    // Debug: Check if player.name exists and is not empty
                    console.log(`Player ${index + 1} name: "${player.name}", type: ${typeof player.name}`);

                    // Properly capitalize the player name
                    const playerName = player.name && player.name.length > 0
                        ? player.name.split(' ').map(word =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')
                        : 'NO NAME';
                    nameCell.textContent = playerName;
                    nameCell.style.border = '1px solid #ddd';
                    nameCell.style.padding = '8px';
                    row.appendChild(nameCell);

                    // Team
                    const teamCell = document.createElement('td');
                    console.log(`Player ${index + 1} team: "${player.team}", type: ${typeof player.team}`);
                    teamCell.textContent = player.team || 'NO TEAM';
                    teamCell.style.border = '1px solid #ddd';
                    teamCell.style.padding = '8px';
                    row.appendChild(teamCell);

                    // ADP
                    const adpCell = document.createElement('td');
                    adpCell.textContent = player.adp;
                    adpCell.style.border = '1px solid #ddd';
                    adpCell.style.padding = '8px';
                    row.appendChild(adpCell);

                    // Bye week
                    const byeCell = document.createElement('td');
                    byeCell.textContent = player.byeWeek;
                    byeCell.style.border = '1px solid #ddd';
                    byeCell.style.padding = '8px';
                    row.appendChild(byeCell);

                    // Notes
                    const notesCell = document.createElement('td');
                    notesCell.textContent = player.notes || '';
                    notesCell.style.border = '1px solid #ddd';
                    notesCell.style.padding = '8px';
                    row.appendChild(notesCell);

                    tbody.appendChild(row);
                });

                table.appendChild(tbody);
                tempDiv.appendChild(table);
            }
        });

        // Add to document temporarily
        document.body.appendChild(tempDiv);

        // Convert to canvas
        const canvas = await html2canvas(tempDiv, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
        });

        // Remove temporary div
        document.body.removeChild(tempDiv);

        // Create PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Save the PDF
        pdf.save('fantasy-football-rankings.pdf');

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
}; 
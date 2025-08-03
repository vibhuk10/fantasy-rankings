const { scrapeADP } = require('../../../backend/services/dataFetcher');

module.exports = async (req, res) => {
    // Set CORS headers for Vercel
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Simple test response to check if ADP API routing works
        res.json({
            success: true,
            data: [
                {
                    id: 'qb-1',
                    rank: 1,
                    name: 'Test QB 1',
                    team: 'TEST',
                    position: 'QB',
                    adp: 1,
                    byeWeek: 1,
                    notes: ''
                },
                {
                    id: 'qb-2',
                    rank: 2,
                    name: 'Test QB 2',
                    team: 'TEST',
                    position: 'QB',
                    adp: 2,
                    byeWeek: 2,
                    notes: ''
                }
            ]
        });
    } catch (error) {
        console.error('Error in QB ADP API:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch QB ADP',
            message: error.message
        });
    }
}; 
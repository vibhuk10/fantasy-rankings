const RankingEngine = require('./utils/rankingEngine');
const { scrapeADP } = require('./services/dataFetcher');

const rankingEngine = new RankingEngine();

module.exports = async (req, res) => {
    // Set CORS headers for Vercel
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    try {
        if (pathname === '/api/qb') {
            const qbs = await rankingEngine.rankQBs();
            res.json({
                success: true,
                data: qbs,
                message: 'QB rankings retrieved successfully'
            });
        } else if (pathname === '/api/rb') {
            const rbs = await rankingEngine.rankRBs();
            res.json({
                success: true,
                data: rbs,
                message: 'RB rankings retrieved successfully'
            });
        } else if (pathname === '/api/wr') {
            const wrs = await rankingEngine.rankWRs();
            res.json({
                success: true,
                data: wrs,
                message: 'WR rankings retrieved successfully'
            });
        } else if (pathname === '/api/te') {
            const tes = await rankingEngine.rankTEs();
            res.json({
                success: true,
                data: tes,
                message: 'TE rankings retrieved successfully'
            });
        } else if (pathname === '/api/adp/qb') {
            const adpData = await scrapeADP('qb');
            res.json({
                success: true,
                data: adpData
            });
        } else if (pathname === '/api/adp/rb') {
            const adpData = await scrapeADP('rb');
            res.json({
                success: true,
                data: adpData
            });
        } else if (pathname === '/api/adp/wr') {
            const adpData = await scrapeADP('wr');
            res.json({
                success: true,
                data: adpData
            });
        } else if (pathname === '/api/adp/te') {
            const adpData = await scrapeADP('te');
            res.json({
                success: true,
                data: adpData
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'API endpoint not found',
                pathname: pathname
            });
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
}; 
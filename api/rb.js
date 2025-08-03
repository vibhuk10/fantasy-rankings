const RankingEngine = require('./utils/rankingEngine');

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

  try {
    const rbs = await rankingEngine.rankRBs();
    res.json({
      success: true,
      data: rbs,
      message: 'RB rankings retrieved successfully'
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}; 
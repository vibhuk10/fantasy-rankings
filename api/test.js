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
    // Test if we can require the backend modules
    const RankingEngine = require('../../backend/utils/rankingEngine');
    const rankingEngine = new RankingEngine();
    
    res.json({
      success: true,
      message: 'Backend modules loaded successfully',
      test: 'API is working'
    });
  } catch (error) {
    console.error('Error loading backend modules:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load backend modules',
      message: error.message,
      stack: error.stack
    });
  }
}; 
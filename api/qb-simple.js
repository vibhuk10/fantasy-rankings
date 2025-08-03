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
    // Return static test data
    const qbs = [
      {
        id: 'qb-1',
        rank: 1,
        name: 'Josh Allen',
        team: 'BUF',
        position: 'QB',
        passAttempts: 565,
        passYards: 4306,
        passTds: 35,
        completionPercentage: 63.3,
        yardsPerAttempt: 7.6,
        rushYards: 762,
        rushTds: 15,
        fantasyPPG: 24.8,
        compositeScore: 95.2
      },
      {
        id: 'qb-2',
        rank: 2,
        name: 'Patrick Mahomes',
        team: 'KC',
        position: 'QB',
        passAttempts: 597,
        passYards: 4183,
        passTds: 31,
        completionPercentage: 66.3,
        yardsPerAttempt: 7.0,
        rushYards: 389,
        rushTds: 5,
        fantasyPPG: 23.1,
        compositeScore: 92.8
      }
    ];

    res.json({
      success: true,
      data: qbs,
      message: 'QB rankings retrieved successfully'
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
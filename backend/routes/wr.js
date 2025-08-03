const express = require('express');
const router = express.Router();
const RankingEngine = require('../utils/rankingEngine');

const rankingEngine = new RankingEngine();

// GET all WR rankings
router.get('/', async (req, res) => {
  try {
    const wrs = await rankingEngine.rankWRs();
    res.json({
      success: true,
      data: wrs,
      message: 'WR rankings retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching WR rankings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch WR rankings',
      message: error.message
    });
  }
});

// GET WR by ID
router.get('/:id', async (req, res) => {
  try {
    const wrs = await rankingEngine.rankWRs();
    const wr = wrs.find(w => w.id === parseInt(req.params.id));
    
    if (!wr) {
      return res.status(404).json({
        success: false,
        error: 'WR not found'
      });
    }
    
    res.json({
      success: true,
      data: wr
    });
  } catch (error) {
    console.error('Error fetching WR by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch WR',
      message: error.message
    });
  }
});

// GET WRs by team
router.get('/team/:team', async (req, res) => {
  try {
    const wrs = await rankingEngine.rankWRs();
    const teamWRs = wrs.filter(w => 
      w.team.toLowerCase() === req.params.team.toLowerCase()
    );
    
    res.json({
      success: true,
      data: teamWRs,
      message: `WRs for team ${req.params.team} retrieved successfully`
    });
  } catch (error) {
    console.error('Error fetching WRs by team:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch WRs by team',
      message: error.message
    });
  }
});

module.exports = router; 
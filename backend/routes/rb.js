const express = require('express');
const router = express.Router();
const RankingEngine = require('../utils/rankingEngine');

const rankingEngine = new RankingEngine();

// GET all RB rankings
router.get('/', async (req, res) => {
  try {
    const rbs = await rankingEngine.rankRBs();
    res.json({
      success: true,
      data: rbs,
      message: 'RB rankings retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching RB rankings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch RB rankings',
      message: error.message
    });
  }
});

// GET RB by ID
router.get('/:id', async (req, res) => {
  try {
    const rbs = await rankingEngine.rankRBs();
    const rb = rbs.find(r => r.id === parseInt(req.params.id));
    
    if (!rb) {
      return res.status(404).json({
        success: false,
        error: 'RB not found'
      });
    }
    
    res.json({
      success: true,
      data: rb
    });
  } catch (error) {
    console.error('Error fetching RB by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch RB',
      message: error.message
    });
  }
});

// GET RBs by team
router.get('/team/:team', async (req, res) => {
  try {
    const rbs = await rankingEngine.rankRBs();
    const teamRBs = rbs.filter(r => 
      r.team.toLowerCase() === req.params.team.toLowerCase()
    );
    
    res.json({
      success: true,
      data: teamRBs,
      message: `RBs for team ${req.params.team} retrieved successfully`
    });
  } catch (error) {
    console.error('Error fetching RBs by team:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch RBs by team',
      message: error.message
    });
  }
});

module.exports = router; 
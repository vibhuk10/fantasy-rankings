const express = require('express');
const router = express.Router();
const RankingEngine = require('../utils/rankingEngine');

const rankingEngine = new RankingEngine();

// GET all QB rankings
router.get('/', async (req, res) => {
  try {
    const qbs = await rankingEngine.rankQBs();
    res.json({
      success: true,
      data: qbs,
      message: 'QB rankings retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching QB rankings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch QB rankings',
      message: error.message
    });
  }
});

// GET QB by ID
router.get('/:id', async (req, res) => {
  try {
    const qbs = await rankingEngine.rankQBs();
    const qb = qbs.find(q => q.id === parseInt(req.params.id));
    
    if (!qb) {
      return res.status(404).json({
        success: false,
        error: 'QB not found'
      });
    }
    
    res.json({
      success: true,
      data: qb
    });
  } catch (error) {
    console.error('Error fetching QB by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch QB',
      message: error.message
    });
  }
});

// GET QBs by team
router.get('/team/:team', async (req, res) => {
  try {
    const qbs = await rankingEngine.rankQBs();
    const teamQBs = qbs.filter(q => 
      q.team.toLowerCase() === req.params.team.toLowerCase()
    );
    
    res.json({
      success: true,
      data: teamQBs,
      message: `QBs for team ${req.params.team} retrieved successfully`
    });
  } catch (error) {
    console.error('Error fetching QBs by team:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch QBs by team',
      message: error.message
    });
  }
});

module.exports = router; 
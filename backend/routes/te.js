const express = require('express');
const router = express.Router();
const RankingEngine = require('../utils/rankingEngine');

const rankingEngine = new RankingEngine();

// GET all TE rankings
router.get('/', async (req, res) => {
  try {
    const tes = await rankingEngine.rankTEs();
    res.json({
      success: true,
      data: tes,
      message: 'TE rankings retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching TE rankings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch TE rankings',
      message: error.message
    });
  }
});

// GET TE by ID
router.get('/:id', async (req, res) => {
  try {
    const tes = await rankingEngine.rankTEs();
    const te = tes.find(t => t.id === parseInt(req.params.id));

    if (!te) {
      return res.status(404).json({
        success: false,
        error: 'TE not found'
      });
    }

    res.json({
      success: true,
      data: te
    });
  } catch (error) {
    console.error('Error fetching TE by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch TE',
      message: error.message
    });
  }
});

// GET TEs by team
router.get('/team/:team', async (req, res) => {
  try {
    const tes = await rankingEngine.rankTEs();
    const teamTEs = tes.filter(t =>
      t.team.toLowerCase() === req.params.team.toLowerCase()
    );

    res.json({
      success: true,
      data: teamTEs,
      message: `TEs for team ${req.params.team} retrieved successfully`
    });
  } catch (error) {
    console.error('Error fetching TEs by team:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch TEs by team',
      message: error.message
    });
  }
});

module.exports = router; 
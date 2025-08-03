// Fantasy Football Ranking Engine
// Implements ranking algorithms for QB, RB, WR, and TE positions

const DataFetcher = require('../services/dataFetcher');

class RankingEngine {
  constructor() {
    this.dataFetcher = new DataFetcher();
  }

  // Normalize a value using z-score
  normalizeValue(value, mean, stdDev) {
    if (stdDev === 0) return 0;
    return (value - mean) / stdDev;
  }

  // Calculate z-score for a set of values
  calculateZScore(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return values.map(value => this.normalizeValue(value, mean, stdDev));
  }

  // Calculate composite score for QB
  calculateQBScore(player) {
    const weights = {
      passAttempts: 0.15,      // Volume
      completionPercentage: 0.10, // Efficiency
      yardsPerAttempt: 0.15,   // Efficiency
      passTds: 0.20,           // Scoring
      rushYards: 0.15,         // Rushing upside
      rushTds: 0.10,           // Rushing scoring
      fantasyPPG: 0.15         // Overall fantasy production
    };

    let score = 0;
    let totalWeight = 0;

    // Normalize each metric and apply weights
    Object.keys(weights).forEach(metric => {
      if (player[metric] !== undefined && player[metric] !== null) {
        const value = parseFloat(player[metric]) || 0;
        score += value * weights[metric];
        totalWeight += weights[metric];
      }
    });

    return totalWeight > 0 ? score / totalWeight : 0;
  }

  // Calculate composite score for RB
  calculateRBScore(player) {
    const weights = {
      rushAttempts: 0.20,      // Volume
      yardsPerRush: 0.15,      // Efficiency
      rushTds: 0.20,           // Scoring
      targets: 0.15,            // Receiving volume
      catchRate: 0.10,          // Receiving efficiency
      fantasyPPG: 0.20          // Overall fantasy production
    };

    let score = 0;
    let totalWeight = 0;

    Object.keys(weights).forEach(metric => {
      if (player[metric] !== undefined && player[metric] !== null) {
        const value = parseFloat(player[metric]) || 0;
        score += value * weights[metric];
        totalWeight += weights[metric];
      }
    });

    return totalWeight > 0 ? score / totalWeight : 0;
  }

  // Calculate composite score for WR
  calculateWRScore(player) {
    const weights = {
      targets: 0.20,            // Volume
      receptions: 0.15,         // Volume
      yardsPerReception: 0.15,  // Efficiency
      recTds: 0.20,             // Scoring
      catchRate: 0.10,          // Efficiency
      fantasyPPG: 0.20          // Overall fantasy production
    };

    let score = 0;
    let totalWeight = 0;

    Object.keys(weights).forEach(metric => {
      if (player[metric] !== undefined && player[metric] !== null) {
        const value = parseFloat(player[metric]) || 0;
        score += value * weights[metric];
        totalWeight += weights[metric];
      }
    });

    return totalWeight > 0 ? score / totalWeight : 0;
  }

  // Calculate composite score for TE
  calculateTEScore(player) {
    const weights = {
      targets: 0.20,            // Volume
      receptions: 0.15,         // Volume
      yardsPerReception: 0.15,  // Efficiency
      recTds: 0.20,             // Scoring
      catchRate: 0.10,           // Efficiency
      fantasyPPG: 0.20          // Overall fantasy production
    };

    let score = 0;
    let totalWeight = 0;

    Object.keys(weights).forEach(metric => {
      if (player[metric] !== undefined && player[metric] !== null) {
        const value = parseFloat(player[metric]) || 0;
        score += value * weights[metric];
        totalWeight += weights[metric];
      }
    });

    return totalWeight > 0 ? score / totalWeight : 0;
  }

  // Rank QBs using real 2024 data
  async rankQBs() {
    try {
      console.log('Ranking QBs with 2024 season data...');
      
      // Try to load cached data first
      let data = await this.dataFetcher.loadCachedData();
      
      // If no cached data, fetch fresh data
      if (!data) {
        data = await this.dataFetcher.fetchAllData();
      }

      const qbs = data.QB || [];
      
      if (qbs.length === 0) {
        console.log('No QB data available, using sample data');
        return this.getSampleQBs();
      }

      // Calculate composite scores
      const rankedQBs = qbs.map(qb => ({
        ...qb,
        compositeScore: this.calculateQBScore(qb)
      }))
      .filter(qb => qb.compositeScore > 0)
      .sort((a, b) => b.compositeScore - a.compositeScore)
      .slice(0, 50)
      .map((qb, index) => ({
        ...qb,
        rank: index + 1,
        id: index + 1
      }));

      console.log(`Ranked ${rankedQBs.length} QBs`);
      return rankedQBs;
    } catch (error) {
      console.error('Error ranking QBs:', error.message);
      return this.getSampleQBs();
    }
  }

  // Rank RBs using real 2024 data
  async rankRBs() {
    try {
      console.log('Ranking RBs with 2024 season data...');
      
      let data = await this.dataFetcher.loadCachedData();
      
      if (!data) {
        data = await this.dataFetcher.fetchAllData();
      }

      const rbs = data.RB || [];
      
      if (rbs.length === 0) {
        console.log('No RB data available, using sample data');
        return this.getSampleRBs();
      }

      const rankedRBs = rbs.map(rb => ({
        ...rb,
        compositeScore: this.calculateRBScore(rb)
      }))
      .filter(rb => rb.compositeScore > 0)
      .sort((a, b) => b.compositeScore - a.compositeScore)
      .slice(0, 50)
      .map((rb, index) => ({
        ...rb,
        rank: index + 1,
        id: index + 1
      }));

      console.log(`Ranked ${rankedRBs.length} RBs`);
      return rankedRBs;
    } catch (error) {
      console.error('Error ranking RBs:', error.message);
      return this.getSampleRBs();
    }
  }

  // Rank WRs using real 2024 data
  async rankWRs() {
    try {
      console.log('Ranking WRs with 2024 season data...');
      
      let data = await this.dataFetcher.loadCachedData();
      
      if (!data) {
        data = await this.dataFetcher.fetchAllData();
      }

      const wrs = data.WR || [];
      
      if (wrs.length === 0) {
        console.log('No WR data available, using sample data');
        return this.getSampleWRs();
      }

      const rankedWRs = wrs.map(wr => ({
        ...wr,
        compositeScore: this.calculateWRScore(wr)
      }))
      .filter(wr => wr.compositeScore > 0)
      .sort((a, b) => b.compositeScore - a.compositeScore)
      .slice(0, 50)
      .map((wr, index) => ({
        ...wr,
        rank: index + 1,
        id: index + 1
      }));

      console.log(`Ranked ${rankedWRs.length} WRs`);
      return rankedWRs;
    } catch (error) {
      console.error('Error ranking WRs:', error.message);
      return this.getSampleWRs();
    }
  }

  // Rank TEs using real 2024 data
  async rankTEs() {
    try {
      console.log('Ranking TEs with 2024 season data...');
      
      let data = await this.dataFetcher.loadCachedData();
      
      if (!data) {
        data = await this.dataFetcher.fetchAllData();
      }

      const tes = data.TE || [];
      
      if (tes.length === 0) {
        console.log('No TE data available, using sample data');
        return this.getSampleTEs();
      }

      const rankedTEs = tes.map(te => ({
        ...te,
        compositeScore: this.calculateTEScore(te)
      }))
      .filter(te => te.compositeScore > 0)
      .sort((a, b) => b.compositeScore - a.compositeScore)
      .slice(0, 50)
      .map((te, index) => ({
        ...te,
        rank: index + 1,
        id: index + 1
      }));

      console.log(`Ranked ${rankedTEs.length} TEs`);
      return rankedTEs;
    } catch (error) {
      console.error('Error ranking TEs:', error.message);
      return this.getSampleTEs();
    }
  }

  // Get top players for a position
  async getTopPlayers(position, limit = 50) {
    let players = [];
    
    switch (position.toLowerCase()) {
      case 'qb':
        players = await this.rankQBs();
        break;
      case 'rb':
        players = await this.rankRBs();
        break;
      case 'wr':
        players = await this.rankWRs();
        break;
      case 'te':
        players = await this.rankTEs();
        break;
      default:
        throw new Error(`Invalid position: ${position}`);
    }

    return players.slice(0, limit);
  }

  // Sample data fallbacks (from the original sampleData.js)
  getSampleQBs() {
    return [
      {
        id: 1,
        name: "josh allen",
        team: "BUF",
        position: "QB",
        rank: 1,
        passAttempts: 565,
        passYards: 4306,
        passTds: 35,
        passInts: 14,
        rushYards: 762,
        rushTds: 15,
        fantasyPPG: 24.8,
        compositeScore: 95.2
      },
      {
        id: 2,
        name: "patrick mahomes",
        team: "KC",
        position: "QB",
        rank: 2,
        passAttempts: 597,
        passYards: 4183,
        passTds: 31,
        passInts: 8,
        rushYards: 389,
        rushTds: 5,
        fantasyPPG: 23.1,
        compositeScore: 92.8
      }
    ];
  }

  getSampleRBs() {
    return [
      {
        id: 1,
        name: "christian mccaffrey",
        team: "SF",
        position: "RB",
        rank: 1,
        rushAttempts: 272,
        rushYards: 1459,
        rushTds: 14,
        targets: 67,
        receptions: 53,
        recYards: 537,
        recTds: 7,
        fantasyPPG: 25.2,
        compositeScore: 98.5
      },
      {
        id: 2,
        name: "austin ekeler",
        team: "LAC",
        position: "RB",
        rank: 2,
        rushAttempts: 179,
        rushYards: 628,
        rushTds: 5,
        targets: 94,
        receptions: 74,
        recYards: 628,
        recTds: 5,
        fantasyPPG: 18.9,
        compositeScore: 89.3
      }
    ];
  }

  getSampleWRs() {
    return [
      {
        id: 1,
        name: "tyreek hill",
        team: "MIA",
        position: "WR",
        rank: 1,
        targets: 171,
        receptions: 119,
        recYards: 1799,
        recTds: 13,
        fantasyPPG: 22.4,
        compositeScore: 96.8
      },
      {
        id: 2,
        name: "cee dee lamb",
        team: "DAL",
        position: "WR",
        rank: 2,
        targets: 156,
        receptions: 107,
        recYards: 1351,
        recTds: 9,
        fantasyPPG: 20.1,
        compositeScore: 91.2
      }
    ];
  }

  getSampleTEs() {
    return [
      {
        id: 1,
        name: "travis kelce",
        team: "KC",
        position: "TE",
        rank: 1,
        targets: 121,
        receptions: 93,
        recYards: 984,
        recTds: 5,
        fantasyPPG: 18.2,
        compositeScore: 94.5
      },
      {
        id: 2,
        name: "sam laporta",
        team: "DET",
        position: "TE",
        rank: 2,
        targets: 120,
        receptions: 86,
        recYards: 889,
        recTds: 10,
        fantasyPPG: 16.8,
        compositeScore: 89.7
      }
    ];
  }
}

module.exports = RankingEngine; 
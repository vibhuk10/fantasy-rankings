// Sample player data for testing the ranking algorithm
// This would normally come from APIs or databases

const sampleQBs = [
  {
    id: 1,
    name: "Patrick Mahomes",
    team: "KC",
    position: "QB",
    passAttempts: 648,
    rushingYards: 389,
    redZoneAttempts: 45,
    fantasyPPG: 24.8,
    completionPercentage: 66.3,
    epaPerPlay: 0.28,
    airYardsPerAttempt: 8.2
  },
  {
    id: 2,
    name: "Josh Allen",
    team: "BUF",
    position: "QB",
    passAttempts: 565,
    rushingYards: 762,
    redZoneAttempts: 38,
    fantasyPPG: 23.1,
    completionPercentage: 63.3,
    epaPerPlay: 0.22,
    airYardsPerAttempt: 7.8
  },
  {
    id: 3,
    name: "Jalen Hurts",
    team: "PHI",
    position: "QB",
    passAttempts: 460,
    rushingYards: 760,
    redZoneAttempts: 42,
    fantasyPPG: 22.9,
    completionPercentage: 66.5,
    epaPerPlay: 0.25,
    airYardsPerAttempt: 8.1
  },
  {
    id: 4,
    name: "Lamar Jackson",
    team: "BAL",
    position: "QB",
    passAttempts: 326,
    rushingYards: 764,
    redZoneAttempts: 35,
    fantasyPPG: 21.4,
    completionPercentage: 62.3,
    epaPerPlay: 0.20,
    airYardsPerAttempt: 7.5
  },
  {
    id: 5,
    name: "Justin Fields",
    team: "CHI",
    position: "QB",
    passAttempts: 318,
    rushingYards: 1143,
    redZoneAttempts: 28,
    fantasyPPG: 19.8,
    completionPercentage: 60.4,
    epaPerPlay: 0.15,
    airYardsPerAttempt: 7.2
  }
];

const sampleRBs = [
  {
    id: 1,
    name: "Christian McCaffrey",
    team: "SF",
    position: "RB",
    totalOpportunities: 339,
    redZoneTouches: 45,
    snapShare: 85.2,
    yardsAfterContact: 3.2,
    missedTacklesForced: 89,
    breakawayRunRate: 8.5,
    weightedOpportunities: 425
  },
  {
    id: 2,
    name: "Austin Ekeler",
    team: "LAC",
    position: "RB",
    totalOpportunities: 276,
    redZoneTouches: 38,
    snapShare: 78.5,
    yardsAfterContact: 2.8,
    missedTacklesForced: 67,
    breakawayRunRate: 6.2,
    weightedOpportunities: 345
  },
  {
    id: 3,
    name: "Saquon Barkley",
    team: "NYG",
    position: "RB",
    totalOpportunities: 295,
    redZoneTouches: 42,
    snapShare: 82.1,
    yardsAfterContact: 3.1,
    missedTacklesForced: 78,
    breakawayRunRate: 7.8,
    weightedOpportunities: 368
  },
  {
    id: 4,
    name: "Derrick Henry",
    team: "TEN",
    position: "RB",
    totalOpportunities: 349,
    redZoneTouches: 48,
    snapShare: 79.3,
    yardsAfterContact: 3.5,
    missedTacklesForced: 95,
    breakawayRunRate: 9.1,
    weightedOpportunities: 436
  },
  {
    id: 5,
    name: "Nick Chubb",
    team: "CLE",
    position: "RB",
    totalOpportunities: 302,
    redZoneTouches: 41,
    snapShare: 76.8,
    yardsAfterContact: 3.3,
    missedTacklesForced: 82,
    breakawayRunRate: 8.2,
    weightedOpportunities: 378
  }
];

const sampleWRs = [
  {
    id: 1,
    name: "Justin Jefferson",
    team: "MIN",
    position: "WR",
    targets: 184,
    targetsPerRouteRun: 0.32,
    airYards: 1892,
    yardsPerRouteRun: 3.2,
    redZoneTargets: 18,
    targetShare: 0.29
  },
  {
    id: 2,
    name: "Tyreek Hill",
    team: "MIA",
    position: "WR",
    targets: 171,
    targetsPerRouteRun: 0.28,
    airYards: 1756,
    yardsPerRouteRun: 3.1,
    redZoneTargets: 16,
    targetShare: 0.27
  },
  {
    id: 3,
    name: "Davante Adams",
    team: "LV",
    position: "WR",
    targets: 180,
    targetsPerRouteRun: 0.30,
    airYards: 1823,
    yardsPerRouteRun: 3.0,
    redZoneTargets: 19,
    targetShare: 0.31
  },
  {
    id: 4,
    name: "Stefon Diggs",
    team: "BUF",
    position: "WR",
    targets: 154,
    targetsPerRouteRun: 0.26,
    airYards: 1654,
    yardsPerRouteRun: 2.9,
    redZoneTargets: 15,
    targetShare: 0.25
  },
  {
    id: 5,
    name: "A.J. Brown",
    team: "PHI",
    position: "WR",
    targets: 145,
    targetsPerRouteRun: 0.24,
    airYards: 1587,
    yardsPerRouteRun: 2.8,
    redZoneTargets: 14,
    targetShare: 0.23
  }
];

const sampleTEs = [
  {
    id: 1,
    name: "Travis Kelce",
    team: "KC",
    position: "TE",
    routeParticipation: 89.5,
    targetsPerRouteRun: 0.25,
    yardsPerRouteRun: 2.8,
    targetShare: 0.24,
    redZoneTargets: 12,
    slotSnapPercentage: 45.2
  },
  {
    id: 2,
    name: "Mark Andrews",
    team: "BAL",
    position: "TE",
    routeParticipation: 85.3,
    targetsPerRouteRun: 0.22,
    yardsPerRouteRun: 2.5,
    targetShare: 0.21,
    redZoneTargets: 11,
    slotSnapPercentage: 42.1
  },
  {
    id: 3,
    name: "George Kittle",
    team: "SF",
    position: "TE",
    routeParticipation: 82.7,
    targetsPerRouteRun: 0.20,
    yardsPerRouteRun: 2.4,
    targetShare: 0.19,
    redZoneTargets: 10,
    slotSnapPercentage: 38.5
  },
  {
    id: 4,
    name: "T.J. Hockenson",
    team: "MIN",
    position: "TE",
    routeParticipation: 78.9,
    targetsPerRouteRun: 0.18,
    yardsPerRouteRun: 2.2,
    targetShare: 0.17,
    redZoneTargets: 9,
    slotSnapPercentage: 35.2
  },
  {
    id: 5,
    name: "Darren Waller",
    team: "NYG",
    position: "TE",
    routeParticipation: 75.4,
    targetsPerRouteRun: 0.16,
    yardsPerRouteRun: 2.0,
    targetShare: 0.15,
    redZoneTargets: 8,
    slotSnapPercentage: 32.8
  }
];

module.exports = {
  sampleQBs,
  sampleRBs,
  sampleWRs,
  sampleTEs
}; 

// Modern biker/traveler ranking system inspired by PUBG progression
export interface BikerRank {
  id: number;
  name: string;
  minMiles: number;
  maxMiles: number;
  patch: string;
  tier: string;
  description: string;
}

export const bikerRanks: BikerRank[] = [
  {
    id: 1,
    name: "Rookie Rider",
    minMiles: 0,
    maxMiles: 499,
    patch: "🔰",
    tier: "Bronze",
    description: "Just starting the journey"
  },
  {
    id: 2,
    name: "Street Explorer",
    minMiles: 500,
    maxMiles: 1499,
    patch: "🛣️",
    tier: "Bronze",
    description: "Learning the local roads"
  },
  {
    id: 3,
    name: "City Cruiser",
    minMiles: 1500,
    maxMiles: 3499,
    patch: "🏙️",
    tier: "Bronze",
    description: "Master of urban riding"
  },
  {
    id: 4,
    name: "Highway Warrior",
    minMiles: 3500,
    maxMiles: 7499,
    patch: "⚔️",
    tier: "Silver",
    description: "Conquering the highways"
  },
  {
    id: 5,
    name: "Road Captain",
    minMiles: 7500,
    maxMiles: 14999,
    patch: "🛡️",
    tier: "Silver",
    description: "Leading the pack"
  },
  {
    id: 6,
    name: "Distance Ace",
    minMiles: 15000,
    maxMiles: 24999,
    patch: "🎯",
    tier: "Gold",
    description: "Elite long-distance rider"
  },
  {
    id: 7,
    name: "Route Master",
    minMiles: 25000,
    maxMiles: 39999,
    patch: "🗺️",
    tier: "Gold",
    description: "Navigator of endless routes"
  },
  {
    id: 8,
    name: "Iron Horse",
    minMiles: 40000,
    maxMiles: 59999,
    patch: "🐎",
    tier: "Platinum",
    description: "Unstoppable force on wheels"
  },
  {
    id: 9,
    name: "Road Legend",
    minMiles: 60000,
    maxMiles: 99999,
    patch: "👑",
    tier: "Diamond",
    description: "Legendary status achieved"
  },
  {
    id: 10,
    name: "Apex Nomad",
    minMiles: 100000,
    maxMiles: Infinity,
    patch: "💎",
    tier: "Master",
    description: "Ultimate road warrior"
  }
];

export function getUserRank(totalMiles: number): BikerRank {
  for (let i = bikerRanks.length - 1; i >= 0; i--) {
    const rank = bikerRanks[i];
    if (totalMiles >= rank.minMiles) {
      return rank;
    }
  }
  return bikerRanks[0]; // Default to Rookie Rider
}

export function getNextRank(totalMiles: number): BikerRank | null {
  const currentRank = getUserRank(totalMiles);
  const currentIndex = bikerRanks.findIndex(rank => rank.id === currentRank.id);
  
  if (currentIndex < bikerRanks.length - 1) {
    return bikerRanks[currentIndex + 1];
  }
  
  return null; // Already at highest rank
}

export function getMilesToNextRank(totalMiles: number): number {
  const nextRank = getNextRank(totalMiles);
  if (nextRank) {
    return nextRank.minMiles - totalMiles;
  }
  return 0; // Already at highest rank
}

// Get tier color for styling
export function getTierColor(tier: string): string {
  switch (tier) {
    case "Bronze": return "bg-amber-600";
    case "Silver": return "bg-gray-400";
    case "Gold": return "bg-yellow-500";
    case "Platinum": return "bg-blue-400";
    case "Diamond": return "bg-purple-500";
    case "Master": return "bg-red-500";
    default: return "bg-gray-500";
  }
}

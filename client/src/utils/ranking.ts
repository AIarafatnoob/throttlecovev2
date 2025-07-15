
// Modern biker/traveler ranking system with 20 levels based on kilometers
export interface BikerRank {
  id: number;
  name: string;
  minKm: number;
  maxKm: number;
  patch: string;
  tier: string;
  description: string;
}

export const bikerRanks: BikerRank[] = [
  {
    id: 1,
    name: "Rookie Rider",
    minKm: 0,
    maxKm: 999,
    patch: "🔰",
    tier: "Bronze",
    description: "Just starting the journey"
  },
  {
    id: 2,
    name: "Street Explorer",
    minKm: 1000,
    maxKm: 2999,
    patch: "🛣️",
    tier: "Bronze",
    description: "Learning the local roads"
  },
  {
    id: 3,
    name: "City Cruiser",
    minKm: 3000,
    maxKm: 4999,
    patch: "🏙️",
    tier: "Bronze",
    description: "Master of urban riding"
  },
  {
    id: 4,
    name: "Urban Navigator",
    minKm: 5000,
    maxKm: 7999,
    patch: "🧭",
    tier: "Bronze",
    description: "Navigating city streets with ease"
  },
  {
    id: 5,
    name: "Highway Warrior",
    minKm: 8000,
    maxKm: 12999,
    patch: "⚔️",
    tier: "Silver",
    description: "Conquering the highways"
  },
  {
    id: 6,
    name: "Road Captain",
    minKm: 13000,
    maxKm: 19999,
    patch: "🛡️",
    tier: "Silver",
    description: "Leading the pack"
  },
  {
    id: 7,
    name: "Distance Ace",
    minKm: 20000,
    maxKm: 29999,
    patch: "🎯",
    tier: "Silver",
    description: "Elite long-distance rider"
  },
  {
    id: 8,
    name: "Route Master",
    minKm: 30000,
    maxKm: 39999,
    patch: "🗺️",
    tier: "Silver",
    description: "Navigator of endless routes"
  },
  {
    id: 9,
    name: "Iron Horse",
    minKm: 40000,
    maxKm: 54999,
    patch: "🐎",
    tier: "Gold",
    description: "Unstoppable force on wheels"
  },
  {
    id: 10,
    name: "Speed Demon",
    minKm: 55000,
    maxKm: 69999,
    patch: "🔥",
    tier: "Gold",
    description: "Master of speed and endurance"
  },
  {
    id: 11,
    name: "Trail Blazer",
    minKm: 70000,
    maxKm: 89999,
    patch: "⭐",
    tier: "Gold",
    description: "Carving new paths"
  },
  {
    id: 12,
    name: "Wind Rider",
    minKm: 90000,
    maxKm: 109999,
    patch: "🌪️",
    tier: "Gold",
    description: "One with the wind"
  },
  {
    id: 13,
    name: "Road Legend",
    minKm: 110000,
    maxKm: 134999,
    patch: "👑",
    tier: "Platinum",
    description: "Legendary status achieved"
  },
  {
    id: 14,
    name: "Horizon Chaser",
    minKm: 135000,
    maxKm: 159999,
    patch: "🌅",
    tier: "Platinum",
    description: "Always chasing the next horizon"
  },
  {
    id: 15,
    name: "Storm Rider",
    minKm: 160000,
    maxKm: 189999,
    patch: "⚡",
    tier: "Platinum",
    description: "Conquering all weather conditions"
  },
  {
    id: 16,
    name: "Midnight Phantom",
    minKm: 190000,
    maxKm: 219999,
    patch: "🌙",
    tier: "Diamond",
    description: "Master of the night roads"
  },
  {
    id: 17,
    name: "Apex Predator",
    minKm: 220000,
    maxKm: 249999,
    patch: "🦅",
    tier: "Diamond",
    description: "Apex of riding prowess"
  },
  {
    id: 18,
    name: "Road Immortal",
    minKm: 250000,
    maxKm: 279999,
    patch: "🔱",
    tier: "Diamond",
    description: "Immortal among riders"
  },
  {
    id: 19,
    name: "Eternal Nomad",
    minKm: 280000,
    maxKm: 299999,
    patch: "♾️",
    tier: "Master",
    description: "Forever wandering the roads"
  },
  {
    id: 20,
    name: "Apex Nomad",
    minKm: 300000,
    maxKm: Infinity,
    patch: "💎",
    tier: "Master",
    description: "Ultimate road warrior"
  }
];

export function getUserRank(totalKm: number): BikerRank {
  for (let i = bikerRanks.length - 1; i >= 0; i--) {
    const rank = bikerRanks[i];
    if (totalKm >= rank.minKm) {
      return rank;
    }
  }
  return bikerRanks[0]; // Default to Rookie Rider
}

export function getNextRank(totalKm: number): BikerRank | null {
  const currentRank = getUserRank(totalKm);
  const currentIndex = bikerRanks.findIndex(rank => rank.id === currentRank.id);
  
  if (currentIndex < bikerRanks.length - 1) {
    return bikerRanks[currentIndex + 1];
  }
  
  return null; // Already at highest rank
}

export function getKmToNextRank(totalKm: number): number {
  const nextRank = getNextRank(totalKm);
  if (nextRank) {
    return nextRank.minKm - totalKm;
  }
  return 0; // Already at highest rank
}

export function getProgressRanks(totalKm: number): BikerRank[] {
  const currentRank = getUserRank(totalKm);
  const currentIndex = bikerRanks.findIndex(rank => rank.id === currentRank.id);
  
  const progressRanks = [];
  
  // Add current rank
  progressRanks.push(currentRank);
  
  // Add next two ranks if they exist
  if (currentIndex + 1 < bikerRanks.length) {
    progressRanks.push(bikerRanks[currentIndex + 1]);
  }
  if (currentIndex + 2 < bikerRanks.length) {
    progressRanks.push(bikerRanks[currentIndex + 2]);
  }
  
  return progressRanks;
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

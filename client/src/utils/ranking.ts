// Military ranking system based on total mileage
export interface MilitaryRank {
  id: number;
  name: string;
  minMiles: number;
  maxMiles: number;
  insignia: string;
  description: string;
}

export const militaryRanks: MilitaryRank[] = [
  {
    id: 1,
    name: "Private",
    minMiles: 0,
    maxMiles: 999,
    insignia: "🪖",
    description: "New recruit to the roads"
  },
  {
    id: 2,
    name: "Corporal",
    minMiles: 1000,
    maxMiles: 4999,
    insignia: "🎖️",
    description: "Getting comfortable on two wheels"
  },
  {
    id: 3,
    name: "Sergeant",
    minMiles: 5000,
    maxMiles: 9999,
    insignia: "🏅",
    description: "Experienced local rider"
  },
  {
    id: 4,
    name: "Staff Sergeant",
    minMiles: 10000,
    maxMiles: 19999,
    insignia: "🎗️",
    description: "Seasoned road warrior"
  },
  {
    id: 5,
    name: "Lieutenant",
    minMiles: 20000,
    maxMiles: 34999,
    insignia: "⭐",
    description: "Accomplished touring rider"
  },
  {
    id: 6,
    name: "Captain",
    minMiles: 35000,
    maxMiles: 49999,
    insignia: "🌟",
    description: "Elite distance rider"
  },
  {
    id: 7,
    name: "Major",
    minMiles: 50000,
    maxMiles: 74999,
    insignia: "💫",
    description: "Master of the highways"
  },
  {
    id: 8,
    name: "Colonel",
    minMiles: 75000,
    maxMiles: 99999,
    insignia: "🎊",
    description: "Legendary road commander"
  },
  {
    id: 9,
    name: "General",
    minMiles: 100000,
    maxMiles: 149999,
    insignia: "👑",
    description: "Supreme road authority"
  },
  {
    id: 10,
    name: "Field Marshal",
    minMiles: 150000,
    maxMiles: Infinity,
    insignia: "🏆",
    description: "Ultimate riding legend"
  }
];

export function getUserRank(totalMiles: number): MilitaryRank {
  for (let i = militaryRanks.length - 1; i >= 0; i--) {
    const rank = militaryRanks[i];
    if (totalMiles >= rank.minMiles) {
      return rank;
    }
  }
  return militaryRanks[0]; // Default to Private
}

export function getNextRank(totalMiles: number): MilitaryRank | null {
  const currentRank = getUserRank(totalMiles);
  const currentIndex = militaryRanks.findIndex(rank => rank.id === currentRank.id);
  
  if (currentIndex < militaryRanks.length - 1) {
    return militaryRanks[currentIndex + 1];
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
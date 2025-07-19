import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { bikerRanks, getUserRank, getNextRank, getKmToNextRank, getTierColor } from "@/utils/ranking";
import { Info } from "lucide-react";

interface RankDetailsModalProps {
  totalKilometers: number;
  children: React.ReactNode;
}

export const RankDetailsModal = ({ totalKilometers, children }: RankDetailsModalProps) => {
  const currentRank = getUserRank(totalKilometers);
  const nextRank = getNextRank(totalKilometers);
  const kmToNext = getKmToNextRank(totalKilometers);
  
  const currentProgress = nextRank 
    ? ((totalKilometers - currentRank.minKm) / (nextRank.minKm - currentRank.minKm)) * 100
    : 100;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Ranking System & Progression
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Rank Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 ${getTierColor(currentRank.tier)} rounded-full flex items-center justify-center`}>
                <span className="text-white text-xl font-bold">{currentRank.patch}</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">{currentRank.name}</h3>
                <p className="text-gray-600">{currentRank.tier} Tier</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">{currentRank.description}</p>
            <div className="text-sm text-gray-600">
              <p>Total Kilometers: <span className="font-semibold">{totalKilometers.toLocaleString()} km</span></p>
              {nextRank && (
                <>
                  <p>Next Rank: <span className="font-semibold">{nextRank.name}</span></p>
                  <p>Kilometers to Next: <span className="font-semibold">{kmToNext.toLocaleString()} km</span></p>
                  <div className="mt-2">
                    <Progress value={currentProgress} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">{currentProgress.toFixed(1)}% to next rank</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Roadmap Visualization */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Rider's Journey Roadmap</h4>
              <div className="text-xs text-gray-500">🏁 {totalKilometers.toLocaleString()} km traveled</div>
            </div>
            
            {/* Legend */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Achieved</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-[#FF3B30] rounded-full ring-2 ring-[#FF3B30] ring-opacity-30"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span>Upcoming</span>
                </div>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <div className="relative">
                {/* Roadmap path - curved journey line */}
                <div className="absolute left-6 top-6 bottom-6 w-1 bg-gradient-to-b from-green-400 via-yellow-400 via-orange-400 to-red-500 rounded-full opacity-60"></div>
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-300 rounded-full"></div>
                
                {bikerRanks.map((rank, index) => {
                  const isAchieved = totalKilometers >= rank.minKm;
                  const isCurrent = currentRank.id === rank.id;
                  const isLast = index === bikerRanks.length - 1;
                  
                  return (
                    <div key={rank.id} className="relative flex items-start gap-4 pb-8">
                      {/* Roadmap node */}
                      <div className="relative z-10 flex-shrink-0">
                        {/* Distance marker */}
                        <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 bg-white px-2 py-1 rounded-md border text-xs font-medium text-gray-600 shadow-sm">
                          {rank.minKm >= 1000 ? `${(rank.minKm / 1000).toFixed(0)}K` : rank.minKm}
                        </div>
                        
                        <div 
                          className={`w-14 h-14 rounded-full border-4 flex items-center justify-center transition-all duration-300 relative ${
                            isCurrent
                              ? `${getTierColor(rank.tier)} border-white shadow-lg ring-4 ring-[#FF3B30] ring-opacity-30 scale-110`
                              : isAchieved
                              ? `${getTierColor(rank.tier)} border-white shadow-md`
                              : 'bg-gray-100 border-gray-300'
                          }`}
                        >
                          <span className={`text-xl font-bold ${
                            isAchieved ? 'text-white' : 'text-gray-400'
                          }`}>
                            {rank.patch}
                          </span>
                          
                          {/* Tier indicator ring */}
                          {isAchieved && (
                            <div className={`absolute -inset-1 rounded-full border-2 ${
                              rank.tier === 'Bronze' ? 'border-amber-400' :
                              rank.tier === 'Silver' ? 'border-gray-400' :
                              rank.tier === 'Gold' ? 'border-yellow-400' :
                              rank.tier === 'Platinum' ? 'border-blue-400' :
                              rank.tier === 'Diamond' ? 'border-purple-400' :
                              'border-red-400'
                            } opacity-50`}></div>
                          )}
                        </div>
                        
                        {/* Progress indicator for current rank */}
                        {isCurrent && nextRank && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#FF3B30] rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                          </div>
                        )}
                        
                        {/* Achievement checkmark */}
                        {isAchieved && !isCurrent && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Rank details card */}
                      <div className={`flex-1 p-3 rounded-lg border transition-all ${
                        isCurrent 
                          ? 'border-[#FF3B30] bg-red-50 shadow-md' 
                          : isAchieved 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-gray-200 bg-gray-50 opacity-75'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className={`font-semibold ${
                            isCurrent ? 'text-[#FF3B30]' : isAchieved ? 'text-green-700' : 'text-gray-500'
                          }`}>
                            {rank.name}
                          </h5>
                          <Badge variant="outline" className={`text-xs ${
                            isCurrent ? 'border-[#FF3B30] text-[#FF3B30]' : ''
                          }`}>
                            {rank.tier}
                          </Badge>
                          {isCurrent && (
                            <Badge className="bg-[#FF3B30] text-white text-xs">Current</Badge>
                          )}
                        </div>
                        
                        <p className={`text-sm mb-2 ${
                          isAchieved ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          {rank.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-medium ${
                            isAchieved ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {rank.minKm.toLocaleString()} km
                            {rank.maxKm !== Infinity && ` - ${rank.maxKm.toLocaleString()} km`}
                          </span>
                          
                          {isCurrent && nextRank && (
                            <span className="text-[#FF3B30] font-medium">
                              {kmToNext.toLocaleString()} km to next
                            </span>
                          )}
                          
                          {isAchieved && !isCurrent && (
                            <span className="text-green-600 font-medium flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Achieved
                            </span>
                          )}
                        </div>

                        {/* Progress bar for current rank */}
                        {isCurrent && nextRank && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-[#FF3B30] h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${currentProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-[#FF3B30] mt-1">
                              {currentProgress.toFixed(1)}% progress to {nextRank.name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">Progress Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Current Level:</p>
                <p className="font-semibold">{currentRank.id}/20</p>
              </div>
              <div>
                <p className="text-gray-600">Total Progress:</p>
                <p className="font-semibold">{((totalKilometers / 300000) * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-600">Kilometers Remaining:</p>
                <p className="font-semibold">{Math.max(0, 300000 - totalKilometers).toLocaleString()} km</p>
              </div>
              <div>
                <p className="text-gray-600">Max Level:</p>
                <p className="font-semibold">300,000 km</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
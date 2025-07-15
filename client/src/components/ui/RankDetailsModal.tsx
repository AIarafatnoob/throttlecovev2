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

          {/* All Ranks List */}
          <div>
            <h4 className="font-semibold mb-3">All Ranks (20 Levels)</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {bikerRanks.map((rank, index) => {
                const isAchieved = totalKilometers >= rank.minKm;
                const isCurrent = currentRank.id === rank.id;
                
                return (
                  <div 
                    key={rank.id} 
                    className={`p-3 rounded-lg border transition-all ${
                      isCurrent 
                        ? 'border-[#FF3B30] bg-red-50' 
                        : isAchieved 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${getTierColor(rank.tier)} rounded-full flex items-center justify-center text-sm`}>
                        <span className="text-white font-bold">{rank.patch}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium">{rank.name}</h5>
                          <Badge variant="outline" className="text-xs">
                            {rank.tier}
                          </Badge>
                          {isCurrent && (
                            <Badge className="bg-[#FF3B30] text-white text-xs">Current</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{rank.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {rank.minKm.toLocaleString()} km {rank.maxKm === Infinity ? '+ (Max Level)' : `- ${rank.maxKm.toLocaleString()} km`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
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
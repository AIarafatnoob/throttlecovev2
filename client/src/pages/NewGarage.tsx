import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Motorcycle } from "@shared/schema";
import AddMotorcycleDialog from "@/components/ui/motorcycle/AddMotorcycleDialog";
import ExpandableMotorcycleCard from "@/components/ui/motorcycle/ExpandableMotorcycleCard";
import { Plus, MoreVertical, Wrench, MapPin, Calendar, Gauge, TrendingUp } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { getUserRank, getNextRank, getMilesToNextRank } from "@/utils/ranking";
import PartsCarousel from "@/components/ui/PartsCarousel";
import { useAuth } from "@/hooks/useAuth";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Modern motorcycle card component based on the mockup
const ModernMotorcycleCard = ({ motorcycle, onEdit, onDelete }: {
  motorcycle: Motorcycle;
  onEdit: (motorcycle: Motorcycle) => void;
  onDelete: (id: number) => void;
}) => {
  // Calculate next service date (mock data for now)
  const nextServiceDate = new Date();
  nextServiceDate.setDate(nextServiceDate.getDate() + 30);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                {/* Motorcycle silhouette icon */}
                <svg viewBox="0 0 100 100" className="w-10 h-10 text-white fill-current">
                  <path d="M15 70 C15 60, 25 50, 35 50 L65 50 C75 50, 85 60, 85 70 C85 80, 75 90, 65 90 L35 90 C25 90, 15 80, 15 70 Z M30 40 L70 40 C75 40, 80 35, 80 30 C80 25, 75 20, 70 20 L30 20 C25 20, 20 25, 20 30 C20 35, 25 40, 30 40 Z M45 30 L55 30 L50 40 Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#1A1A1A]">{motorcycle.name}</h3>
                <p className="text-gray-500 text-sm">{motorcycle.make} {motorcycle.model}</p>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(motorcycle)}>
                  <Wrench className="mr-2 h-4 w-4" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(motorcycle.id)}
                  className="text-red-600"
                >
                  <span className="mr-2">🗑️</span>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-1">Total Miles</p>
              <p className="text-2xl font-bold text-[#1A1A1A]">
                {motorcycle.mileage?.toLocaleString() || "12,000"}
              </p>
              <p className="text-xs text-gray-500">MI</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-1">Next Service</p>
              <p className="text-lg font-semibold text-[#1A1A1A]">
                {nextServiceDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
              <p className="text-xs text-gray-500">
                {nextServiceDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white rounded-full"
              onClick={() => {
                // Navigate to maintenance scheduler
                window.location.href = `/maintenance`;
              }}
            >
              Service
            </Button>
            <Button 
              className="flex-1 bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white rounded-full"
              onClick={async () => {
                // Open mileage update dialog
                const newMileage = prompt(`Current mileage: ${motorcycle.mileage || 0}. Enter new mileage:`);
                if (newMileage && !isNaN(Number(newMileage))) {
                  try {
                    // Update motorcycle mileage via API
                    await fetch(`/api/motorcycles/${motorcycle.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ mileage: Number(newMileage) })
                    });
                    
                    // Refresh the page to show updated mileage
                    window.location.reload();
                  } catch (error) {
                    alert('Failed to update mileage. Please try again.');
                  }
                }
              }}
            >
              New Mile
            </Button>
            <Button 
              className="flex-1 bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white rounded-full"
              onClick={() => {
                // Navigate to motorcycle detail page
                window.location.href = `/garage/${motorcycle.id}`;
              }}
            >
              Detail
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const NewGarage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [motorcycleToDelete, setMotorcycleToDelete] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const { data: motorcycles, isLoading, error } = useQuery<Motorcycle[]>({
    queryKey: ['/api/motorcycles'],
  });

  // Calculate total mileage for ranking
  const totalMileage = motorcycles?.reduce((sum: number, bike: Motorcycle) => sum + (bike.mileage || 0), 0) || 0;
  const currentRank = getUserRank(totalMileage);
  const nextRank = getNextRank(totalMileage);
  const milesToNext = getMilesToNextRank(totalMileage);
  
  const handleAddMotorcycle = () => {
    setIsAddDialogOpen(true);
  };
  
  const handleEditMotorcycle = (motorcycle: Motorcycle) => {
    toast({
      title: "Coming Soon",
      description: "Motorcycle editing feature will be available soon!",
    });
  };
  
  const handleDeleteMotorcycle = async () => {
    if (!motorcycleToDelete) return;
    
    try {
      await apiRequest("DELETE", `/api/motorcycles/${motorcycleToDelete}`, undefined);
      queryClient.invalidateQueries({ queryKey: ['/api/motorcycles'] });
      
      toast({
        title: "Motorcycle deleted",
        description: "Your motorcycle has been removed from the garage.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete motorcycle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setMotorcycleToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF3B30]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-gray-600">Failed to load your motorcycles. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8">
          <Card className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden w-full max-w-7xl mb-4">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#FF3B30] rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg sm:text-2xl">
                      {(user?.fullName || user?.username || "U").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg sm:text-xl text-[#1A1A1A] truncate">
                      {user?.fullName || user?.username || "User"}
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm truncate">Rider Profile</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 w-full lg:w-auto justify-around lg:justify-end">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl lg:text-4xl mb-1 sm:mb-2">{currentRank.insignia}</div>
                    <p className="text-gray-500 text-xs mb-1">Rank</p>
                    <p className="text-sm sm:text-lg font-bold text-[#1A1A1A]">{currentRank.name}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs mb-1">Total Miles</p>
                    <p className="text-sm sm:text-lg font-bold text-[#1A1A1A]">
                      {totalMileage.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs mb-1">Progress</p>
                    <p className="text-xs sm:text-sm font-semibold text-[#FF3B30]">
                      {nextRank ? `${milesToNext.toLocaleString()} to ${nextRank.name}` : "Max Rank"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {!motorcycles || motorcycles.length === 0 ? (
          <>
            <div className="text-center py-16 pb-32">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <div className="text-3xl sm:text-4xl">🏍️</div>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-[#1A1A1A]">Your garage is empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm sm:text-base">
                Add your first motorcycle to start tracking maintenance, mileage, and service schedules
              </p>
            </div>
            
            {/* Floating Add Bike Button */}
            <motion.div
              className="fixed bottom-6 right-6 z-50"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button 
                onClick={handleAddMotorcycle} 
                className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white rounded-full w-14 h-14 sm:w-16 sm:h-16 shadow-lg hover:shadow-xl transition-all duration-300 p-0"
              >
                <Plus className="h-6 w-6 sm:h-8 sm:w-8" />
              </Button>
            </motion.div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 pb-20">
            {motorcycles.map((motorcycle) => (
              <motion.div
                key={motorcycle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden h-full">
                  <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-2xl flex items-center justify-center flex-shrink-0">
                          <svg viewBox="0 0 100 100" className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-current">
                            <path d="M15 70 C15 60, 25 50, 35 50 L65 50 C75 50, 85 60, 85 70 C85 80, 75 90, 65 90 L35 90 C25 90, 15 80, 15 70 Z M30 40 L70 40 C75 40, 80 35, 80 30 C80 25, 75 20, 70 20 L30 20 C25 20, 20 25, 20 30 C20 35, 25 40, 30 40 Z M45 30 L55 30 L50 40 Z" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-base sm:text-lg text-[#1A1A1A] truncate leading-tight">{motorcycle.name}</h3>
                          <p className="text-gray-500 text-xs sm:text-sm truncate">{motorcycle.make} {motorcycle.model}</p>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-xl flex-shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditMotorcycle(motorcycle)}>
                            <Wrench className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setMotorcycleToDelete(motorcycle.id)}
                            className="text-red-600"
                          >
                            <span className="mr-2">🗑️</span>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 flex-1">
                      <div className="text-center bg-gray-50 rounded-2xl p-3 sm:p-4">
                        <p className="text-gray-500 text-xs mb-1">Total Miles</p>
                        <p className="text-lg sm:text-xl font-bold text-[#1A1A1A]">
                          {motorcycle.mileage?.toLocaleString() || "0"}
                        </p>
                        <p className="text-gray-400 text-xs">MI</p>
                      </div>
                      <div className="text-center bg-gray-50 rounded-2xl p-3 sm:p-4">
                        <p className="text-gray-500 text-xs mb-1">Next Service</p>
                        <p className="text-sm sm:text-base font-semibold text-[#FF3B30]">
                          Soon
                        </p>
                        <p className="text-gray-400 text-xs">Due</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <Button 
                        size="sm"
                        className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white rounded-xl py-2 text-xs sm:text-sm font-medium"
                        onClick={() => window.location.href = `/maintenance`}
                      >
                        <Wrench className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Service
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline" 
                        className="border-[#FF3B30] text-[#FF3B30] hover:bg-[#FF3B30] hover:text-white rounded-xl py-2 text-xs sm:text-sm font-medium"
                        onClick={async () => {
                          const newMileage = prompt(`Current mileage: ${motorcycle.mileage || 0}. Enter new mileage:`);
                          if (newMileage && !isNaN(Number(newMileage))) {
                            try {
                              await fetch(`/api/motorcycles/${motorcycle.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ mileage: Number(newMileage) })
                              });
                              window.location.reload();
                            } catch (error) {
                              alert('Failed to update mileage. Please try again.');
                            }
                          }
                        }}
                      >
                        <Gauge className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Update Miles
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Floating Add Bike Button */}
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button 
            onClick={handleAddMotorcycle} 
            className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white rounded-full w-14 h-14 sm:w-16 sm:h-16 shadow-lg hover:shadow-xl transition-all duration-300 p-0"
          >
            <Plus className="h-6 w-6 sm:h-8 sm:w-8" />
          </Button>
        </motion.div>

        <AddMotorcycleDialog 
          open={isAddDialogOpen} 
          onOpenChange={setIsAddDialogOpen}
          onSuccess={() => {
            setIsAddDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ['/api/motorcycles'] });
          }}
        />

        <AlertDialog open={motorcycleToDelete !== null} onOpenChange={() => setMotorcycleToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your motorcycle
                and all associated maintenance records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteMotorcycle} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default NewGarage;
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Your Garage</h1>
            <p className="text-gray-600">
              Manage your motorcycles and track their maintenance schedules
            </p>
          </div>
          
          <Button onClick={handleAddMotorcycle} className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 rounded-full px-6">
            <Plus className="h-4 w-4 mr-2" />
            Add Bike
          </Button>
        </div>

        {/* Military Ranking System - Dedicated Section */}
        <Card className="bg-gradient-to-r from-[#FF3B30]/10 to-[#FF3B30]/5 border-[#FF3B30]/20 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {/* User Profile Section */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded-full flex items-center justify-center mb-2 overflow-hidden">
                    {/* Mock user avatar - replace with actual user image when available */}
                    <div className="w-full h-full bg-gradient-to-br from-[#FF3B30] to-[#FF3B30]/80 flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
                      {(user?.fullName || user?.username || "U").charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-[#1A1A1A] text-center">{user?.fullName || user?.username || "User"}</p>
                </div>
                
                {/* Rank Information */}
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{currentRank.insignia}</div>
                  <div>
                    <h3 className="font-bold text-xl text-[#1A1A1A]">{currentRank.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{currentRank.description}</p>
                    <div className="flex items-center space-x-2">
                      <Gauge className="h-4 w-4 text-[#FF3B30]" />
                      <span className="text-sm font-medium">{totalMileage.toLocaleString()} total miles</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {nextRank && (
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-2">Next Rank: <span className="font-medium">{nextRank.name}</span></p>
                  <div className="flex items-center space-x-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-[#FF3B30]" />
                    <span className="text-sm font-medium text-[#FF3B30]">
                      {milesToNext.toLocaleString()} miles to go
                    </span>
                  </div>
                  <div className="w-40 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-[#FF3B30] h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min(100, ((totalMileage - currentRank.minMiles) / (nextRank.minMiles - currentRank.minMiles)) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {!motorcycles || motorcycles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-4xl">🏍️</div>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-[#1A1A1A]">Your garage is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Add your first motorcycle to start tracking maintenance, mileage, and service schedules
            </p>
            <Button onClick={handleAddMotorcycle} className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 px-8 py-3 rounded-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Bike
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {motorcycles.map((motorcycle) => (
              <ExpandableMotorcycleCard
                key={motorcycle.id}
                motorcycle={motorcycle}
                onEdit={handleEditMotorcycle}
                onDelete={(id) => setMotorcycleToDelete(id)}
              />
            ))}
          </div>
        )}

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
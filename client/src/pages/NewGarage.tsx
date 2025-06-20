import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Motorcycle } from "@shared/schema";
import AddMotorcycleDialog from "@/components/ui/motorcycle/AddMotorcycleDialog";
import ExpandableMotorcycleCard from "@/components/ui/motorcycle/ExpandableMotorcycleCard";
import DocumentUploadDialog from "@/components/ui/DocumentUpload";

import { Plus, MoreVertical, Wrench, MapPin, Calendar, Gauge, TrendingUp, Camera, User, FileText, Settings, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { getUserRank, getNextRank, getMilesToNextRank, getTierColor, bikerRanks } from "@/utils/ranking";
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
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [expandedMotorcycleId, setExpandedMotorcycleId] = useState<number | null>(null);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [profilePicture, setProfilePicture] = useState<string | null>(user?.avatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

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

  const handleToggleExpand = (motorcycleId: number) => {
    setExpandedMotorcycleId(expandedMotorcycleId === motorcycleId ? null : motorcycleId);
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

    const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error", 
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
        toast({
          title: "Profile Picture Updated",
          description: "Your profile picture has been updated.",
        });
      };
      reader.readAsDataURL(file);
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
                <div className="flex items-center gap-4 flex-shrink-0 w-full">
                  {/* Profile Picture on the left */}
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden cursor-pointer group bg-gradient-to-br from-[#FF3B30] to-[#FF6B6B] flex items-center justify-center"
                      onClick={() => profileInputRef.current?.click()}>
                      {profilePicture ? (
                          <img 
                              src={profilePicture} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                          />
                      ) : (
                          <div className="text-white font-bold text-lg sm:text-2xl">
                              {user?.fullName?.[0] || user?.username?.[0] || 'U'}
                          </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="w-6 h-6 text-white" />
                      </div>
                  </div>
                  <input
                      ref={profileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                  />
                  
                  {/* User Name and Rank Info centered */}
                  <div className="flex-1 text-center">
                    <div>
                      <h3 className="font-bold text-lg sm:text-xl text-[#1A1A1A] truncate">
                        {user?.fullName || user?.username || "User"}
                      </h3>
                      <p className="text-gray-500 text-xs sm:text-sm truncate">{currentRank.name} • {currentRank.tier}</p>
                    </div>
                  </div>
                  
                  {/* Rank Patch on the right */}
                  <div className="relative">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 ${getTierColor(currentRank.tier)} rounded-full flex items-center justify-center shadow-lg`}>
                      <span className="text-white text-lg sm:text-2xl font-bold">
                        {currentRank.patch}
                      </span>
                    </div>
                    {/* Tier indicator */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${getTierColor(currentRank.tier)} rounded-full`}></div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col w-full lg:w-auto gap-4">
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-500 text-sm mb-2">Total Miles</p>
                      <p className="text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
                        {totalMileage.toLocaleString()}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">miles traveled</p>
                    </div>
                  </div>

                  {/* Progress Bar with Rank Dots */}
                  <div className="w-full px-4">
                    <div className="relative bg-gray-200 rounded-full h-3 overflow-hidden">
                      {/* Progress fill */}
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-600 via-yellow-500 to-red-500 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min((totalMileage / 100000) * 100, 100)}%` 
                        }}
                      />

                      {/* Rank dots */}
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between px-1">
                        {bikerRanks.map((rank, index) => {
                          const position = (rank.minMiles / 100000) * 100;
                          const isAchieved = totalMileage >= rank.minMiles;
                          const isCurrent = currentRank.id === rank.id;

                          return (
                            <div
                              key={rank.id}
                              className={`relative w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                                isCurrent
                                  ? 'bg-[#FF3B30] border-white shadow-lg scale-125'
                                  : isAchieved
                                  ? 'bg-white border-gray-300'
                                  : 'bg-gray-300 border-gray-400'
                              }`}
                              style={{ 
                                position: 'absolute',
                                left: `${Math.min(position, 95)}%`,
                                transform: 'translateX(-50%)'
                              }}
                              title={`${rank.name} - ${rank.minMiles.toLocaleString()} miles`}
                            >
                              {isCurrent && (
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#1A1A1A] text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                                  {rank.name}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Progress info */}
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <span>Rookie Rider</span>
                      <span className="text-[#FF3B30] font-medium">
                        {nextRank ? `${milesToNext.toLocaleString()} miles to ${nextRank.name}` : "Max Rank Achieved!"}
                      </span>
                      <span>Apex Nomad</span>
                    </div>
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
              className="fixed bottom-6 right-6 z-50 group"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="relative">
                <Button 
                  onClick={handleAddMotorcycle} 
                  className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white rounded-full w-14 h-14 sm:w-16 sm:h-16 shadow-lg hover:shadow-xl transition-all duration-300 p-0"
                >
                  <Plus className="h-6 w-6 sm:h-8 sm:w-8" />
                </Button>
                {/* Slide-out text */}
                <motion.div
                  className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-[#1A1A1A] text-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none"
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ 
                    x: 0, 
                    opacity: 0,
                    transition: { duration: 0.3 }
                  }}
                  whileHover={{ 
                    opacity: 1,
                    transition: { duration: 0.2 }
                  }}
                >
                  <span className="text-sm font-medium">Add New Bike</span>
                  {/* Arrow */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-[#1A1A1A] border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                </motion.div>
              </div>
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
                <Card 
                  className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden cursor-pointer"
                  onClick={() => handleToggleExpand(motorcycle.id)}
                >
                  <CardContent className="p-4 sm:p-6 flex flex-col">
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
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 rounded-xl flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleExpand(motorcycle.id);
                            }}
                          >
                            <span className="mr-2">👁️</span>
                            {expandedMotorcycleId === motorcycle.id ? 'Collapse' : 'Expand'} Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditMotorcycle(motorcycle);
                            }}
                          >
                            <Wrench className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              setMotorcycleToDelete(motorcycle.id);
                            }}
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
                              await apiRequest("PUT", `/api/motorcycles/${motorcycle.id}`, { 
                                ...motorcycle, 
                                mileage: Number(newMileage) 
                              });
                              // Invalidate queries to refresh data without page reload
                              queryClient.invalidateQueries({ queryKey: ['/api/motorcycles'] });
                              toast({
                                title: "Mileage Updated",
                                description: `Updated mileage to ${Number(newMileage).toLocaleString()} miles`,
                              });
                            } catch (error) {
                              toast({
                                title: "Error",
                                description: "Failed to update mileage. Please try again.",
                                variant: "destructive",
                              });
                            }
                          }
                        }}
                      >
                        <Gauge className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Update Miles
                      </Button>
                    </div>

                    {/* Expanded Details Section */}
                    {expandedMotorcycleId === motorcycle.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 pt-6 border-t border-gray-100 space-y-4"
                      >
                        {/* Vehicle Documents */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-[#1A1A1A] flex items-center text-sm">
                              <FileText className="h-4 w-4 mr-2 text-[#FF3B30]" />
                              Documents
                            </h4>
                            <Button size="sm" variant="outline" className="text-xs h-7 rounded-xl">
                              <Settings className="h-3 w-3 mr-1" />
                              Manage
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-2">
                            {[
                              { id: 1, name: "Registration", icon: "📋", status: "valid" },
                              { id: 2, name: "Insurance", icon: "🛡️", status: "expiring" },
                              { id: 3, name: "Service Record", icon: "🔧", status: "valid" }
                            ].map((doc) => (
                              <div 
                                key={doc.id}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded-xl border"
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm">{doc.icon}</span>
                                  <div>
                                    <p className="font-medium text-xs text-[#1A1A1A]">{doc.name}</p>
                                    <p className="text-xs text-gray-500">Updated recently</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge className={`text-xs ${
                                    doc.status === "valid" ? "bg-green-100 text-green-800" :
                                    doc.status === "expiring" ? "bg-yellow-100 text-yellow-800" :
                                    "bg-red-100 text-red-800"
                                  }`}>
                                    {doc.status}
                                  </Badge>
                                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Maintenance Overview */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-[#1A1A1A] flex items-center text-sm">
                              <Wrench className="h-4 w-4 mr-2 text-[#FF3B30]" />
                              Maintenance
                            </h4>
                            <Button size="sm" variant="outline" className="text-xs h-7 rounded-xl">
                              <Calendar className="h-3 w-3 mr-1" />
                              Schedule
                            </Button>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-xs text-green-800">Next Service Due</p>
                                  <p className="text-xs text-green-600">Oil change at {(motorcycle.mileage || 0) + 3000} miles</p>
                                </div>
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  {3000 - ((motorcycle.mileage || 0) % 3000)} miles
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div className="text-center p-3 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-500 mb-1">Service Records</p>
                                <p className="font-bold text-lg text-[#1A1A1A]">0</p>
                              </div>
                              <div className="text-center p-3 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-500 mb-1">Upcoming</p>
                                <p className="font-bold text-lg text-[#1A1A1A]">1</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Recent Activity */}
                        <div>
                          <h4 className="font-semibold text-[#1A1A1A] mb-3 flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-[#FF3B30]" />
                            Recent Activity
                          </h4>
                          
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-xl">
                              <div className="w-2 h-2 bg-[#FF3B30] rounded-full"></div>
                              <div>
                                <p className="text-xs font-medium text-[#1A1A1A]">Added to garage</p>
                                <p className="text-xs text-gray-500">{new Date(motorcycle.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            
                            <div className="text-center py-3">
                              <p className="text-xs text-gray-500 mb-2">No recent rides recorded</p>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs h-7 rounded-xl"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast({
                                    title: "Coming Soon",
                                    description: "Ride logging feature will be available soon!",
                                  });
                                }}
                              >
                                Log First Ride
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Floating Add Bike Button */}
        <motion.div
          className="fixed bottom-6 right-6 z-50 group"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="relative">
            <Button 
              onClick={handleAddMotorcycle} 
              className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white rounded-full w-14 h-14 sm:w-16 sm:h-16 shadow-lg hover:shadow-xl transition-all duration-300 p-0"
            >
              <Plus className="h-6 w-6 sm:h-8 sm:w-8" />
            </Button>
            {/* Slide-out text */}
            <motion.div
              className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-[#1A1A1A] text-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none"
              initial={{ x: 10, opacity: 0 }}
              animate={{ 
                x: 0, 
                opacity: 0,
                transition: { duration: 0.3 }
              }}
              whileHover={{ 
                opacity: 1,
                transition: { duration: 0.2 }
              }}
            >
              <span className="text-sm font-medium">Add New Bike</span>
              {/* Arrow */}
              <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-[#1A1A1A] border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </motion.div>
          </div>
        </motion.div>

        <AddMotorcycleDialog 
          open={isAddDialogOpen} 
          onOpenChange={setIsAddDialogOpen}
          onSuccess={() => {
            setIsAddDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ['/api/motorcycles'] });
          }}
        />

        <DocumentUploadDialog />



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
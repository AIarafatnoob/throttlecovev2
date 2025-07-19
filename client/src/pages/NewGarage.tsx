import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Motorcycle } from "@shared/schema";
import AddMotorcycleDialog from "@/components/ui/motorcycle/AddMotorcycleDialog";
import ExpandableMotorcycleCard from "@/components/ui/motorcycle/ExpandableMotorcycleCard";
import DocumentVault from "@/components/ui/DocumentVault";
import { DocumentPreview } from "@/components/ui/DocumentPreview";


import { Plus, MoreVertical, Wrench, MapPin, Calendar, Gauge, TrendingUp, Camera, User, FileText, Settings, Eye, ChevronDown, ChevronUp, Upload, Bike } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { getUserRank, getNextRank, getKmToNextRank, getTierColor, bikerRanks, getProgressRanks } from "@/utils/ranking";
import PartsCarousel from "@/components/ui/PartsCarousel";
import { useAuth } from "@/hooks/useAuth";
import { RankDetailsModal } from "@/components/ui/RankDetailsModal";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  const [expandedMotorcycleId, setExpandedMotorcycleId] = useState<number | null>(null);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [profilePicture, setProfilePicture] = useState<string | null>(user?.avatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  // SOS functionality state
  const [sosActive, setSosActive] = useState(false);
  const [sosProgress, setSosProgress] = useState(0);
  const sosTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sosIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sosStartPosition = useRef<{ x: number; y: number } | null>(null);
  const sosMovementThreshold = 10; // pixels - if user moves more than this, cancel SOS

  // Dynamic button color state
  const [isOverFooter, setIsOverFooter] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  // Vault functionality states
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [vaultTextOpacity, setVaultTextOpacity] = useState(0);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string | null>(null);
  const [isDocumentPreviewOpen, setIsDocumentPreviewOpen] = useState(false);



  const { data: motorcycles, isLoading, error } = useQuery<Motorcycle[]>({
    queryKey: ['/api/motorcycles'],
  });

  // Cleanup SOS timers on unmount
  useEffect(() => {
    return () => {
      if (sosTimeoutRef.current) {
        clearTimeout(sosTimeoutRef.current);
      }
      if (sosIntervalRef.current) {
        clearInterval(sosIntervalRef.current);
      }
    };
  }, []);

  // Add global event listeners for vault functionality
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const containerWidth = 200; // Maximum slide distance
      const deltaX = Math.min(0, Math.max(-containerWidth, e.clientX - window.innerWidth + 100));
      setButtonPosition(deltaX);

      // Calculate vault text opacity based on position
      const opacity = Math.abs(deltaX) / containerWidth;
      setVaultTextOpacity(Math.min(opacity, 1));
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;

      const touch = e.touches[0];
      const containerWidth = 200; // Maximum slide distance
      const deltaX = Math.min(0, Math.max(-containerWidth, touch.clientX - window.innerWidth + 100));
      setButtonPosition(deltaX);

      // Calculate vault text opacity based on position
      const opacity = Math.abs(deltaX) / containerWidth;
      setVaultTextOpacity(Math.min(opacity, 1));
    };

    const handleGlobalEnd = () => {
      if (!isDragging) return;

      setIsDragging(false);

      // If slid more than 80px, open vault
      if (Math.abs(buttonPosition) > 80) {
        setIsVaultOpen(true);
      }

      // Reset position
      setButtonPosition(0);
      setVaultTextOpacity(0);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('touchmove', handleGlobalTouchMove);
      document.addEventListener('mouseup', handleGlobalEnd);
      document.addEventListener('touchend', handleGlobalEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('mouseup', handleGlobalEnd);
      document.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [isDragging, buttonPosition]);

  // Dynamic button color detection
  useEffect(() => {
    const checkButtonPosition = () => {
      // Look for existing footer (likely with black background)
      const footerElement = document.querySelector('footer') || 
                          document.querySelector('[class*="footer"]') ||
                          document.querySelector('[style*="background-color: rgb(0, 0, 0)"]') ||
                          document.querySelector('[class*="bg-black"]');

      if (!footerElement) {
        // If no footer found, check if we're near bottom of page
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

        // Consider we're over "footer area" if within 200px of bottom
        setIsOverFooter(distanceFromBottom < 200);
        return;
      }

      const footerRect = footerElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const buttonBottomPosition = windowHeight - 80; // Button is 80px from bottom

      // Check if button would be over footer area
      const isButtonOverFooter = buttonBottomPosition > footerRect.top && footerRect.top < windowHeight;
      setIsOverFooter(isButtonOverFooter);
    };

    // Check on mount and scroll
    checkButtonPosition();
    window.addEventListener('scroll', checkButtonPosition);
    window.addEventListener('resize', checkButtonPosition);

    return () => {
      window.removeEventListener('scroll', checkButtonPosition);
      window.removeEventListener('resize', checkButtonPosition);
    };
  }, [motorcycles]);

  // Calculate total kilometers for ranking (convert from miles to km)
  const totalKilometers = motorcycles?.reduce((sum: number, bike: Motorcycle) => sum + (bike.mileage ? Math.round(bike.mileage * 1.60934) : 0), 0) || 0;
  const currentRank = getUserRank(totalKilometers);
  const nextRank = getNextRank(totalKilometers);
  const kmToNext = getKmToNextRank(totalKilometers);
  const progressRanks = getProgressRanks(totalKilometers);

  const handleAddMotorcycle = () => {
    setIsAddDialogOpen(true);
  };

  // Vault functionality handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleVaultClose = () => {
    setIsVaultOpen(false);
  };

  // Document button handlers
  const handleDocumentButtonClick = (docType: string) => {
    const docOfType = documents.find(doc => doc.type === docType);
    if (docOfType) {
      // Open document preview
      setSelectedDocumentType(docType);
      setIsDocumentPreviewOpen(true);
    } else {
      // Open vault with filter for this document type
      setSelectedDocumentType(docType);
      setIsVaultOpen(true);
    }
  };

  const handleDocumentPreviewClose = () => {
    setIsDocumentPreviewOpen(false);
    setSelectedDocumentType(null);
  };

  // Get document by type
  const getDocumentByType = (type: string) => {
    return documents.find(doc => doc.type === type);
  };

  // Check if document type has uploaded documents
  const hasDocumentOfType = (type: string) => {
    return documents.some(doc => doc.type === type);
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

  // SOS functionality handlers
  const startSOS = (clientX: number, clientY: number) => {
    if (sosActive) return;

    // Record starting position
    sosStartPosition.current = { x: clientX, y: clientY };

    // Add 800ms delay to prevent accidental triggers during normal interactions
    sosTimeoutRef.current = setTimeout(() => {
      // Only start if we haven't moved too much
      if (sosStartPosition.current) {
        setSosActive(true);
        setSosProgress(0);

        // Haptic feedback - vibrate if available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }

        // Start progress animation
        sosIntervalRef.current = setInterval(() => {
          setSosProgress(prev => {
            const next = prev + 2; // 2% every 100ms = 5 seconds total
            if (next >= 100) {
              // Only trigger SOS when progress reaches 100%
              clearInterval(sosIntervalRef.current!);
              triggerSOS();
              return 100;
            }
            return next;
          });
        }, 100);
      }
    }, 800);
  };

  const checkSOSMovement = (clientX: number, clientY: number) => {
    if (!sosStartPosition.current) return;

    const deltaX = Math.abs(clientX - sosStartPosition.current.x);
    const deltaY = Math.abs(clientY - sosStartPosition.current.y);

    // If user moved too much, cancel SOS
    if (deltaX > sosMovementThreshold || deltaY > sosMovementThreshold) {
      cancelSOS();
    }
  };

  const cancelSOS = () => {
    setSosActive(false);
    setSosProgress(0);
    sosStartPosition.current = null;

    if (sosTimeoutRef.current) {
      clearTimeout(sosTimeoutRef.current);
      sosTimeoutRef.current = null;
    }

    if (sosIntervalRef.current) {
      clearInterval(sosIntervalRef.current);
      sosIntervalRef.current = null;
    }
  };

  const triggerSOS = () => {
    // Stronger haptic feedback for SOS activation
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }

    // Show SOS activated notification
    toast({
      title: "🚨 SOS Activated",
      description: "Emergency alert has been triggered. Help is on the way!",
      variant: "destructive",
    });

    // Reset state
    cancelSOS();

    // Here you would typically send the SOS signal to emergency services
    console.log("SOS ACTIVATED - Emergency services notified");
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
            <CardContent 
              className="p-4 sm:p-6 lg:p-8 relative"
              onMouseDown={(e) => {
                e.preventDefault();
                startSOS(e.clientX, e.clientY);
              }}
              onMouseMove={(e) => {
                if (sosStartPosition.current) {
                  checkSOSMovement(e.clientX, e.clientY);
                }
              }}
              onMouseUp={cancelSOS}
              onMouseLeave={cancelSOS}
              onTouchStart={(e) => {
                e.preventDefault();
                const touch = e.touches[0];
                startSOS(touch.clientX, touch.clientY);
              }}
              onTouchMove={(e) => {
                if (sosStartPosition.current && e.touches[0]) {
                  const touch = e.touches[0];
                  checkSOSMovement(touch.clientX, touch.clientY);
                }
              }}
              onTouchEnd={cancelSOS}
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                msUserSelect: 'none',
              }}
            >
              {/* SOS Gradient Overlay - Center to Border */}
              {sosActive && (
                <div 
                  className="absolute inset-0 pointer-events-none rounded-3xl transition-all duration-200"
                  style={{
                    background: `radial-gradient(ellipse at center, 
                      rgba(255, 255, 255, 0) ${50 - (sosProgress / 100 * 45)}%, 
                      rgba(255, 59, 48, ${sosProgress / 100 * 0.3}) ${55 - (sosProgress / 100 * 45)}%,
                      rgba(255, 59, 48, ${sosProgress / 100 * 0.6}) ${70 - (sosProgress / 100 * 35)}%,
                      rgba(255, 59, 48, ${sosProgress / 100 * 0.8}) ${85 - (sosProgress / 100 * 25)}%,
                      rgba(255, 59, 48, ${sosProgress / 100 * 0.9}) 100%)`,
                    border: `2px solid rgba(255, 59, 48, ${sosProgress / 100 * 0.8})`,
                  }}
                />
              )}
              {/* SNS-Style Profile Layout */}
              <div className="flex flex-col space-y-6">
                {/* Header Row - Profile Picture + Action Buttons */}
                <div className="flex items-center justify-between">
                  {/* Left side - empty for balance */}
                  <div className="w-16"></div>

                  {/* Center - Large Profile Picture */}
                  <div className="relative">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden cursor-pointer group bg-gradient-to-br from-[#FF3B30] to-[#FF6B6B] flex items-center justify-center shadow-lg ring-4 ring-white"
                        onClick={() => profileInputRef.current?.click()}>
                        {profilePicture ? (
                            <img 
                                src={profilePicture} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-white font-bold text-2xl sm:text-3xl">
                                {user?.fullName?.[0] || user?.username?.[0] || 'U'}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
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
                  </div>

                  {/* Right side - Rank Badge */}
                  <RankDetailsModal totalKilometers={totalKilometers}>
                    <div className="relative cursor-pointer transition-transform hover:scale-105">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 ${getTierColor(currentRank.tier)} rounded-full flex items-center justify-center shadow-lg ring-2 ring-white`}>
                        <span className="text-white text-xl sm:text-2xl font-bold">
                          {currentRank.patch}
                        </span>
                      </div>
                      {/* Tier indicator */}
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
                        <div className={`w-2 h-2 ${getTierColor(currentRank.tier)} rounded-full`}></div>
                      </div>
                    </div>
                  </RankDetailsModal>
                </div>

                {/* User Info - Centered */}
                <div className="text-center space-y-4">
                  <div className="space-y-2">
                    <h1 className="font-bold text-2xl sm:text-3xl text-[#1A1A1A]">
                      {user?.fullName || user?.username || "User"}
                    </h1>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-gray-600 text-sm font-medium">{currentRank.name}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 text-sm">{currentRank.tier}</span>
                    </div>
                  </div>

                  {/* Document Quick Access Buttons */}
                  <div className="flex items-center justify-center gap-3 px-4">
                    {(() => {
                      const buttons = [
                        { key: 'insurance', icon: '🛡️', title: 'Insurance' },
                        { key: 'license', icon: '📋', title: 'License', isCenter: true },
                        { key: 'registration', icon: '📋', title: 'Registration' }
                      ];

                      return buttons.map((button) => {
                        const isCenter = button.isCenter;
                        const document = getDocumentByType(button.key);

                        // Determine border color based on document expiry
                        const getBorderColor = () => {
                          if (!document) return '';
                          if (!document.expiryDate) return 'border-green-500';

                          const daysUntilExpiry = Math.ceil((document.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                          if (daysUntilExpiry <= 0) return 'border-red-500'; // Expired
                          if (daysUntilExpiry <= 30) return 'border-yellow-500'; // Expiring soon
                          return 'border-green-500'; // All good
                        };

                        return (
                          <button 
                            key={button.key}
                            onClick={() => handleDocumentButtonClick(button.key)}
                            className={`relative ${
                              isCenter 
                                ? 'px-6 py-3 bg-[#1A1A1A] hover:bg-[#1A1A1A]/90' 
                                : 'w-12 h-12 bg-[#1A1A1A] hover:bg-[#1A1A1A]/90'
                            } rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 ${
                              document ? `border-2 ${getBorderColor()}` : ''
                            }`}
                            style={{
                              borderWidth: document ? '1px' : '0',
                              borderStyle: document ? 'solid' : 'none',
                              borderColor: document ? (
                                !document.expiryDate ? 'rgb(34 197 94)' : // green-500
                                Math.ceil((document.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 0 ? 'rgb(239 68 68)' : // red-500
                                Math.ceil((document.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 30 ? 'rgb(234 179 8)' : // yellow-500
                                'rgb(34 197 94)' // green-500
                              ) : 'transparent'
                            }}
                          >
                            {isCenter ? (
                              <>
                                <span className="text-white text-sm font-medium mr-2">{button.icon}</span>
                                <span className="text-white text-sm font-medium">{button.title}</span>
                              </>
                            ) : (
                              <span className="text-white text-lg">{button.icon}</span>
                            )}
                          </button>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Primary Stat and Document Access */}
                <div className="space-y-4">
                  {/* Total KM - Primary Stat */}
                  <div className="text-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
                    <p className="text-gray-500 text-sm mb-2 font-medium">Total Distance</p>
                    <div className="flex items-baseline justify-center gap-2 mb-1">
                      <p className="text-4xl sm:text-5xl font-bold text-[#1A1A1A]">
                        {totalKilometers.toLocaleString()}
                      </p>
                      <span className="text-lg sm:text-xl font-medium text-gray-400">KM</span>
                    </div>
                  </div>


                </div>

                {/* Progress Bar with Enhanced Design */}
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 mb-2">Ranking Progress</p>
                    {nextRank ? (
                      <p className="text-xs text-gray-500">
                        <span className="font-medium text-[#FF3B30]">{kmToNext.toLocaleString()} km</span> to reach <span className="font-medium">{nextRank.name}</span>
                      </p>
                    ) : (
                      <p className="text-xs text-green-600 font-medium">🏆 Maximum Rank Achieved!</p>
                    )}
                  </div>

                  <div className="relative bg-gray-200 rounded-full h-3 overflow-hidden">
                    {/* Progress fill */}
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full transition-all duration-700 ease-out"
                      style={{ 
                        width: `${Math.min((totalKilometers / 300000) * 100, 100)}%` 
                      }}
                    />

                    {/* Progress rank indicators */}
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between px-2">
                      {progressRanks.map((rank, index) => {
                        const isAchieved = totalKilometers >= rank.minKm;
                        const isCurrent = currentRank.id === rank.id;

                        return (
                          <div
                            key={rank.id}
                            className={`relative w-3 h-3 rounded-full border transition-all duration-300 ${
                              isCurrent
                                ? 'bg-[#FF3B30] border-white shadow-md scale-150 z-10'
                                : isAchieved
                                ? 'bg-white border-gray-300 shadow-sm'
                                : 'bg-gray-300 border-gray-400'
                            }`}
                            style={{ 
                              position: 'absolute',
                              left: `${33.33 * index}%`,
                              transform: 'translateX(-50%)'
                            }}
                            title={`${rank.name} - ${rank.minKm.toLocaleString()} km`}
                          >
                            {isCurrent && (
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#1A1A1A] text-white px-2 py-1 rounded text-xs whitespace-nowrap z-20">
                                {rank.name}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Progress labels */}
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="font-medium">{progressRanks[0]?.name || "Rookie"}</span>
                    <span className="font-medium">{progressRanks[2]?.name || "Apex Nomad"}</span>
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

            {/* Floating Add Bike Button with Vault Functionality */}
            <motion.div
              ref={buttonRef}
              className="fixed bottom-6 right-6 z-50 group"
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1,
                x: buttonPosition,
                transition: { duration: 0.3 }
              }}
              whileHover={{ scale: isDragging ? 1 : 1.1 }}
              whileTap={{ scale: isDragging ? 1 : 0.9 }}
            >
              <div className="relative">
                <Button 
                  onClick={isDragging ? undefined : handleAddMotorcycle}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                  className={`${isOverFooter ? 'bg-[#FF3B30] hover:bg-[#FF3B30]/90' : 'bg-[#1A1A1A] hover:bg-[#1A1A1A]/90'} text-white rounded-full w-14 h-14 sm:w-16 sm:h-16 shadow-lg hover:shadow-xl transition-all duration-300 p-0 cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
                  style={{ touchAction: 'none' }}
                >
                  <Plus className="h-6 w-6 sm:h-8 sm:w-8" />
                </Button>
              </div>
            </motion.div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 pb-20">
            {motorcycles.map((motorcycle) => (
              <motion.div
                key={motorcycle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden relative"
                >
                  <CardContent className="p-4 sm:p-6 flex flex-col">
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-6">
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

                      <div className="absolute top-4 right-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 rounded-xl flex-shrink-0 bg-white/80 hover:bg-white shadow-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
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
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 flex-1">
                      <div className="text-center bg-gray-50 rounded-2xl p-3 sm:p-4">
                        <p className="text-gray-500 text-xs mb-1">Total KM</p>
                        <p className="text-lg sm:text-xl font-bold text-[#1A1A1A]">
                          {motorcycle.mileage ? Math.round(motorcycle.mileage * 1.60934).toLocaleString() : "0"}
                        </p>
                        <p className="text-gray-400 text-xs">KM</p>
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
                          const currentKm = motorcycle.mileage ? Math.round(motorcycle.mileage * 1.60934) : 0;
                          const newKilometers = prompt(`Current kilometers: ${currentKm}. Enter new kilometers:`);
                          if (newKilometers && !isNaN(Number(newKilometers))) {
                            try {
                              // Convert KM back to miles for storage
                              const milesValue = Math.round(Number(newKilometers) / 1.60934);
                              await apiRequest("PUT", `/api/motorcycles/${motorcycle.id}`, { 
                                ...motorcycle, 
                                mileage: milesValue 
                              });
                              // Invalidate queries to refresh data without page reload
                              queryClient.invalidateQueries({ queryKey: ['/api/motorcycles'] });
                              toast({
                                title: "Kilometers Updated",
                                description: `Updated kilometers to ${Number(newKilometers).toLocaleString()} km`,
                              });
                            } catch (error) {
                              toast({
                                title: "Error",
                                description: "Failed to update kilometers. Please try again.",
                                variant: "destructive",
                              });
                            }
                          }
                        }}
                      >
                        <Gauge className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Update KM
                      </Button>
                    </div>

                    {/* Centered Arrow Button - 50% hanging outside card */}
                    <div className="relative">
                      <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-5 z-10">
                        <Button
                          variant="default"
                          size="sm"
                          className="h-10 w-10 p-0 rounded-full bg-white hover:bg-gray-50 border-2 border-gray-200 shadow-md transition-all duration-200 hover:shadow-lg"
                          onClick={() => handleToggleExpand(motorcycle.id)}
                        >
                          {expandedMotorcycleId === motorcycle.id ? (
                            <ChevronUp className="h-5 w-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-600" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Details Section */}
                    {expandedMotorcycleId === motorcycle.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 pt-6 border-t border-gray-100 space-y-6"
                      >
                        {/* Vehicle Details Section */}
                        <div>
                          <h4 className="font-semibold text-[#1A1A1A] flex items-center text-sm mb-3">
                            <Bike className="h-4 w-4 mr-2 text-[#FF3B30]" />
                            Vehicle Details
                          </h4>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded-xl p-3">
                              <p className="text-xs text-gray-500 mb-1">Year</p>
                              <p className="font-medium text-sm text-[#1A1A1A]">{motorcycle.year || "N/A"}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                              <p className="text-xs text-gray-500 mb-1">Engine Size</p>
                              <p className="font-medium text-sm text-[#1A1A1A]">{motorcycle.engineSize || "N/A"}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                              <p className="text-xs text-gray-500 mb-1">Status</p>
                              <Badge className={`text-xs ${
                                motorcycle.status === 'active' ? 'bg-green-100 text-green-800' :
                                motorcycle.status === 'in service' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {motorcycle.status}
                              </Badge>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                              <p className="text-xs text-gray-500 mb-1">VIN</p>
                              <p className="font-medium text-xs text-[#1A1A1A] truncate">{motorcycle.vin || "Not set"}</p>
                            </div>
                          </div>

                          {motorcycle.purchasePrice && (
                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs text-blue-600 mb-1">Purchase Price</p>
                                  <p className="font-bold text-sm text-blue-800">${(motorcycle.purchasePrice / 100).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-blue-600 mb-1">Est. Current Value</p>
                                  <p className="font-medium text-sm text-blue-700">${Math.round(motorcycle.purchasePrice / 100 * 0.85).toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Essential Products Section */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-[#1A1A1A] flex items-center text-sm">
                              <TrendingUp className="h-4 w-4 mr-2 text-[#FF3B30]" />
                              Essential Products
                            </h4>
                            <Button size="sm" variant="outline" className={`text-xs h-7 rounded-xl transition-all duration-300 ${isOverFooter ? 'border-[#FF3B30] text-[#FF3B30] hover:bg-[#FF3B30] hover:text-white' : 'border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'}`}>
                              <Eye className="h-3 w-3 mr-1" />
                              View All
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 gap-2">
                            {[
                              { 
                                id: 1, 
                                name: "Engine Oil", 
                                icon: "🛢️", 
                                category: "Engine",
                                price: "$25.99",
                                stock: "In Stock",
                                compatibility: `${motorcycle.make} ${motorcycle.model}`,
                                lastChanged: "2 months ago"
                              },
                              { 
                                id: 2, 
                                name: "Chain Lube", 
                                icon: "🔗", 
                                category: "Drive Train",
                                price: "$12.49",
                                stock: "Low Stock",
                                compatibility: "Universal",
                                lastChanged: "3 weeks ago"
                              },
                              { 
                                id: 3, 
                                name: "Air Filter", 
                                icon: "🌬️", 
                                category: "Engine",
                                price: "$18.99",
                                stock: "In Stock",
                                compatibility: `${motorcycle.make} ${motorcycle.model}`,
                                lastChanged: "6 months ago"
                              }
                            ].map((product) => (
                              <div 
                                key={product.id}
                                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-[#FF3B30]/30 hover:bg-gray-50 transition-all duration-200"
                              >
                                <div className="flex items-center space-x-3 flex-1">
                                  <div className="w-10 h-10 bg-gradient-to-br from-[#FF3B30]/10 to-[#FF3B30]/5 rounded-xl flex items-center justify-center">
                                    <span className="text-base">{product.icon}</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="font-medium text-sm text-[#1A1A1A]">{product.name}</p>
                                      <Badge className="text-xs bg-gray-100 text-gray-600">
                                        {product.category}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <span>{product.compatibility}</span>
                                      <span>•</span>
                                      <span>Last: {product.lastChanged}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <div className="text-right">
                                    <p className="font-bold text-sm text-[#1A1A1A]">{product.price}</p>
                                    <p className={`text-xs ${
                                      product.stock === "In Stock" ? "text-green-600" :
                                      product.stock === "Low Stock" ? "text-yellow-600" :
                                      "text-red-600"
                                    }`}>
                                      {product.stock}
                                    </p>
                                  </div>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-[#FF3B30]/10">
                                    <Plus className="h-4 w-4 text-[#FF3B30]" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Quick Order Section */}
                          <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm text-green-800 mb-1">Quick Maintenance Kit</p>
                                <p className="text-xs text-green-600">Oil + Filter + Chain Lube</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-sm text-green-800 mb-1">$49.99</p>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs h-7">
                                  Add Kit
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Vehicle Documents */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-[#1A1A1A] flex items-center text-sm">
                              <FileText className="h-4 w-4 mr-2 text-[#FF3B30]" />
                              Documents
                            </h4>
                            <Button size="sm" variant="outline" className={`text-xs h-7 rounded-xl transition-all duration-300 ${isOverFooter ? 'border-[#FF3B30] text-[#FF3B30] hover:bg-[#FF3B30] hover:text-white' : 'border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'}`}>
                              <Settings className="h-3 w-3 mr-1" />
                              Manage
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 gap-2">
                            {[
                              { id: 1, name: "Registration", icon: "📋", status: "valid", expires: "Dec 2025" },
                              { id: 2, name: "Insurance", icon: "🛡️", status: "expiring", expires: "Feb 2025" },
                              { id: 3, name: "Service Record", icon: "🔧", status: "valid", expires: "N/A" }
                            ].map((doc) => (
                              <div 
                                key={doc.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <span className="text-sm">{doc.icon}</span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm text-[#1A1A1A]">{doc.name}</p>
                                    <p className="text-xs text-gray-500">
                                      {doc.expires !== "N/A" ? `Expires: ${doc.expires}` : "Permanent record"}
                                    </p>
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
                                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Maintenance History Preview */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-[#1A1A1A] flex items-center text-sm">
                              <Wrench className="h-4 w-4 mr-2 text-[#FF3B30]" />
                              Recent Maintenance
                            </h4>
                            <Button size="sm" variant="outline" className={`text-xs h-7 rounded-xl transition-all duration-300 ${isOverFooter ? 'border-[#FF3B30] text-[#FF3B30] hover:bg-[#FF3B30] hover:text-white' : 'border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'}`}>
                              <Calendar className="h-3 w-3 mr-1" />
                              Full History
                            </Button>
                          </div>

                          <div className="space-y-2">
                            {[
                              { 
                                date: "Jan 15, 2025", 
                                service: "Oil Change", 
                                cost: "$35.00", 
                                km: Math.round((motorcycle.mileage || 0) * 1.60934) - 500
                              },
                              { 
                                date: "Dec 20, 2024", 
                                service: "Chain Adjustment", 
                                cost: "$15.00", 
                                km: Math.round((motorcycle.mileage || 0) * 1.60934) - 1200
                              }
                            ].map((record, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-[#FF3B30] rounded-full"></div>
                                  <div>
                                    <p className="font-medium text-xs text-[#1A1A1A]">{record.service}</p>
                                    <p className="text-xs text-gray-500">{record.date} • {record.km.toLocaleString()} km</p>
                                  </div>
                                </div>
                                <p className="font-medium text-xs text-[#1A1A1A]">{record.cost}</p>
                              </div>
                            ))}
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

        {/* Floating Add Bike Button with Vault Functionality */}
        <motion.div
          ref={buttonRef}
          className="fixed bottom-6 right-6 z-50 group"
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            x: buttonPosition,
            transition: { duration: 0.3 }
          }}
          whileHover={{ scale: isDragging ? 1 : 1.1 }}
          whileTap={{ scale: isDragging ? 1 : 0.9 }}
        >
          <div className="relative flex items-center">
            {/* Swipe Indicator and Open Vault Text */}
            <div className="flex items-center mr-3 opacity-60 hover:opacity-100 transition-opacity duration-300">
              {/* Swipe Indicator */}
              <div className="mr-2">
                <svg 
                  className="w-5 h-5 text-gray-400 animate-pulse" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
              </div>

              {/* Open Vault Text */}
              <span className="text-gray-600 text-sm font-medium whitespace-nowrap">
                Open Vault
              </span>
            </div>

            <Button 
              onClick={isDragging ? undefined : handleAddMotorcycle}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              className={`${isOverFooter ? 'bg-[#FF3B30] hover:bg-[#FF3B30]/90' : 'bg-[#1A1A1A] hover:bg-[#1A1A1A]/90'} text-white rounded-full w-14 h-14 sm:w-16 sm:h-16 shadow-lg hover:shadow-xl transition-all duration-300 p-0 cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
              style={{ touchAction: 'none' }}
            >
              <Plus className="h-6 w-6 sm:h-8 sm:w-8" />
            </Button>
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

        {/* Document Vault */}
        <DocumentVault 
          isOpen={isVaultOpen} 
          onClose={handleVaultClose} 
          documents={documents}
          onDocumentsChange={setDocuments}
          selectedDocumentType={selectedDocumentType}
        />

        {/* Document Preview */}
        <DocumentPreview 
          isOpen={isDocumentPreviewOpen} 
          onClose={handleDocumentPreviewClose} 
          document={selectedDocumentType ? getDocumentByType(selectedDocumentType) : null}
        />



      </div>
    </div>
  );
};

export default NewGarage;
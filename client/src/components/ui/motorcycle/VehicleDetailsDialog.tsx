import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Motorcycle } from "@shared/schema";
import { 
  X, 
  Calendar, 
  Gauge, 
  Wrench, 
  FileText, 
  Eye,
  Settings,
  MapPin
} from "lucide-react";
import { motion } from "framer-motion";

interface VehicleDetailsDialogProps {
  motorcycle: Motorcycle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VehicleDetailsDialog = ({ motorcycle, open, onOpenChange }: VehicleDetailsDialogProps) => {
  if (!motorcycle) return null;

  // Mock documents for demonstration
  const mockDocuments = [
    { id: 1, name: "Registration Certificate", type: "registration", status: "valid", icon: "📋" },
    { id: 2, name: "Insurance Policy", type: "insurance", status: "expiring", icon: "🛡️" },
    { id: 3, name: "Service Record", type: "service", status: "valid", icon: "🔧" },
  ];

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "in service": return "bg-yellow-100 text-yellow-800";
      case "stored": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case "valid": return "bg-green-100 text-green-800";
      case "expiring": return "bg-yellow-100 text-yellow-800";
      case "expired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[70vw] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-[#1A1A1A]">
              {motorcycle.name}
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vehicle Image & Basic Info */}
          <div className="lg:col-span-1 space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {motorcycle.imageUrl ? (
                    <img 
                      src={motorcycle.imageUrl} 
                      alt={motorcycle.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <div className="w-16 h-16 bg-[#FF3B30] rounded-2xl flex items-center justify-center mx-auto mb-2">
                        <svg viewBox="0 0 100 100" className="w-8 h-8 text-white fill-current">
                          <path d="M15 70 C15 60, 25 50, 35 50 L65 50 C75 50, 85 60, 85 70 C85 80, 75 90, 65 90 L35 90 C25 90, 15 80, 15 70 Z M30 40 L70 40 C75 40, 80 35, 80 30 C80 25, 75 20, 70 20 L30 20 C25 20, 20 25, 20 30 C20 35, 25 40, 30 40 Z M45 30 L55 30 L50 40 Z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">No photo available</p>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-[#1A1A1A]">{motorcycle.name}</h3>
                      <Badge className={getStatusColor(motorcycle.status)}>
                        {motorcycle.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{motorcycle.make} {motorcycle.model}</p>
                    <p className="text-sm text-gray-500">{motorcycle.year} • {motorcycle.engineSize}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3 text-[#1A1A1A]">Statistics</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Gauge className="h-4 w-4 text-[#FF3B30]" />
                    <div>
                      <p className="text-sm text-gray-500">Total Mileage</p>
                      <p className="font-medium">{motorcycle.mileage?.toLocaleString() || 0} miles</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-[#FF3B30]" />
                    <div>
                      <p className="text-sm text-gray-500">Added to Garage</p>
                      <p className="font-medium">{new Date(motorcycle.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Wrench className="h-4 w-4 text-[#FF3B30]" />
                    <div>
                      <p className="text-sm text-gray-500">Last Service</p>
                      <p className="font-medium">No records</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vehicle Documents & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Documents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-[#1A1A1A] flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-[#FF3B30]" />
                      Vehicle Documents
                    </h4>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Settings className="h-3 w-3 mr-1" />
                      Manage
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mockDocuments.map((doc) => (
                      <div 
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{doc.icon}</span>
                          <div>
                            <p className="font-medium text-sm text-[#1A1A1A]">{doc.name}</p>
                            <Badge className={`${getDocumentStatusColor(doc.status)} text-xs`}>
                              {doc.status}
                            </Badge>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                      <strong>Tip:</strong> Keep your vehicle documents up to date and easily accessible for inspections.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Maintenance Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-[#1A1A1A] flex items-center">
                      <Wrench className="h-4 w-4 mr-2 text-[#FF3B30]" />
                      Maintenance Overview
                    </h4>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      Schedule Service
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm text-green-800">Next Service Due</p>
                          <p className="text-xs text-green-600">Oil change recommended at {(motorcycle.mileage || 0) + 3000} miles</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          {3000 - ((motorcycle.mileage || 0) % 3000)} miles
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Service Records</p>
                        <p className="font-bold text-lg text-[#1A1A1A]">0</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Upcoming</p>
                        <p className="font-bold text-lg text-[#1A1A1A]">1</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-[#1A1A1A] mb-4 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-[#FF3B30]" />
                    Recent Activity
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-[#FF3B30] rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A]">Motorcycle added to garage</p>
                        <p className="text-xs text-gray-500">{new Date(motorcycle.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="text-center py-6">
                      <p className="text-sm text-gray-500">No recent rides or services recorded</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Log First Ride
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailsDialog;
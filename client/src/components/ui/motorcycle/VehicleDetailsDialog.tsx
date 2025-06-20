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
      <DialogContent className="sm:max-w-[70vw] max-h-[75vh] overflow-y-auto">
        <DialogHeader className="pb-3">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column: Vehicle Info & Stats */}
          <div className="space-y-4">
            {/* Vehicle Image & Basic Info */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                {motorcycle.imageUrl ? (
                  <img 
                    src={motorcycle.imageUrl} 
                    alt={motorcycle.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-[#FF3B30] rounded-xl flex items-center justify-center mx-auto mb-2">
                      <svg viewBox="0 0 100 100" className="w-6 h-6 text-white fill-current">
                        <path d="M15 70 C15 60, 25 50, 35 50 L65 50 C75 50, 85 60, 85 70 C85 80, 75 90, 65 90 L35 90 C25 90, 15 80, 15 70 Z M30 40 L70 40 C75 40, 80 35, 80 30 C80 25, 75 20, 70 20 L30 20 C25 20, 20 25, 20 30 C20 35, 25 40, 30 40 Z M45 30 L55 30 L50 40 Z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">No photo available</p>
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-lg text-[#1A1A1A]">{motorcycle.name}</h3>
                  <Badge className={getStatusColor(motorcycle.status)}>
                    {motorcycle.status}
                  </Badge>
                </div>
                <p className="text-gray-600">{motorcycle.make} {motorcycle.model}</p>
                <p className="text-sm text-gray-500">{motorcycle.year} • {motorcycle.engineSize}</p>
              </CardContent>
            </Card>

            {/* Compact Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Gauge className="h-4 w-4 text-[#FF3B30] mx-auto mb-1" />
                <p className="text-xs text-gray-500">Mileage</p>
                <p className="font-bold text-sm text-[#1A1A1A]">{motorcycle.mileage?.toLocaleString() || 0}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-4 w-4 text-[#FF3B30] mx-auto mb-1" />
                <p className="text-xs text-gray-500">Added</p>
                <p className="font-bold text-sm text-[#1A1A1A]">{new Date(motorcycle.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Wrench className="h-4 w-4 text-[#FF3B30] mx-auto mb-1" />
                <p className="text-xs text-gray-500">Service</p>
                <p className="font-bold text-sm text-[#1A1A1A]">Due</p>
              </div>
            </div>
          </div>

          {/* Right Column: Documents & Maintenance */}
          <div className="space-y-4">
            {/* Vehicle Documents */}
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-[#1A1A1A] flex items-center text-sm">
                    <FileText className="h-4 w-4 mr-2 text-[#FF3B30]" />
                    Documents
                  </h4>
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    <Settings className="h-3 w-3 mr-1" />
                    Manage
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {mockDocuments.map((doc) => (
                    <div 
                      key={doc.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{doc.icon}</span>
                        <div>
                          <p className="font-medium text-xs text-[#1A1A1A]">{doc.name}</p>
                          <Badge className={`${getDocumentStatusColor(doc.status)} text-xs`}>
                            {doc.status}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Overview */}
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-[#1A1A1A] flex items-center text-sm">
                    <Wrench className="h-4 w-4 mr-2 text-[#FF3B30]" />
                    Maintenance
                  </h4>
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    <Calendar className="h-3 w-3 mr-1" />
                    Schedule
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="p-2 bg-green-50 rounded-lg border border-green-200">
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
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Records</p>
                      <p className="font-bold text-lg text-[#1A1A1A]">0</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Upcoming</p>
                      <p className="font-bold text-lg text-[#1A1A1A]">1</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardContent className="p-3">
                <h4 className="font-semibold text-[#1A1A1A] mb-2 flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-[#FF3B30]" />
                  Activity
                </h4>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-[#FF3B30] rounded-full"></div>
                    <div>
                      <p className="text-xs font-medium text-[#1A1A1A]">Added to garage</p>
                      <p className="text-xs text-gray-500">{new Date(motorcycle.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="text-center py-3">
                    <p className="text-xs text-gray-500 mb-2">No recent rides recorded</p>
                    <Button size="sm" variant="outline" className="text-xs h-7">
                      Log First Ride
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailsDialog;
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

        <div className="space-y-6">
          {/* Profile Header Section */}
          <div className="text-center pb-4">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mx-auto">
                {motorcycle.imageUrl ? (
                  <img 
                    src={motorcycle.imageUrl} 
                    alt={motorcycle.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-[#FF3B30] rounded-2xl flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-6 h-6 text-white fill-current">
                      <path d="M15 70 C15 60, 25 50, 35 50 L65 50 C75 50, 85 60, 85 70 C85 80, 75 90, 65 90 L35 90 C25 90, 15 80, 15 70 Z M30 40 L70 40 C75 40, 80 35, 80 30 C80 25, 75 20, 70 20 L30 20 C25 20, 20 25, 20 30 C20 35, 25 40, 30 40 Z M45 30 L55 30 L50 40 Z" />
                    </svg>
                  </div>
                )}
              </div>
              <Badge className={`${getStatusColor(motorcycle.status)} absolute -bottom-1 left-1/2 transform -translate-x-1/2`}>
                {motorcycle.status}
              </Badge>
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">{motorcycle.name}</h3>
            <p className="text-sm text-gray-500">{motorcycle.make} {motorcycle.model} • {motorcycle.year}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-teal-400 to-teal-500 rounded-2xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm">Total Mileage</p>
                  <p className="text-2xl font-bold">{(motorcycle.mileage || 0).toLocaleString()}</p>
                  <p className="text-teal-100 text-xs">Miles</p>
                </div>
                <Gauge className="h-8 w-8 text-teal-100" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-2xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-100 text-sm">Engine Size</p>
                  <p className="text-2xl font-bold">{motorcycle.engineSize}</p>
                  <p className="text-cyan-100 text-xs">Displacement</p>
                </div>
                <Settings className="h-8 w-8 text-cyan-100" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column: Documents */}
            <div className="space-y-4">

            {/* Vehicle Documents */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-[#1A1A1A] flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-[#FF3B30]" />
                    Documents
                  </h4>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Settings className="h-3 w-3 mr-1" />
                    Manage
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {mockDocuments.map((doc) => (
                    <div 
                      key={doc.id}
                      className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow"
                    >
                      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                        <span className="text-lg">{doc.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm text-[#1A1A1A]">{doc.name}</p>
                            <p className="text-xs text-gray-500">Updated recently</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${getDocumentStatusColor(doc.status)} text-xs`}>
                              {doc.status}
                            </Badge>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            </div>

            {/* Right Column: Maintenance & Activity */}
            <div className="space-y-4">
              {/* Maintenance Overview */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-[#1A1A1A] flex items-center">
                      <Wrench className="h-4 w-4 mr-2 text-[#FF3B30]" />
                      Maintenance
                    </h4>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      Schedule
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm text-green-800">Next Service Due</p>
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
                        <p className="font-bold text-xl text-[#1A1A1A]">0</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 mb-1">Upcoming</p>
                        <p className="font-bold text-xl text-[#1A1A1A]">1</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-[#1A1A1A] mb-4 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-[#FF3B30]" />
                    Recent Activity
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-100">
                      <div className="w-2 h-2 bg-[#FF3B30] rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A]">Motorcycle added to garage</p>
                        <p className="text-xs text-gray-500">{new Date(motorcycle.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 mb-3">No recent rides or services recorded</p>
                      <Button size="sm" variant="outline" className="text-xs">
                        Log First Ride
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailsDialog;
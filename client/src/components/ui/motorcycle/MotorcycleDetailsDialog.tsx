
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  X, 
  Calendar, 
  Gauge, 
  Wrench, 
  FileText, 
  Settings,
  MapPin,
  Star,
  Heart,
  Share2
} from "lucide-react";
import { motion } from "framer-motion";

interface MotorcycleData {
  id: number;
  make: string;
  model: string;
  year: number;
  category: string;
  engineSize: string;
  power: string;
  weight: string;
  price: string;
  imageUrl: string;
  color: string;
}

interface MotorcycleDetailsDialogProps {
  motorcycle: MotorcycleData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MotorcycleDetailsDialog = ({ motorcycle, open, onOpenChange }: MotorcycleDetailsDialogProps) => {
  if (!motorcycle) return null;

  // Mock specifications for demonstration
  const specifications = [
    { label: "Engine Type", value: "Liquid-cooled, 4-stroke" },
    { label: "Fuel System", value: "Electronic Fuel Injection" },
    { label: "Transmission", value: "6-speed manual" },
    { label: "Brakes", value: "Dual disc front, single disc rear" },
    { label: "Suspension", value: "Adjustable front & rear" },
    { label: "Seat Height", value: "32.3 in" },
    { label: "Fuel Capacity", value: "4.5 gallons" },
    { label: "Wheelbase", value: "55.1 in" }
  ];

  const features = [
    "ABS Braking System",
    "Traction Control",
    "Multiple Riding Modes",
    "Quick Shifter",
    "LED Headlights",
    "Digital Display",
    "Keyless Ignition",
    "Smartphone Connectivity"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] lg:max-w-[75vw] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-[#1A1A1A]">
              {motorcycle.year} {motorcycle.make} {motorcycle.model}
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hero Section */}
          <div className="relative">
            <div className="h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              <img 
                src={motorcycle.imageUrl} 
                alt={`${motorcycle.make} ${motorcycle.model}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button size="icon" variant="ghost" className="bg-white/90 backdrop-blur-sm rounded-full">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="bg-white/90 backdrop-blur-sm rounded-full">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <Badge className="bg-[#FF3B30] text-white mb-2">
                        {motorcycle.category}
                      </Badge>
                      <h3 className="text-xl font-bold text-[#1A1A1A]">{motorcycle.color}</h3>
                      <p className="text-gray-600">{motorcycle.engineSize} • {motorcycle.power}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#FF3B30]">{motorcycle.price}</p>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">4.8 (124 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Specifications */}
            <div className="space-y-6">
              {/* Key Stats */}
              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <h4 className="font-bold text-lg text-[#1A1A1A] mb-4 flex items-center">
                    <Gauge className="h-5 w-5 mr-2 text-[#FF3B30]" />
                    Performance
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl p-4 text-white">
                      <p className="text-blue-100 text-sm mb-1">Engine Power</p>
                      <p className="text-2xl font-bold">{motorcycle.power}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-4 text-white">
                      <p className="text-green-100 text-sm mb-1">Weight</p>
                      <p className="text-2xl font-bold">{motorcycle.weight}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Specifications */}
              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <h4 className="font-bold text-lg text-[#1A1A1A] mb-4 flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-[#FF3B30]" />
                    Specifications
                  </h4>
                  <div className="space-y-3">
                    {specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span className="text-gray-600 font-medium">{spec.label}</span>
                        <span className="font-semibold text-[#1A1A1A]">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Features & Actions */}
            <div className="space-y-6">
              {/* Features */}
              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <h4 className="font-bold text-lg text-[#1A1A1A] mb-4 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-[#FF3B30]" />
                    Key Features
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                        <div className="w-2 h-2 bg-[#FF3B30] rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Availability & Actions */}
              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <h4 className="font-bold text-lg text-[#1A1A1A] mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-[#FF3B30]" />
                    Availability
                  </h4>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-800">In Stock</p>
                          <p className="text-sm text-green-600">Available at 3 nearby dealers</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          Ready
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white rounded-full">
                        Schedule Test Ride
                      </Button>
                      <Button variant="outline" className="rounded-full border-[#FF3B30] text-[#FF3B30] hover:bg-[#FF3B30] hover:text-white">
                        Get Quote
                      </Button>
                    </div>

                    <div className="text-center pt-3">
                      <Button variant="ghost" className="text-gray-600 hover:text-[#FF3B30]">
                        <FileText className="h-4 w-4 mr-2" />
                        Download Brochure
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

export default MotorcycleDetailsDialog;

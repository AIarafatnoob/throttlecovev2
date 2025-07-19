
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
  Share2,
  Phone,
  MessageCircle,
  CheckCircle,
  Clock,
  Zap,
  Shield,
  Award,
  TrendingUp
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
  const keySpecs = [
    { icon: <Zap className="h-4 w-4" />, label: "Engine", value: motorcycle.engineSize, color: "from-blue-500 to-blue-600" },
    { icon: <TrendingUp className="h-4 w-4" />, label: "Power", value: motorcycle.power, color: "from-red-500 to-red-600" },
    { icon: <Gauge className="h-4 w-4" />, label: "Weight", value: motorcycle.weight, color: "from-green-500 to-green-600" },
    { icon: <Award className="h-4 w-4" />, label: "Category", value: motorcycle.category, color: "from-purple-500 to-purple-600" }
  ];

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
    { name: "ABS Braking System", icon: <Shield className="h-4 w-4" /> },
    { name: "Traction Control", icon: <CheckCircle className="h-4 w-4" /> },
    { name: "Multiple Riding Modes", icon: <Settings className="h-4 w-4" /> },
    { name: "Quick Shifter", icon: <Zap className="h-4 w-4" /> },
    { name: "LED Headlights", icon: <Star className="h-4 w-4" /> },
    { name: "Digital Display", icon: <Settings className="h-4 w-4" /> },
    { name: "Keyless Ignition", icon: <CheckCircle className="h-4 w-4" /> },
    { name: "Smartphone Connectivity", icon: <Phone className="h-4 w-4" /> }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95vw] lg:max-w-[85vw] xl:max-w-[75vw] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-50 to-white border-0 shadow-2xl">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl lg:text-3xl font-bold text-[#1A1A1A] font-['Kanit']">
                {motorcycle.year} {motorcycle.make} {motorcycle.model}
              </DialogTitle>
              <div className="flex items-center space-x-2">
                <Badge className="bg-gradient-to-r from-[#FF3B30] to-red-500 text-white rounded-full px-3 py-1">
                  {motorcycle.category}
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">4.8</span>
                  <span className="mx-1">•</span>
                  <span>124 reviews</span>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Hero Image Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 shadow-inner">
              <img 
                src={motorcycle.imageUrl} 
                alt={`${motorcycle.make} ${motorcycle.model}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              
              {/* Floating Action Buttons */}
              <div className="absolute top-6 right-6 flex space-x-3">
                <Button size="icon" className="bg-white/90 backdrop-blur-md hover:bg-white rounded-full shadow-lg border-0">
                  <Heart className="h-4 w-4 text-gray-700" />
                </Button>
                <Button size="icon" className="bg-white/90 backdrop-blur-md hover:bg-white rounded-full shadow-lg border-0">
                  <Share2 className="h-4 w-4 text-gray-700" />
                </Button>
              </div>

              {/* Price Badge */}
              <div className="absolute bottom-6 right-6">
                <div className="bg-white/95 backdrop-blur-md rounded-full px-6 py-3 shadow-lg">
                  <p className="text-2xl font-bold text-[#FF3B30]">{motorcycle.price}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Key Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-4 flex items-center">
              <Gauge className="h-5 w-5 mr-2 text-[#FF3B30]" />
              Key Performance
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {keySpecs.map((spec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`bg-gradient-to-br ${spec.color} rounded-3xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      {spec.icon}
                    </div>
                  </div>
                  <p className="text-white/80 text-sm mb-1">{spec.label}</p>
                  <p className="text-xl font-bold">{spec.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Specifications */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Detailed Specifications */}
              <Card className="rounded-3xl border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h4 className="font-bold text-xl text-[#1A1A1A] mb-6 flex items-center">
                    <Settings className="h-6 w-6 mr-3 text-[#FF3B30]" />
                    Technical Specifications
                  </h4>
                  <div className="space-y-4">
                    {specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-gray-50/80 rounded-2xl hover:bg-gray-100/80 transition-colors">
                        <span className="text-gray-600 font-medium">{spec.label}</span>
                        <span className="font-bold text-[#1A1A1A] bg-white rounded-full px-3 py-1 text-sm">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="rounded-3xl border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h4 className="font-bold text-xl text-[#1A1A1A] mb-6 flex items-center">
                    <Star className="h-6 w-6 mr-3 text-[#FF3B30]" />
                    Premium Features
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {features.map((feature, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50/80 to-white/80 rounded-2xl hover:from-gray-100/80 hover:to-gray-50/80 transition-all duration-200 hover:scale-[1.02]"
                      >
                        <div className="bg-[#FF3B30]/10 rounded-full p-2 text-[#FF3B30]">
                          {feature.icon}
                        </div>
                        <span className="font-medium text-gray-700">{feature.name}</span>
                        <div className="ml-auto">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column: Actions & Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-6"
            >
              {/* Availability Status */}
              <Card className="rounded-3xl border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-8">
                  <h4 className="font-bold text-xl text-[#1A1A1A] mb-6 flex items-center">
                    <MapPin className="h-6 w-6 mr-3 text-green-600" />
                    Availability
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/80 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-500 rounded-full p-2">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-green-800">In Stock</p>
                          <p className="text-sm text-green-600">3 nearby dealers</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 rounded-full">
                        Ready
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-white/80 rounded-2xl">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-800">Expected delivery</p>
                        <p className="text-sm text-gray-600">2-3 business days</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card className="rounded-3xl border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h4 className="font-bold text-xl text-[#1A1A1A] mb-6">Take Action</h4>
                  
                  <div className="space-y-4">
                    {/* Primary Actions */}
                    <div className="grid grid-cols-1 gap-4">
                      <Button className="bg-gradient-to-r from-[#FF3B30] to-red-500 hover:from-[#FF3B30]/90 hover:to-red-500/90 text-white rounded-2xl h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        Schedule Test Ride
                      </Button>
                      <Button variant="outline" className="rounded-2xl h-14 text-lg font-bold border-2 border-[#FF3B30] text-[#FF3B30] hover:bg-[#FF3B30] hover:text-white transition-all duration-300 hover:scale-105">
                        Get Price Quote
                      </Button>
                    </div>

                    {/* Secondary Actions */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                      <Button variant="ghost" className="rounded-2xl h-12 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                      <Button variant="ghost" className="rounded-2xl h-12 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    </div>

                    {/* Download Brochure */}
                    <div className="pt-4">
                      <Button variant="ghost" className="w-full text-gray-600 hover:text-[#FF3B30] rounded-2xl h-12 hover:bg-[#FF3B30]/5">
                        <FileText className="h-4 w-4 mr-2" />
                        Download Brochure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financing Options */}
              <Card className="rounded-3xl border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-8">
                  <h4 className="font-bold text-xl text-[#1A1A1A] mb-4 flex items-center">
                    <TrendingUp className="h-6 w-6 mr-3 text-blue-600" />
                    Financing
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-white/80 rounded-2xl p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Starting from</span>
                        <span className="text-2xl font-bold text-blue-600">$299/mo</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">60 months • 4.9% APR</p>
                    </div>
                    <Button variant="outline" className="w-full rounded-2xl border-blue-200 text-blue-600 hover:bg-blue-50">
                      Calculate Payment
                    </Button>
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

export default MotorcycleDetailsDialog;


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Calendar, Gauge, ChevronDown, ChevronUp } from "lucide-react";
import { Motorcycle } from "@shared/schema";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExpandableMotorcycleCardProps {
  motorcycle: Motorcycle;
  onEdit: (motorcycle: Motorcycle) => void;
  onDelete: (id: number) => void;
}

const ExpandableMotorcycleCard = ({ motorcycle, onEdit, onDelete }: ExpandableMotorcycleCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "in service":
        return "bg-yellow-100 text-yellow-800";
      case "stored":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
        <div className="h-48 overflow-hidden relative">
          <img 
            src={motorcycle.imageUrl || `https://source.unsplash.com/random/400x300/?motorcycle,${motorcycle.make}`} 
            alt={`${motorcycle.make} ${motorcycle.model}`} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 right-0 p-2">
            <Badge className={getStatusColor(motorcycle.status)}>
              {motorcycle.status}
            </Badge>
          </div>
          <div className="absolute top-0 left-0 p-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => onEdit(motorcycle)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(motorcycle.id)}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold font-header mb-1">
                {motorcycle.name || `${motorcycle.make} ${motorcycle.model}`}
              </h3>
              <p className="text-gray-600">
                {motorcycle.year} {motorcycle.make} {motorcycle.model}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 ml-2"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Gauge className="h-4 w-4 text-gray-400" />
              </div>
              <p className="font-medium">{motorcycle.mileage}</p>
              <p className="text-gray-500 text-xs">Miles</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <p className="font-medium">
                {motorcycle.lastRide 
                  ? new Date(motorcycle.lastRide).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'Never'}
              </p>
              <p className="text-gray-500 text-xs">Last Ride</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {motorcycle.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-gray-100 text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t pt-4 mt-4"
            >
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-500">Engine Size</p>
                  <p className="font-medium">{motorcycle.engineSize}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium capitalize">{motorcycle.status}</p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white rounded-full"
              onClick={async () => {
                // Open mileage update dialog
                const newMileage = prompt(`Current mileage: ${motorcycle.mileage || 0}. Enter new mileage:`);
                if (newMileage && !isNaN(Number(newMileage))) {
                  try {
                    // Update motorcycle mileage via API
                    await fetch(`/api/motorcycles/${motorcycle.id}`, {
                      method: 'PUT',
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

export default ExpandableMotorcycleCard;

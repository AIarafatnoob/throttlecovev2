import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Motorcycle } from "@shared/schema";
import { Info, Wrench, TrafficCone, MoreVertical } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Link } from "wouter";
import ServiceDialog from "@/components/ui/maintenance/ServiceDialog";

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  onUpdate: () => void;
  onDelete: (id: number) => void;
}

const MotorcycleCard = ({ motorcycle, onUpdate, onDelete }: MotorcycleCardProps) => {
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isRideDialogOpen, setIsRideDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleLogService = () => {
    setIsServiceDialogOpen(true);
  };

  const handleLogRide = () => {
    setIsRideDialogOpen(true);
    // For now, just show a toast as we haven't implemented the ride dialog yet
    toast({
      title: "Ride Logging",
      description: "Ride logging feature coming soon!",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500 text-white';
      case 'in service':
      case 'in shop':
        return 'bg-yellow-500 text-white';
      case 'stored':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card className="h-full overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
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
      </div>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold font-header">{motorcycle.name || `${motorcycle.make} ${motorcycle.model}`}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onUpdate}>Edit</DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(motorcycle.id)}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
          <span>{motorcycle.year}</span>
          <span>•</span>
          <span>{motorcycle.engineSize}</span>
          <span>•</span>
          <span>{motorcycle.mileage} miles</span>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {motorcycle.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-gray-100 text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-gray-500 mb-1">Next Service</p>
            <p className="font-medium text-[#FF3B30]">Soon</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Last Ride</p>
            <p className="font-medium">
              {motorcycle.lastRide 
                ? format(new Date(motorcycle.lastRide), 'MMM d')
                : 'Never'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <p className={`font-medium ${motorcycle.status === 'active' ? 'text-green-600' : 
              motorcycle.status === 'in service' ? 'text-yellow-500' : 'text-gray-600'}`}>
              {motorcycle.status === 'active' ? 'Ready' : 
               motorcycle.status === 'in service' ? 'In Shop' : motorcycle.status}
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-200 p-4 flex justify-between">
        <Link href={`/motorcycle/${motorcycle.id}`}>
          <Button variant="ghost" className="text-[#007AFF] hover:text-[#007AFF]/80">
            <Info className="mr-1 h-4 w-4" />
            Details
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          className="text-[#1A1A1A] hover:text-[#1A1A1A]/80"
          onClick={handleLogService}
        >
          <Wrench className="mr-1 h-4 w-4" />
          Log Service
        </Button>
        <Button 
          variant="ghost" 
          className={`text-[#FF3B30] hover:text-[#FF3B30]/80 ${
            motorcycle.status !== 'active' ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleLogRide}
          disabled={motorcycle.status !== 'active'}
        >
          <TrafficCone className="mr-1 h-4 w-4" />
          Log Ride
        </Button>
      </CardFooter>

      <ServiceDialog 
        open={isServiceDialogOpen} 
        onOpenChange={setIsServiceDialogOpen} 
        motorcycleId={motorcycle.id}
        onSuccess={onUpdate}
      />
    </Card>
  );
};

export default MotorcycleCard;

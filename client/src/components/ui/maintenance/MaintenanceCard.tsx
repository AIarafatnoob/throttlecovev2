import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MaintenanceRecord, Motorcycle } from "@shared/schema";
import { format } from "date-fns";
import { Calendar, Check, Wrench } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface MaintenanceCardProps {
  record: MaintenanceRecord;
  motorcycle?: Motorcycle;
  onUpdate: () => void;
}

const MaintenanceCard = ({ record, motorcycle, onUpdate }: MaintenanceCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const getStatusBadge = (completed: boolean, date: Date) => {
    const today = new Date();
    const recordDate = new Date(date);
    
    if (completed) {
      return <Badge className="bg-green-600">Completed</Badge>;
    }
    
    if (recordDate < today) {
      return <Badge className="bg-[#FF3B30]">Overdue</Badge>;
    }
    
    const daysDiff = Math.floor((recordDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff <= 7) {
      return <Badge className="bg-[#FF3B30]">Due Soon</Badge>;
    }
    
    return <Badge className="bg-[#007AFF]">Scheduled</Badge>;
  };

  const handleComplete = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      await apiRequest("PUT", `/api/maintenance/${record.id}`, { completed: true });
      toast({
        title: "Service Completed",
        description: "Maintenance record has been marked as complete.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/motorcycles/${record.motorcycleId}/maintenance`] });
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update maintenance record.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReschedule = () => {
    // For now, just show a toast as we haven't implemented the reschedule dialog yet
    toast({
      title: "Reschedule",
      description: "Rescheduling feature coming soon!",
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{record.serviceType}</CardTitle>
          {getStatusBadge(record.completed, record.date)}
        </div>
        {motorcycle && (
          <p className="text-sm text-gray-500">{motorcycle.make} {motorcycle.model}</p>
        )}
      </CardHeader>
      <CardContent className="pt-2">
        {record.description && (
          <p className="text-sm mb-3">{record.description}</p>
        )}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500 mb-1">Date</p>
            <p>{format(new Date(record.date), 'MMM d, yyyy')}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Mileage</p>
            <p>{record.mileage} miles</p>
          </div>
          {record.cost !== undefined && (
            <div>
              <p className="text-gray-500 mb-1">Cost</p>
              <p>${(record.cost / 100).toFixed(2)}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        {!record.completed ? (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-[#007AFF]"
              onClick={handleReschedule}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Reschedule
            </Button>
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isUpdating}
              onClick={handleComplete}
            >
              <Check className="h-4 w-4 mr-1" />
              Complete
            </Button>
          </>
        ) : (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-[#1A1A1A]"
            disabled
          >
            <Wrench className="h-4 w-4 mr-1" />
            Completed on {format(new Date(record.date), 'MMM d, yyyy')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MaintenanceCard;

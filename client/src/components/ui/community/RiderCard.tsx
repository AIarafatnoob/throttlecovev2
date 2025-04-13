import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@shared/schema";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface RiderCardProps {
  rider: Omit<User, 'password'>;
  isFriend?: boolean;
  isPending?: boolean;
}

const RiderCard = ({ rider, isFriend = false, isPending = false }: RiderCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleConnect = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/friends/request", { friendId: rider.id });
      toast({
        title: "Request Sent",
        description: `Friend request sent to ${rider.fullName}.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/friends'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send friend request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={rider.avatarUrl} alt={rider.fullName} />
            <AvatarFallback>{rider.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{rider.fullName}</h3>
                <p className="text-sm text-gray-500">@{rider.username}</p>
              </div>
              {isFriend && (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Connected</Badge>
              )}
              {isPending && (
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">Pending</Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end space-x-2">
          {isFriend && (
            <Button size="sm" variant="outline" className="text-[#007AFF]">
              <MessageSquare className="h-4 w-4 mr-1" />
              Message
            </Button>
          )}
          
          {!isFriend && !isPending && (
            <Button 
              size="sm" 
              className="bg-[#007AFF] hover:bg-[#007AFF]/90 text-white"
              onClick={handleConnect}
              disabled={isLoading}
            >
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RiderCard;

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@shared/schema";
import { MapPin, Calendar, Check } from "lucide-react";
import { format } from "date-fns";

interface RideCardProps {
  id: number;
  title: string;
  location: string;
  date: string;
  host: Omit<User, 'password'>;
  attendees: Array<Omit<User, 'password'>>;
  joined?: boolean;
  onJoin?: (id: number) => void;
}

const RideCard = ({ 
  id, 
  title, 
  location, 
  date, 
  attendees, 
  joined = false,
  onJoin 
}: RideCardProps) => {
  const handleJoin = () => {
    if (onJoin) {
      onJoin(id);
    }
  };

  const formattedDate = format(new Date(date), 'MMM d');
  const day = format(new Date(date), 'd');
  const month = format(new Date(date), 'MMM').toUpperCase();

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex flex-col items-center justify-center mr-4">
            <span className="text-xl font-bold">{day}</span>
            <span className="text-xs">{month}</span>
          </div>
          
          <div className="flex-grow">
            <h4 className="font-medium">{title}</h4>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {location}
            </p>
            
            <div className="mt-2 flex items-center">
              <div className="flex -space-x-2 mr-2">
                {attendees.slice(0, 3).map((attendee, index) => (
                  <Avatar key={index} className="h-6 w-6 border-2 border-white">
                    <AvatarImage src={attendee.avatarUrl} alt={attendee.fullName} />
                    <AvatarFallback>{attendee.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              {attendees.length > 3 && (
                <span className="text-xs text-gray-500">+{attendees.length - 3} riders</span>
              )}
            </div>
          </div>
          
          <div>
            {joined ? (
              <Button 
                size="sm" 
                variant="outline" 
                className="text-green-600 border-green-600"
                disabled
              >
                <Check className="h-3 w-3 mr-1" />
                Joined
              </Button>
            ) : (
              <Button 
                size="sm" 
                className="bg-[#007AFF] hover:bg-[#007AFF]/90 text-white"
                onClick={handleJoin}
              >
                Join
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RideCard;

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { User, Ride } from "@shared/schema";
import RiderCard from "@/components/ui/community/RiderCard";
import RideCard from "@/components/ui/community/RideCard";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  MapPin, 
  Calendar, 
  Heart, 
  MessageSquare, 
  ExternalLink,
  UserPlus,
  Search,
  Plus
} from "lucide-react";
import { format, addDays } from "date-fns";

// Mock data for community features
const mockRides = [
  {
    id: 1,
    title: "Mountain Twisties",
    location: "Blue Ridge Parkway",
    date: new Date().toISOString(),
    host: {
      id: 1,
      username: "rider1",
      fullName: "Alex Johnson",
      email: "alex@example.com",
      avatarUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      createdAt: new Date()
    },
    attendees: [
      {
        id: 1,
        username: "rider1",
        fullName: "Alex Johnson",
        email: "alex@example.com",
        avatarUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        createdAt: new Date()
      },
      {
        id: 2,
        username: "rider2",
        fullName: "Mike Smith",
        email: "mike@example.com",
        avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        createdAt: new Date()
      },
      {
        id: 3,
        username: "rider3",
        fullName: "Jessica Taylor",
        email: "jessica@example.com",
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        createdAt: new Date()
      },
      {
        id: 4,
        username: "rider4",
        fullName: "David Wilson",
        email: "david@example.com",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        createdAt: new Date()
      }
    ]
  },
  {
    id: 2,
    title: "Coastal Cruise",
    location: "Pacific Coast Highway",
    date: addDays(new Date(), 7).toISOString(),
    host: {
      id: 2,
      username: "rider2",
      fullName: "Mike Smith",
      email: "mike@example.com",
      avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      createdAt: new Date()
    },
    attendees: [
      {
        id: 2,
        username: "rider2",
        fullName: "Mike Smith",
        email: "mike@example.com",
        avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        createdAt: new Date()
      },
      {
        id: 3,
        username: "rider3",
        fullName: "Jessica Taylor",
        email: "jessica@example.com",
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        createdAt: new Date()
      }
    ]
  }
];

const mockFeedPosts = [
  {
    id: 1,
    user: {
      id: 1,
      username: "rider1",
      fullName: "Alex Johnson",
      avatarUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    type: "ride",
    content: "Just finished an amazing ride through the mountains. 120 miles of pure joy!",
    imageUrl: "https://images.unsplash.com/photo-1611323795623-21b95144fe3c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    likes: 24,
    comments: 5,
    createdAt: "2 hours ago"
  },
  {
    id: 2,
    user: {
      id: 2,
      username: "rider2",
      fullName: "Michael Smith",
      avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    type: "motorcycle",
    content: "Finally got my dream bike! Can't wait to hit the road this weekend.",
    imageUrl: "https://images.unsplash.com/photo-1635073908681-b3dbacb15f76?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    likes: 42,
    comments: 12,
    createdAt: "1 day ago"
  }
];

const mockSquadMembers = [
  {
    id: 1,
    username: "rider1",
    fullName: "Alex Johnson",
    email: "alex@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    createdAt: new Date(),
    motorcycle: "Ducati"
  },
  {
    id: 2,
    username: "rider2",
    fullName: "Mike Smith",
    email: "mike@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    createdAt: new Date(),
    motorcycle: "Triumph"
  },
  {
    id: 3,
    username: "rider3",
    fullName: "Jessica Taylor",
    email: "jessica@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    createdAt: new Date(),
    motorcycle: "BMW"
  },
  {
    id: 4,
    username: "rider4",
    fullName: "David Wilson",
    email: "david@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    createdAt: new Date(),
    motorcycle: "Harley"
  }
];

const mockNearbyRiders = [
  {
    id: 5,
    username: "rider5",
    fullName: "Sarah Johnson",
    email: "sarah@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    createdAt: new Date()
  },
  {
    id: 6,
    username: "rider6",
    fullName: "Robert Brown",
    email: "robert@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    createdAt: new Date()
  },
  {
    id: 7,
    username: "rider7",
    fullName: "Emily Davis",
    email: "emily@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    createdAt: new Date()
  }
];

const Community = () => {
  const [feedFilter, setFeedFilter] = useState("recent");
  const [joinedRides, setJoinedRides] = useState<number[]>([]);
  const { toast } = useToast();
  
  // Get user's friends
  const { data: friends = mockSquadMembers, isLoading: friendsLoading } = useQuery<Omit<User, 'password'>[]>({
    queryKey: ['/api/friends'],
    enabled: true,
    retry: false
  });
  
  // Get upcoming rides
  const { data: rides = mockRides, isLoading: ridesLoading } = useQuery<Ride[]>({
    queryKey: ['/api/rides'],
    enabled: true,
    retry: false
  });
  
  // Join a ride
  const handleJoinRide = (rideId: number) => {
    setJoinedRides([...joinedRides, rideId]);
    toast({
      title: "Ride Joined",
      description: "You have successfully joined this ride.",
    });
  };
  
  // Handle like post
  const handleLikePost = (postId: number) => {
    toast({
      title: "Post Liked",
      description: "This feature will be available soon!",
    });
  };
  
  // Handle find riders
  const handleFindRiders = () => {
    toast({
      title: "Find Riders",
      description: "This feature will be available soon!",
    });
  };
  
  // Handle create ride
  const handleCreateRide = () => {
    toast({
      title: "Create Ride",
      description: "This feature will be available soon!",
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold font-header text-[#1A1A1A]">Rider Community</h2>
          <p className="text-gray-600">Connect with fellow enthusiasts</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white"
            onClick={handleFindRiders}
          >
            <Search className="h-4 w-4 mr-2" />
            FIND RIDERS
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upcoming Rides */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-bold font-header">Upcoming Rides</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {ridesLoading ? (
                <div className="flex justify-center items-center py-12">
                  <svg className="animate-spin h-8 w-8 text-[#007AFF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : (rides.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Upcoming Rides</h3>
                  <p className="text-gray-500 text-center mb-4">
                    There are no planned rides coming up
                  </p>
                  <Button 
                    variant="outline"
                    onClick={handleCreateRide}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create a Ride
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {mockRides.map(ride => (
                    <RideCard
                      key={ride.id}
                      id={ride.id}
                      title={ride.title}
                      location={ride.location}
                      date={ride.date}
                      host={ride.host}
                      attendees={ride.attendees}
                      joined={joinedRides.includes(ride.id)}
                      onJoin={handleJoinRide}
                    />
                  ))}
                </div>
              ))}
              
              <div className="p-4 border-t border-gray-200">
                <Button 
                  variant="ghost"
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900"
                  onClick={handleCreateRide}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Ride
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold font-header">Your Riding Squad</CardTitle>
            </CardHeader>
            <CardContent>
              {friendsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <svg className="animate-spin h-8 w-8 text-[#007AFF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : (friends.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Squad Members</h3>
                  <p className="text-gray-500 text-center mb-4">
                    Connect with other riders to build your squad
                  </p>
                  <Button 
                    className="bg-[#007AFF] hover:bg-[#007AFF]/90 text-white"
                    onClick={handleFindRiders}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Find Riders
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {mockSquadMembers.map(member => (
                    <div key={member.id} className="flex flex-col items-center">
                      <Avatar className="h-14 w-14 mb-2">
                        <AvatarImage src={member.avatarUrl} alt={member.fullName} />
                        <AvatarFallback>{member.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium">
                        {member.fullName.split(' ')[0]} {member.fullName.split(' ')[1]?.charAt(0)}.
                      </p>
                      <p className="text-xs text-gray-500">{member.motorcycle}</p>
                    </div>
                  ))}
                  
                  <div className="flex flex-col items-center">
                    <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                      <Plus className="h-5 w-5 text-gray-500" />
                    </div>
                    <p className="text-sm font-medium">Add</p>
                    <p className="text-xs text-gray-500">New Rider</p>
                  </div>
                </div>
              ))}
              
              <Separator className="my-4" />
              
              <Button 
                variant="outline" 
                className="w-full text-gray-900"
                onClick={() => {
                  toast({
                    title: "View All",
                    description: "Full squad management coming soon!",
                  });
                }}
              >
                View All Squad Members
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column: Rider Feed */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold font-header">Rider Feed</CardTitle>
              <Select value={feedFilter} onValueChange={setFeedFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent Activity</SelectItem>
                  <SelectItem value="squad">My Squad</SelectItem>
                  <SelectItem value="nearby">Nearby Riders</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {mockFeedPosts.map(post => (
                  <div key={post.id} className="p-6">
                    <div className="flex items-start">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={post.user.avatarUrl} alt={post.user.fullName} />
                        <AvatarFallback>{post.user.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{post.user.fullName}</h4>
                            <p className="text-sm text-gray-500">
                              Added a new {post.type} • {post.createdAt}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                          </Button>
                        </div>
                        
                        <div className="mt-3 text-sm">
                          {post.content}
                        </div>
                        
                        <div className="mt-3 rounded-lg overflow-hidden">
                          <img 
                            src={post.imageUrl} 
                            alt={`${post.user.fullName}'s ${post.type}`} 
                            className="w-full h-64 object-cover"
                          />
                        </div>
                        
                        <div className="mt-3 flex justify-between items-center">
                          <div className="flex space-x-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-500 hover:text-[#007AFF] px-0"
                              onClick={() => handleLikePost(post.id)}
                            >
                              <Heart className="h-4 w-4 mr-1" />
                              <span>{post.likes}</span>
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-500 hover:text-[#007AFF] px-0"
                              onClick={() => {
                                toast({
                                  title: "Comment",
                                  description: "Commenting feature coming soon!",
                                });
                              }}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              <span>{post.comments}</span>
                            </Button>
                          </div>
                          
                          <Button 
                            variant="link" 
                            className="text-[#007AFF] p-0"
                            onClick={() => {
                              toast({
                                title: `View ${post.type === 'ride' ? 'Ride' : 'Bike'}`,
                                description: "This feature will be available soon!",
                              });
                            }}
                          >
                            View {post.type === 'ride' ? 'Ride' : 'Bike'} <ExternalLink className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 flex justify-center border-t border-gray-200">
                <Button 
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Load More",
                      description: "More posts will be available soon!",
                    });
                  }}
                >
                  Load More
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <h3 className="text-xl font-bold font-header mb-4">Discover Riders Near You</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockNearbyRiders.map(rider => (
                <RiderCard key={rider.id} rider={rider} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;

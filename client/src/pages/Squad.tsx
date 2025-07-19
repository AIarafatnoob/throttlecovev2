import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, MapPin, Clock, Users, MessageCircle, Trophy, Route, Settings, Plus, Search, Bell, Phone, Shield, Camera, Navigation } from "lucide-react";

const Squad = () => {
  const [selectedGroup, setSelectedGroup] = useState(1);

  // Mock data for demonstration
  const groups = [
    { id: 1, name: "Coastal Riders", members: 24, nextRide: "Tomorrow 8:00 AM", avatar: "CR" },
    { id: 2, name: "Mountain Hawks", members: 18, nextRide: "Sunday 7:00 AM", avatar: "MH" },
    { id: 3, name: "Speed Demons", members: 32, nextRide: "Friday 6:30 PM", avatar: "SD" }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Pacific Coast Highway Ride",
      date: "Tomorrow",
      time: "8:00 AM",
      distance: "65 km",
      pace: "Moderate",
      terrain: "Road",
      rsvps: 8,
      maxParticipants: 12,
      meetingPoint: "Pier 39 Parking"
    },
    {
      id: 2,
      title: "Golden Gate Park Loop",
      date: "Sunday",
      time: "7:00 AM", 
      distance: "25 km",
      pace: "Easy",
      terrain: "Mixed",
      rsvps: 6,
      maxParticipants: 10,
      meetingPoint: "Conservatory Entrance"
    }
  ];

  const feedPosts = [
    {
      id: 1,
      author: "Alex Chen",
      avatar: "AC",
      time: "2h ago",
      type: "route",
      content: "Check out this amazing route I discovered! Hidden gems through Marin County.",
      attachments: ["route.gpx"],
      likes: 12,
      comments: 3
    },
    {
      id: 2,
      author: "Sarah Miller",
      avatar: "SM", 
      time: "4h ago",
      type: "photo",
      content: "Perfect weather for today's ride! Who else is out there?",
      attachments: ["photo1.jpg", "photo2.jpg"],
      likes: 18,
      comments: 7
    },
    {
      id: 3,
      author: "Mike Rodriguez",
      avatar: "MR",
      time: "1d ago",
      type: "tip",
      content: "Pro tip: Always carry a spare tube and CO2 cartridge. Saved my ride today when I got a flat 20km from home!",
      likes: 25,
      comments: 12
    }
  ];

  const leaderboard = [
    { rank: 1, name: "Sarah Miller", avatar: "SM", stat: "482 km", badge: "👑" },
    { rank: 2, name: "Alex Chen", avatar: "AC", stat: "445 km", badge: "🥈" },
    { rank: 3, name: "Mike Rodriguez", avatar: "MR", stat: "423 km", badge: "🥉" },
    { rank: 4, name: "You", avatar: "YU", stat: "387 km", badge: "" },
  ];

  const riders = [
    { id: 1, name: "Sarah Miller", avatar: "SM", style: "Sprinter", skill: "Advanced", status: "online", lastRide: "2h ago" },
    { id: 2, name: "Alex Chen", avatar: "AC", style: "Climber", skill: "Expert", status: "riding", lastRide: "Active" },
    { id: 3, name: "Mike Rodriguez", avatar: "MR", style: "Endurance", skill: "Intermediate", status: "offline", lastRide: "1d ago" },
  ];

  const messages = [
    { id: 1, sender: "Sarah Miller", avatar: "SM", message: "Anyone up for an early morning ride tomorrow?", time: "5 min ago", type: "text" },
    { id: 2, sender: "Alex Chen", avatar: "AC", message: "I'm in! What route are you thinking?", time: "3 min ago", type: "text" },
    { id: 3, sender: "Mike Rodriguez", avatar: "MR", message: "Count me in too. I know a great coffee stop midway.", time: "1 min ago", type: "text" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Squad</h1>
            <p className="text-gray-600">Connect, ride, and conquer together</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Groups</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-green-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Next Ride</p>
                  <p className="text-2xl font-bold text-gray-900">8h</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Rank</p>
                  <p className="text-2xl font-bold text-gray-900">#4</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Route className="w-8 h-8 text-purple-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">387km</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="riders">Riders</TabsTrigger>
            <TabsTrigger value="leaderboard">Stats</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Share with your squad
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarFallback>YU</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Input placeholder="Share a tip, route, or photo..." className="mb-3" />
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Camera className="w-4 h-4 mr-2" />
                            Photo
                          </Button>
                          <Button size="sm" variant="outline">
                            <Navigation className="w-4 h-4 mr-2" />
                            Route
                          </Button>
                          <Button size="sm">Post</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {feedPosts.map((post) => (
                    <Card key={post.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback>{post.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{post.author}</span>
                                <Badge variant={post.type === "route" ? "default" : post.type === "photo" ? "secondary" : "outline"}>
                                  {post.type}
                                </Badge>
                              </div>
                              <span className="text-sm text-gray-500">{post.time}</span>
                            </div>
                            <p className="text-gray-800 mb-3">{post.content}</p>
                            {post.attachments && (
                              <div className="flex gap-2 mb-3">
                                {post.attachments.map((attachment, idx) => (
                                  <Badge key={idx} variant="outline">{attachment}</Badge>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{post.likes} likes</span>
                              <span>{post.comments} comments</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Groups</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {groups.map((group) => (
                      <div key={group.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">{group.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{group.name}</p>
                            <p className="text-xs text-gray-500">{group.members} members</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">{group.nextRide}</Badge>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Join Group
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Emergency Alert
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Phone className="w-4 h-4 mr-2" />
                      Voice Chat
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <MapPin className="w-4 h-4 mr-2" />
                      Share Location
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Upcoming Events</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2">
                          <Clock className="w-4 h-4" />
                          {event.date} at {event.time}
                        </CardDescription>
                      </div>
                      <Badge variant={event.pace === "Easy" ? "secondary" : event.pace === "Moderate" ? "default" : "destructive"}>
                        {event.pace}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Route className="w-4 h-4" />
                          {event.distance}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.terrain}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {event.rsvps}/{event.maxParticipants}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        Meeting: {event.meetingPoint}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">RSVP Going</Button>
                        <Button size="sm" variant="outline">Maybe</Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Riders Tab */}
          <TabsContent value="riders" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Squad Members</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Search riders..." className="pl-10 w-64" />
                </div>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {riders.map((rider) => (
                <Card key={rider.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarFallback>{rider.avatar}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          rider.status === "online" ? "bg-green-500" : rider.status === "riding" ? "bg-blue-500" : "bg-gray-400"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{rider.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">{rider.style}</Badge>
                          <Badge variant="secondary" className="text-xs">{rider.skill}</Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Last ride: {rider.lastRide}</p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" className="flex-1">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Chat
                          </Button>
                          <Button size="sm" variant="outline">
                            <Users className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">This Month's Leaderboard</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Weekly</Button>
                <Button size="sm">Monthly</Button>
                <Button variant="outline" size="sm">All Time</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Distance Leaders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaderboard.map((rider) => (
                      <div key={rider.rank} className={`flex items-center justify-between p-3 rounded-lg ${
                        rider.name === "You" ? "bg-blue-50 border border-blue-200" : "bg-gray-50"
                      }`}>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold w-6">{rider.badge || `#${rider.rank}`}</span>
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">{rider.avatar}</AvatarFallback>
                          </Avatar>
                          <span className={`font-medium ${rider.name === "You" ? "text-blue-700" : ""}`}>
                            {rider.name}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900">{rider.stat}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Distance</span>
                      <span className="font-semibold">387 km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rides Completed</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Speed</span>
                      <span className="font-semibold">25.3 km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Speed</span>
                      <span className="font-semibold">48.7 km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Elevation Gained</span>
                      <span className="font-semibold">2,843 m</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Routes Tab */}
          <TabsContent value="routes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Route Library</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Upload Route
              </Button>
            </div>
            
            <div className="text-center py-12">
              <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Route sharing coming soon!</h3>
              <p className="text-gray-500">Upload GPX files, discover hidden gems, and share your favorite routes with the squad.</p>
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="h-96">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Group Chat - Coastal Riders</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Shield className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <ScrollArea className="flex-1 mb-4">
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div key={msg.id} className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">{msg.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{msg.sender}</span>
                            <span className="text-xs text-gray-500">{msg.time}</span>
                          </div>
                          <p className="text-sm text-gray-800">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex gap-2">
                  <Input placeholder="Type a message..." className="flex-1" />
                  <Button size="sm">Send</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Squad;
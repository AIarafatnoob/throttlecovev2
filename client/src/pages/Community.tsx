import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Calendar, 
  MapPin, 
  MessageCircle, 
  Heart, 
  Share2,
  Search, 
  Plus,
  Filter,
  TrendingUp,
  Clock,
  Eye,
  MessageSquare,
  ThumbsUp,
  UserPlus,
  Settings,
  Bell,
  Globe,
  Camera,
  Video,
  Image as ImageIcon
} from "lucide-react";

// Mock data for the community
const mockPosts = [
  {
    id: 1,
    author: {
      name: "Alex Rodriguez",
      username: "@alexrides",
      avatar: "🏍️",
      rank: "Road Captain",
      verified: true
    },
    content: "Just completed an epic 500-mile ride through the Blue Ridge Mountains! The weather was perfect and the views were absolutely stunning. Met some amazing fellow riders along the way. This is why I love the motorcycle community! 🏔️",
    images: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    timestamp: "2 hours ago",
    likes: 42,
    comments: 8,
    shares: 3,
    tags: ["adventure", "mountains", "touring"]
  },
  {
    id: 2,
    author: {
      name: "Sarah Chen",
      username: "@sarahspeed",
      avatar: "🌟",
      rank: "Speed Demon",
      verified: false
    },
    content: "Track day at Laguna Seca was incredible! Managed to shave 2 seconds off my best lap time. The new suspension setup is working perfectly. Who else is hitting the track this weekend?",
    images: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    timestamp: "4 hours ago",
    likes: 67,
    comments: 15,
    shares: 7,
    tags: ["track", "racing", "performance"]
  },
  {
    id: 3,
    author: {
      name: "Mike Thompson",
      username: "@mikeadv",
      avatar: "🗻",
      rank: "Adventure Seeker",
      verified: true
    },
    content: "Planning a cross-country adventure ride next month. Looking for riding partners who are up for camping under the stars and exploring remote trails. This will be a 2-week journey covering over 3,000 miles!",
    images: [],
    timestamp: "6 hours ago",
    likes: 28,
    comments: 22,
    shares: 12,
    tags: ["adventure", "touring", "camping"]
  }
];

const mockEvents = [
  {
    id: 1,
    title: "Weekly Coffee Meetup",
    date: "Sunday, 9:00 AM",
    location: "Downtown Cafe",
    attendees: 15,
    type: "social"
  },
  {
    id: 2,
    title: "Canyon Run",
    date: "Saturday, 7:00 AM",
    location: "Angeles Crest Highway",
    attendees: 8,
    type: "ride"
  },
  {
    id: 3,
    title: "Bike Night",
    date: "Friday, 6:00 PM",
    location: "Local Brewery",
    attendees: 32,
    type: "social"
  }
];

const mockRiders = [
  {
    id: 1,
    name: "Jessica Parker",
    username: "@jessrides",
    avatar: "🚴‍♀️",
    rank: "Navigator",
    miles: 15420,
    following: false
  },
  {
    id: 2,
    name: "David Kim",
    username: "@davidk",
    avatar: "🏁",
    rank: "Track Master",
    miles: 22100,
    following: true
  },
  {
    id: 3,
    name: "Lisa Martinez",
    username: "@lisamtz",
    avatar: "🌮",
    rank: "Cruiser",
    miles: 8750,
    following: false
  }
];

export default function Community() {
  const [activeTab, setActiveTab] = useState("feed");
  const [newPost, setNewPost] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreatePost = () => {
    if (newPost.trim()) {
      // Here we would normally send to backend
      console.log("Creating post:", newPost);
      setNewPost("");
    }
  };

  const handleLike = (postId: number) => {
    console.log("Liked post:", postId);
  };

  const handleFollow = (riderId: number) => {
    console.log("Following rider:", riderId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#1A1A1A] to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              ThrottleCove Community
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Connect, Share, and Ride Together
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg" className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white">
                <Plus className="h-5 w-5 mr-2" />
                Create Post
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                <Users className="h-5 w-5 mr-2" />
                Find Riders
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: "feed", label: "Feed", icon: Globe },
              { id: "events", label: "Events", icon: Calendar },
              { id: "riders", label: "Riders", icon: Users },
              { id: "groups", label: "Groups", icon: MessageCircle }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-[#FF3B30] text-[#FF3B30]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "feed" && (
              <>
                {/* Create Post Card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <Avatar>
                        <AvatarFallback>🏍️</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Share your latest ride, tips, or motorcycle stories..."
                          value={newPost}
                          onChange={(e) => setNewPost(e.target.value)}
                          rows={3}
                          className="resize-none border-0 focus:ring-0 text-base"
                        />
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <div className="flex space-x-4">
                            <Button variant="ghost" size="sm">
                              <ImageIcon className="h-4 w-4 mr-2" />
                              Photo
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Video className="h-4 w-4 mr-2" />
                              Video
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MapPin className="h-4 w-4 mr-2" />
                              Location
                            </Button>
                          </div>
                          <Button 
                            onClick={handleCreatePost}
                            disabled={!newPost.trim()}
                            className="bg-[#FF3B30] hover:bg-[#FF3B30]/90"
                          >
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts Feed */}
                <div className="space-y-6">
                  {mockPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          {/* Post Header */}
                          <div className="flex items-start space-x-4 mb-4">
                            <Avatar>
                              <AvatarFallback>{post.author.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold">{post.author.name}</h3>
                                {post.author.verified && (
                                  <Badge variant="secondary" className="text-xs">
                                    {post.author.rank}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">{post.author.username} • {post.timestamp}</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Post Content */}
                          <div className="mb-4">
                            <p className="text-gray-900 leading-relaxed">{post.content}</p>
                            {post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {post.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Post Images */}
                          {post.images.length > 0 && (
                            <div className={`grid gap-2 mb-4 ${
                              post.images.length === 1 ? 'grid-cols-1' : 
                              post.images.length === 2 ? 'grid-cols-2' : 
                              'grid-cols-2 lg:grid-cols-3'
                            }`}>
                              {post.images.map((image, index) => (
                                <div key={index} className="relative rounded-lg overflow-hidden">
                                  <img 
                                    src={image} 
                                    alt={`Post image ${index + 1}`}
                                    className="w-full h-48 object-cover hover:scale-105 transition-transform cursor-pointer"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Post Actions */}
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex space-x-6">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleLike(post.id)}
                                className="text-gray-500 hover:text-[#FF3B30]"
                              >
                                <Heart className="h-4 w-4 mr-2" />
                                {post.likes}
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-500">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                {post.comments}
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-500">
                                <Share2 className="h-4 w-4 mr-2" />
                                {post.shares}
                              </Button>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {activeTab === "events" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Upcoming Events</h2>
                  <Button className="bg-[#FF3B30] hover:bg-[#FF3B30]/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </div>
                <div className="grid gap-6">
                  {mockEvents.map((event) => (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {event.date}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {event.location}
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {event.attendees} attending
                              </div>
                            </div>
                            <Badge className={
                              event.type === 'ride' ? 'bg-green-100 text-green-800' :
                              event.type === 'social' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {event.type}
                            </Badge>
                          </div>
                          <Button variant="outline">
                            Join Event
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "riders" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Connect with Riders</h2>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search riders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid gap-4">
                  {mockRiders.map((rider) => (
                    <Card key={rider.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="text-lg">{rider.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{rider.name}</h3>
                              <p className="text-sm text-gray-500">{rider.username}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {rider.rank}
                                </Badge>
                                <span className="text-xs text-gray-500">{rider.miles.toLocaleString()} miles</span>
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant={rider.following ? "outline" : "default"}
                            onClick={() => handleFollow(rider.id)}
                            className={!rider.following ? "bg-[#FF3B30] hover:bg-[#FF3B30]/90" : ""}
                          >
                            {rider.following ? (
                              "Following"
                            ) : (
                              <>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Follow
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "groups" && (
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Groups Coming Soon</h3>
                <p className="text-gray-500 mb-6">
                  Create and join motorcycle groups based on your interests, location, and riding style.
                </p>
                <Button className="bg-[#FF3B30] hover:bg-[#FF3B30]/90">
                  <Bell className="h-4 w-4 mr-2" />
                  Notify Me
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-[#FF3B30]" />
                  Trending
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { tag: "#TrackDay", posts: "47 posts" },
                  { tag: "#AdventureRiding", posts: "32 posts" },
                  { tag: "#BikeNight", posts: "28 posts" },
                  { tag: "#MaintenanceTips", posts: "21 posts" },
                  { tag: "#RideShare", posts: "19 posts" }
                ].map((trend, index) => (
                  <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <div>
                      <p className="font-medium text-sm">{trend.tag}</p>
                      <p className="text-xs text-gray-500">{trend.posts}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Events Sidebar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-[#FF3B30]" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="border-l-4 border-[#FF3B30] pl-3">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                    <p className="text-xs text-gray-500">{event.attendees} attending</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View All Events
                </Button>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-[#FF3B30]" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">2,847</div>
                  <div className="text-sm text-gray-500">Active Riders</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold">156</div>
                    <div className="text-xs text-gray-500">Posts Today</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">23</div>
                    <div className="text-xs text-gray-500">Events This Week</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
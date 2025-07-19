import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, Clock, ChevronRight, ArrowUpRight, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Sample blog data
const blogArticles = [
  {
    id: 1,
    title: "The Ultimate Guide to Motorcycle Maintenance",
    excerpt: "Learn essential maintenance tips to keep your bike running smoothly and extend its lifespan.",
    category: "Maintenance",
    tags: ["Maintenance", "DIY", "Guide"],
    date: "2023-04-15",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    author: {
      name: "Michael Johnson",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  },
  {
    id: 2,
    title: "Top Motorcycle Routes in California",
    excerpt: "Discover the most scenic and thrilling motorcycle routes California has to offer.",
    category: "Travel",
    tags: ["Travel", "Routes", "California"],
    date: "2023-04-02",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1558979158-65a1eaa08691?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    author: {
      name: "Amanda Rivera",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  },
  {
    id: 3,
    title: "How to Choose Your First Motorcycle",
    excerpt: "A comprehensive guide for beginners on selecting the perfect first motorcycle.",
    category: "Buying Guide",
    tags: ["Beginners", "Buying Guide", "Tips"],
    date: "2023-03-28",
    readTime: "10 min read",
    imageUrl: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    author: {
      name: "David Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  },
  {
    id: 4,
    title: "Safety Gear That Could Save Your Life",
    excerpt: "Explore the essential safety gear every rider should have and how it can protect you.",
    category: "Safety",
    tags: ["Safety", "Gear", "Protection"],
    date: "2023-03-15",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1605664061868-b262d0e08dcb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    author: {
      name: "Sarah Martinez",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  },
  {
    id: 5,
    title: "The Evolution of Sport Bikes",
    excerpt: "A look at how sport bikes have evolved over the decades and what the future holds.",
    category: "History",
    tags: ["History", "Sport Bikes", "Technology"],
    date: "2023-03-05",
    readTime: "9 min read",
    imageUrl: "https://images.unsplash.com/photo-1636664467223-4cb81a93ec4b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    author: {
      name: "James Wilson",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  },
  {
    id: 6,
    title: "Motorcycle Customization for Beginners",
    excerpt: "Learn how to personalize your motorcycle with these beginner-friendly modifications.",
    category: "Customization",
    tags: ["Customization", "DIY", "Modifications"],
    date: "2023-02-20",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1623953834410-ff2ec280c9d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    author: {
      name: "Robert Taylor",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  },
  {
    id: 7,
    title: "Winter Riding: Tips and Techniques",
    excerpt: "Essential advice for riding safely during winter months and cold weather conditions.",
    category: "Riding Tips",
    tags: ["Winter", "Riding Tips", "Safety"],
    date: "2023-02-10",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1514595363471-b52b1e446bba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    author: {
      name: "Emily Johnson",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  },
  {
    id: 8,
    title: "Electric Motorcycles: The Future of Riding",
    excerpt: "Exploring the rise of electric motorcycles and their impact on the industry.",
    category: "Technology",
    tags: ["Electric", "Technology", "Future"],
    date: "2023-01-25",
    readTime: "11 min read",
    imageUrl: "https://images.unsplash.com/photo-1558979159-7a2602c83e52?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    author: {
      name: "Thomas Brown",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  },
  {
    id: 9,
    title: "Motorcycle Clubs: Finding Your Community",
    excerpt: "How to find and join motorcycle clubs that match your riding style and interests.",
    category: "Community",
    tags: ["Community", "Clubs", "Social"],
    date: "2023-01-15",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1517949908114-71669a64d885?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    author: {
      name: "Lisa Rodriguez",
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  },
  {
    id: 10,
    title: "Track Day Essentials: Prepare Like a Pro",
    excerpt: "Everything you need to know to prepare for your first motorcycle track day experience.",
    category: "Track Riding",
    tags: ["Track Day", "Racing", "Performance"],
    date: "2023-01-05",
    readTime: "9 min read",
    imageUrl: "https://images.unsplash.com/photo-1626240166557-90e9f5d44b67?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    author: {
      name: "Mark Stevens",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  }
];

// Get unique categories
const uniqueCategories = Array.from(new Set(blogArticles.map(article => article.category)));

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const { toast } = useToast();
  
  // Filter blog articles based on search query and category
  const filteredArticles = blogArticles.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = category === "all" || article.category === category;
    
    return matchesSearch && matchesCategory;
  });
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const handleReadArticle = (id: number) => {
    toast({
      title: "Article Selected",
      description: "This article will be available soon!",
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-header text-[#1A1A1A] mb-2">Motorcycle Blog</h1>
            <p className="text-gray-600">Latest articles, guides, and stories from the motorcycle world</p>
          </div>
          <Button
            className="mt-4 md:mt-0 bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white rounded-full px-6"
            onClick={() => {
              toast({
                title: "Subscribe",
                description: "Thank you for subscribing to our newsletter!",
              });
            }}
          >
            Subscribe to Newsletter
          </Button>
        </div>
        
        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Articles</p>
              <p className="font-bold text-gray-900">{blogArticles.length}</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Writers</p>
              <p className="font-bold text-gray-900">{Array.from(new Set(blogArticles.map(a => a.author.name))).length}</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="font-bold text-gray-900">{uniqueCategories.length}</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <p className="text-sm text-gray-600">Avg Read</p>
              <p className="font-bold text-gray-900">8 min</p>
            </div>
          </div>
        </div>
      
        {/* Featured article */}
        <motion.div 
          className="relative h-[400px] rounded-2xl overflow-hidden mb-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src={blogArticles[0].imageUrl} 
            alt={blogArticles[0].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-2xl"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <Badge className="mb-3 bg-[#FF3B30] hover:bg-[#FF3B30]/90 rounded-full px-4 py-1">{blogArticles[0].category}</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{blogArticles[0].title}</h2>
            <p className="text-white/80 mb-4 max-w-2xl">{blogArticles[0].excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={blogArticles[0].author.avatar} alt={blogArticles[0].author.name} />
                  <AvatarFallback>{blogArticles[0].author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white text-sm font-medium">{blogArticles[0].author.name}</p>
                  <div className="flex items-center text-white/70 text-xs bg-black/20 backdrop-blur-sm rounded-full px-3 py-1 mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(blogArticles[0].date)}
                    <span className="mx-2">•</span>
                    <Clock className="h-3 w-3 mr-1" />
                    {blogArticles[0].readTime}
                  </div>
                </div>
              </div>
              <Button 
                className="bg-white text-[#1A1A1A] hover:bg-white/90 rounded-full"
                onClick={() => handleReadArticle(blogArticles[0].id)}
              >
                Read Article <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
        
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search articles..."
              className="pl-12 rounded-full border-gray-200 bg-white shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px] rounded-full border-gray-200 bg-white shadow-sm">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all" className="rounded-full">All Categories</SelectItem>
              {uniqueCategories.map(cat => (
                <SelectItem key={cat} value={cat} className="rounded-full">{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      
        {/* Blog articles grid */}
        {filteredArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl shadow-sm">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">No Articles Found</h3>
            <p className="text-gray-500 max-w-md">
              We couldn't find any articles matching your search criteria. Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.slice(1).map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-all rounded-2xl border-0 shadow-sm bg-gradient-to-b from-white to-gray-50">
                  <div className="relative h-48">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title}
                      className="w-full h-full object-cover rounded-t-2xl"
                    />
                    <Badge className="absolute top-3 left-3 bg-[#FF3B30] hover:bg-[#FF3B30]/90 rounded-full px-3 py-1">
                      {article.category}
                    </Badge>
                  </div>
                  
                  <CardContent className="flex-grow p-5">
                    <div className="bg-gray-50 rounded-full px-3 py-1 inline-flex items-center text-xs text-gray-500 mb-3">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(article.date)}
                      <span className="mx-2">•</span>
                      <Clock className="h-3 w-3 mr-1" />
                      {article.readTime}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-4">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={article.author.avatar} alt={article.author.name} />
                          <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{article.author.name}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[#FF3B30] hover:text-[#FF3B30]/90 p-0 rounded-full"
                        onClick={() => handleReadArticle(article.id)}
                      >
                        Read More <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      
        {filteredArticles.length > 1 && (
          <div className="mt-10 flex justify-center">
            <Button 
              variant="outline" 
              className="border-[#1A1A1A] text-[#1A1A1A] rounded-full px-8"
              onClick={() => {
                toast({
                  title: "Load More",
                  description: "Loading more articles...",
                });
              }}
            >
              Load More Articles
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
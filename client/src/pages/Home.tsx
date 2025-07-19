import logoh from "@/assets/tclogov2h2.svg";
import neonga from "@/assets/nwhero2.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Bike, Search, TrafficCone, ArrowRight, Star, Heart, Filter, User } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import MotorcycleDetailsDialog from "@/components/ui/motorcycle/MotorcycleDetailsDialog";

// Sample motorcycle data
const motorcycles = [
  {
    id: 1,
    name: "Yamaha YZF-R1",
    brand: "Yamaha",
    year: 2024,
    engine: "998cc",
    type: "Sport",
    price: "$17,999",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Track Ready", "Quick Shifter", "Traction Control"]
  },
  {
    id: 2,
    name: "Harley-Davidson Street Glide",
    brand: "Harley-Davidson",
    year: 2024,
    engine: "1868cc",
    type: "Touring",
    price: "$21,999",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Touring", "Audio System", "Comfort"]
  },
  {
    id: 3,
    name: "Honda CBR600RR",
    brand: "Honda",
    year: 2024,
    engine: "599cc",
    type: "Sport",
    price: "$12,199",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Lightweight", "Agile", "Track Focused"]
  },
  {
    id: 4,
    name: "BMW R1250GS",
    brand: "BMW",
    year: 2024,
    engine: "1254cc",
    type: "Adventure",
    price: "$17,495",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1608845206259-da2d4feda8a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Adventure Ready", "ABS", "Traction Control"]
  },
  {
    id: 5,
    name: "Ducati Panigale V4",
    brand: "Ducati",
    year: 2024,
    engine: "1103cc",
    type: "Sport",
    price: "$23,995",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Premium", "Race Derived", "Electronics"]
  },
  {
    id: 6,
    name: "Kawasaki Ninja ZX-10R",
    brand: "Kawasaki",
    year: 2024,
    engine: "998cc",
    type: "Sport",
    price: "$16,999",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Track Ready", "Advanced Electronics", "Power"]
  }
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<any>(null);

  const filteredMotorcycles = motorcycles.filter(bike => {
    const matchesSearch = bike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bike.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || bike.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="bg-[#1A1A1A] text-white relative h-[45vh] md:h-[55vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10"></div>
        <motion.img 
          src={neonga} 
          alt="Bike in garage" 
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
        />
        <div className="container mx-auto px-4 py-10 relative z-20 h-full flex flex-col justify-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-header leading-tight max-w-2xl text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            YOUR DIGITAL GARAGE
          </motion.h1>
          <motion.p 
            className="mt-4 text-base md:text-lg max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Command the road. Master your maintenance, ride with legends, and treat your machine like royalty -
            <span className="font-bold text-[#FF3B30]"> THROTTLE</span> UP
          </motion.p>
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/garage">
              <Button 
                className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 transition-all text-white px-6 py-5 rounded-full font-medium text-lg group"
                asChild
              >
                <span>
                  OPEN YOUR GARAGE
                  <motion.div
                    className="inline-block ml-2"
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TrafficCone className="h-5 w-5" />
                  </motion.div>
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Motorcycle Catalog Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Site Logo Centered */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img
                  src={logoh}
                  alt="ThrottleCove Logo"
                  className="h-20 sm:h-28 w-auto object-contain relative z-10"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF3B30]/5 to-transparent rounded-lg blur-sm" />
              </div>
            </div>

            

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search For Your Dream Machine"
                  className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 focus:border-[#FF3B30] rounded-full shadow-sm placeholder:opacity-50 text-center"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {["All", "Sport", "Touring", "Adventure", "Cruiser"].map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  className={`px-4 py-1.5 rounded-full transition-all text-sm ${
                    selectedType === type 
                      ? "bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white border-[#FF3B30]" 
                      : "border-gray-300 hover:border-[#FF3B30] hover:text-[#FF3B30] bg-white"
                  }`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Motorcycle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMotorcycles.map((bike, index) => (
              <motion.div
                key={bike.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-all duration-300 rounded-2xl border-0 shadow-sm bg-gradient-to-b from-white to-gray-50">
                  <div className="relative h-48 overflow-hidden rounded-t-2xl">
                    <img 
                      src={bike.image} 
                      alt={bike.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:text-[#FF3B30] hover:bg-white border-0"
                        onClick={() => {
                          // Add to favorites
                          const favorites = JSON.parse(localStorage.getItem('bikeFavorites') || '[]');
                          if (!favorites.find((b: any) => b.id === bike.id)) {
                            favorites.push(bike);
                            localStorage.setItem('bikeFavorites', JSON.stringify(favorites));
                            alert(`${bike.name} added to favorites!`);
                          } else {
                            alert(`${bike.name} is already in favorites!`);
                          }
                        }}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-2 inline-block">
                            <span className="text-white text-xs font-medium">
                              {bike.year} {bike.brand}
                            </span>
                          </div>
                          <h3 className="text-white font-bold text-lg">{bike.name}</h3>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="text-gray-900 font-bold">{bike.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="flex-grow py-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                        <span className="text-gray-600 text-sm">Category</span>
                        <span className="font-semibold text-gray-900">{bike.type}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gray-50 rounded-2xl text-center">
                          <p className="text-xs text-gray-500 mb-1">Engine</p>
                          <p className="font-semibold text-sm">{bike.engine}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-2xl text-center">
                          <p className="text-xs text-gray-500 mb-1">Rating</p>
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <p className="font-semibold text-sm">{bike.rating}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {bike.features.slice(0, 3).map((feature, i) => (
                          <Badge key={i} variant="secondary" className="text-xs bg-gray-100 text-gray-700 rounded-full">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-0 pb-6 px-6">
                    <div className="w-full flex gap-2">
                      <Button 
                        className="flex-1 bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white rounded-full h-12"
                        onClick={() => {
                          // Convert bike data to match MotorcycleDetailsDialog interface
                          const motorcycleData = {
                            id: bike.id,
                            make: bike.brand,
                            model: bike.name.replace(`${bike.brand} `, ''),
                            year: bike.year,
                            category: bike.type,
                            engineSize: bike.engine,
                            power: "150 HP", // Default value
                            weight: "180 kg", // Default value
                            price: bike.price,
                            imageUrl: bike.image,
                            color: "Standard" // Default value
                          };
                          setSelectedMotorcycle(motorcycleData);
                          setIsDetailsDialogOpen(true);
                        }}
                      >
                        <span className="flex items-center">
                          View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* View More Button */}
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/catalog">
              <Button 
                variant="outline" 
                className="px-8 py-3 border-2 border-[#FF3B30] text-[#FF3B30] hover:bg-[#FF3B30] hover:text-white transition-all font-medium rounded-full"
                asChild
              >
                <span>
                  View Full Catalog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Popular Gear Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Essential Rider Gear</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Top-rated safety equipment and accessories trusted by thousands of riders worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                name: "Apex Pro Carbon Helmet",
                price: "$599.99",
                rating: 4.9,
                image: "https://via.placeholder.com/300x200/F59E0B",
                category: "Helmet",
                badge: "Best Seller"
              },
              {
                name: "Turbulence Pro Jacket",
                price: "$349.99",
                rating: 4.8,
                image: "https://via.placeholder.com/300x200/3B82F6",
                category: "Jacket",
                badge: "Top Rated"
              },
              {
                name: "Track Pro Gloves",
                price: "$149.99",
                rating: 4.8,
                image: "https://via.placeholder.com/300x200/10B981",
                category: "Gloves",
                badge: "Premium"
              },
              {
                name: "Race Pro Boots",
                price: "$329.99",
                rating: 4.9,
                image: "https://via.placeholder.com/300x200/8B5CF6",
                category: "Boots",
                badge: "Pro Level"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 rounded-2xl border-0 shadow-sm bg-gradient-to-b from-white to-gray-50">
                  <div className="relative h-40">
                    <div 
                      className="w-full h-full bg-cover bg-center rounded-t-2xl"
                      style={{ backgroundImage: `url(${item.image})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-2xl" />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-[#FF3B30] text-white rounded-full px-3 py-1">
                          {item.badge}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.name}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                      <span className="font-bold text-lg">{item.price}</span>
                    </div>
                    <Button className="w-full bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white rounded-full">
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/shop">
              <Button 
                variant="outline" 
                className="px-8 py-3 border-2 border-[#FF3B30] text-[#FF3B30] hover:bg-[#FF3B30] hover:text-white transition-all font-medium rounded-full"
                asChild
              >
                <span>
                  Shop All Gear
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Latest Blog Posts Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Latest from the Community</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest tips, reviews, and stories from fellow riders
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {[
              {
                title: "The Ultimate Guide to Motorcycle Maintenance",
                excerpt: "Learn essential maintenance tips to keep your bike running smoothly and extend its lifespan.",
                category: "Maintenance",
                readTime: "8 min read",
                date: "2 days ago",
                image: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                author: "Michael Johnson"
              },
              {
                title: "Top Motorcycle Routes in California",
                excerpt: "Discover the most scenic and thrilling motorcycle routes California has to offer.",
                category: "Travel",
                readTime: "6 min read",
                date: "4 days ago",
                image: "https://images.unsplash.com/photo-1558979158-65a1eaa08691?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                author: "Amanda Rivera"
              },
              {
                title: "Safety Gear That Could Save Your Life",
                excerpt: "Explore the essential safety gear every rider should have and how it can protect you.",
                category: "Safety",
                readTime: "7 min read",
                date: "1 week ago",
                image: "https://images.unsplash.com/photo-1605664061868-b262d0e08dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                author: "Sarah Martinez"
              }
            ].map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-all duration-300 rounded-2xl border-0 shadow-sm bg-gradient-to-b from-white to-gray-50">
                  <div className="relative h-48">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover rounded-t-2xl"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-[#FF3B30] text-white rounded-full px-3 py-1">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="flex-grow p-6">
                    <div className="flex items-center text-xs text-gray-500 mb-3 gap-4">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4">
                      <span className="text-sm font-medium text-gray-700">By {post.author}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[#FF3B30] hover:text-[#FF3B30]/90 p-0 rounded-full"
                      >
                        Read More <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/blog">
              <Button 
                variant="outline" 
                className="px-8 py-3 border-2 border-[#FF3B30] text-[#FF3B30] hover:bg-[#FF3B30] hover:text-white transition-all font-medium rounded-full"
                asChild
              >
                <span>
                  Read All Articles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      

      {/* Motorcycle Details Dialog */}
      <MotorcycleDetailsDialog 
        motorcycle={selectedMotorcycle}
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />
    </div>
  );
};

export default Home;
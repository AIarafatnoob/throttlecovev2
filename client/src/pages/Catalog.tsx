import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Share2, Bookmark, ChevronDown, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Sample motorcycle data
const motorcycles = [
  {
    id: 1,
    make: "Honda",
    model: "CBR1000RR",
    year: 2023,
    category: "Sport",
    engineSize: "1000cc",
    power: "217 hp",
    weight: "201 kg",
    price: "$16,499",
    imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    color: "Grand Prix Red"
  },
  {
    id: 2,
    make: "Kawasaki",
    model: "Ninja ZX-10R",
    year: 2023,
    category: "Sport",
    engineSize: "998cc",
    power: "203 hp",
    weight: "207 kg",
    price: "$16,799",
    imageUrl: "https://images.unsplash.com/photo-1571646750134-a0df873adbfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80",
    color: "Lime Green/Ebony"
  },
  {
    id: 3,
    make: "Yamaha",
    model: "YZF-R1",
    year: 2023,
    category: "Sport",
    engineSize: "998cc",
    power: "200 hp",
    weight: "201 kg",
    price: "$17,899",
    imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80",
    color: "Team Yamaha Blue"
  },
  {
    id: 4,
    make: "Ducati",
    model: "Panigale V4",
    year: 2023,
    category: "Sport",
    engineSize: "1103cc",
    power: "215.5 hp",
    weight: "194 kg",
    price: "$23,295",
    imageUrl: "https://images.unsplash.com/photo-1547549082-6bc09f2049ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1712&q=80",
    color: "Ducati Red"
  },
  {
    id: 5,
    make: "BMW",
    model: "R 1250 GS",
    year: 2023,
    category: "Adventure",
    engineSize: "1254cc",
    power: "136 hp",
    weight: "249 kg",
    price: "$17,995",
    imageUrl: "https://images.unsplash.com/photo-1606072021740-dbd62ef11d72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1718&q=80",
    color: "Black Storm Metallic"
  },
  {
    id: 6,
    make: "Harley-Davidson",
    model: "Road King",
    year: 2023,
    category: "Cruiser",
    engineSize: "1746cc",
    power: "90 hp",
    weight: "379 kg",
    price: "$19,499",
    imageUrl: "https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80",
    color: "Vivid Black"
  },
  {
    id: 7,
    make: "Triumph",
    model: "Street Triple",
    year: 2023,
    category: "Naked",
    engineSize: "765cc",
    power: "123 hp",
    weight: "189 kg",
    price: "$11,295",
    imageUrl: "https://images.unsplash.com/photo-1546271227-b8ff16633e48?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1712&q=80",
    color: "Matt Silver Ice"
  },
  {
    id: 8,
    make: "KTM",
    model: "1290 Super Duke R",
    year: 2023,
    category: "Naked",
    engineSize: "1301cc",
    power: "180 hp",
    weight: "200 kg",
    price: "$18,699",
    imageUrl: "https://images.unsplash.com/photo-1611241443322-b5bff7fb0b7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1700&q=80",
    color: "Orange/Black"
  },
  {
    id: 9,
    make: "Suzuki",
    model: "GSX-R1000R",
    year: 2023,
    category: "Sport",
    engineSize: "999cc",
    power: "202 hp",
    weight: "203 kg",
    price: "$17,749",
    imageUrl: "https://images.unsplash.com/photo-1571646754017-72fbe838eeee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80",
    color: "Metallic Triton Blue"
  },
  {
    id: 10,
    make: "Honda",
    model: "Africa Twin",
    year: 2023,
    category: "Adventure",
    engineSize: "1084cc",
    power: "101 hp",
    weight: "238 kg",
    price: "$14,999",
    imageUrl: "https://images.unsplash.com/photo-1608461864721-b8f50c91c147?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    color: "Grand Prix Red"
  }
];

// Category counts
const categoryCounts = {
  Sport: motorcycles.filter(m => m.category === "Sport").length,
  Adventure: motorcycles.filter(m => m.category === "Adventure").length,
  Cruiser: motorcycles.filter(m => m.category === "Cruiser").length,
  Naked: motorcycles.filter(m => m.category === "Naked").length
};

const Catalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const { toast } = useToast();
  
  // Filter motorcycles based on search query and category
  const filteredMotorcycles = motorcycles.filter(motorcycle => {
    const matchesSearch = 
      motorcycle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      motorcycle.model.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = category === "all" || motorcycle.category === category;
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort motorcycles
  const sortedMotorcycles = [...filteredMotorcycles].sort((a, b) => {
    if (sortBy === "newest") return b.year - a.year;
    if (sortBy === "price-asc") return parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, ''));
    if (sortBy === "price-desc") return parseInt(b.price.replace(/[^\d]/g, '')) - parseInt(a.price.replace(/[^\d]/g, ''));
    return 0;
  });
  
  const handleSaveMotorcycle = (id: number) => {
    toast({
      title: "Motorcycle Saved",
      description: "The motorcycle has been saved to your favorites",
    });
  };
  
  const handleShareMotorcycle = (id: number) => {
    toast({
      title: "Share Link Generated",
      description: "A shareable link has been copied to your clipboard",
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-header text-[#1A1A1A] mb-2">Motorcycle Catalog</h1>
          <p className="text-gray-600">Explore our collection of motorcycles from top manufacturers</p>
        </div>
      </div>
      
      {/* Search and Filters */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm border p-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search motorcycles by make or model..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Sport">Sport ({categoryCounts.Sport})</SelectItem>
                <SelectItem value="Adventure">Adventure ({categoryCounts.Adventure})</SelectItem>
                <SelectItem value="Cruiser">Cruiser ({categoryCounts.Cruiser})</SelectItem>
                <SelectItem value="Naked">Naked ({categoryCounts.Naked})</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>
      
      {/* Tabs for browsing by category */}
      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="bg-transparent border-b w-full justify-start space-x-8 rounded-none">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#FF3B30] data-[state=active]:text-[#1A1A1A] rounded-none px-1 py-2 text-gray-600"
          >
            All
          </TabsTrigger>
          <TabsTrigger 
            value="sport" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#FF3B30] data-[state=active]:text-[#1A1A1A] rounded-none px-1 py-2 text-gray-600"
          >
            Sport
          </TabsTrigger>
          <TabsTrigger 
            value="adventure" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#FF3B30] data-[state=active]:text-[#1A1A1A] rounded-none px-1 py-2 text-gray-600"
          >
            Adventure
          </TabsTrigger>
          <TabsTrigger 
            value="cruiser" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#FF3B30] data-[state=active]:text-[#1A1A1A] rounded-none px-1 py-2 text-gray-600"
          >
            Cruiser
          </TabsTrigger>
          <TabsTrigger 
            value="naked" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#FF3B30] data-[state=active]:text-[#1A1A1A] rounded-none px-1 py-2 text-gray-600"
          >
            Naked
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Motorcycle grid */}
      {sortedMotorcycles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Filter className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">No Motorcycles Found</h3>
          <p className="text-gray-500 max-w-md">
            We couldn't find any motorcycles matching your search criteria. Try adjusting your filters or search terms.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMotorcycles.map((motorcycle, index) => (
            <motion.div
              key={motorcycle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={motorcycle.imageUrl} 
                    alt={`${motorcycle.make} ${motorcycle.model}`}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 rounded-full bg-white text-gray-600 hover:text-[#FF3B30]"
                      onClick={() => handleSaveMotorcycle(motorcycle.id)}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 rounded-full bg-white text-gray-600 hover:text-[#FF3B30]"
                      onClick={() => handleShareMotorcycle(motorcycle.id)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-white text-sm font-medium">
                          {motorcycle.year} {motorcycle.make}
                        </span>
                        <h3 className="text-white font-bold">{motorcycle.model}</h3>
                      </div>
                      <span className="text-white font-bold">{motorcycle.price}</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="flex-grow py-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Category</span>
                      <p className="font-medium">{motorcycle.category}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Engine</span>
                      <p className="font-medium">{motorcycle.engineSize}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Power</span>
                      <p className="font-medium">{motorcycle.power}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Weight</span>
                      <p className="font-medium">{motorcycle.weight}</p>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0 pb-4">
                  <Button 
                    className="w-full bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white"
                    onClick={() => {
                      toast({
                        title: "Motorcycle Details",
                        description: `View detailed specifications for ${motorcycle.make} ${motorcycle.model}`,
                      });
                    }}
                  >
                    <span className="flex items-center">
                      View Details <ArrowUpRight className="ml-2 h-4 w-4" />
                    </span>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
      
      {sortedMotorcycles.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Button 
            variant="outline" 
            className="border-[#1A1A1A] text-[#1A1A1A] px-6"
            onClick={() => {
              toast({
                title: "Load More",
                description: "Loading more motorcycles...",
              });
            }}
          >
            <span className="flex items-center">
              Load More <ChevronDown className="ml-2 h-4 w-4" />
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Catalog;
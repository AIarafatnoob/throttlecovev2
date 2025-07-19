import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shirt, HardHat, ShieldCheck, Wind, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Product interface
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  features: string[];
  badge?: string;
}

const products: Product[] = [
  // Helmets
  {
    id: 1,
    name: "Apex Pro Carbon",
    description: "Premium full-face carbon helmet with advanced ventilation and noise reduction.",
    price: 599.99,
    rating: 4.9,
    image: "helmet-1",
    category: "helmets",
    features: ["Carbon fiber shell", "Pinlock ready visor", "Emergency quick release", "DOT & ECE certified"],
    badge: "Premium"
  },
  {
    id: 2,
    name: "Velocity GT",
    description: "Aerodynamic helmet designed for sport riders seeking performance and comfort.",
    price: 349.99,
    rating: 4.7,
    image: "helmet-2",
    category: "helmets",
    features: ["Fiberglass composite shell", "Anti-fog visor", "Removable liner", "DOT certified"]
  },
  {
    id: 3,
    name: "Stealth Modular 3.0",
    description: "Versatile flip-up helmet with integrated sun visor and bluetooth connectivity.",
    price: 289.99,
    rating: 4.5,
    image: "helmet-3",
    category: "helmets",
    features: ["Modular design", "Integrated sun visor", "Bluetooth ready", "ECE certified"]
  },
  {
    id: 4,
    name: "Cruiser Classic",
    description: "Vintage-inspired open face helmet that doesn't compromise on modern safety.",
    price: 179.99,
    rating: 4.3,
    image: "helmet-4",
    category: "helmets",
    features: ["ABS shell", "Leather trim", "Quick-release buckle", "DOT certified"]
  },
  {
    id: 5,
    name: "Adventure X",
    description: "Dual-sport helmet with peak visor, perfect for on and off-road adventures.",
    price: 249.99,
    rating: 4.6,
    image: "helmet-5",
    category: "helmets",
    features: ["Adjustable peak visor", "Extra wide viewport", "Moisture-wicking liner", "DOT & ECE certified"]
  },
  
  // Jackets
  {
    id: 6,
    name: "Turbulence Pro",
    description: "All-season textile jacket with removable thermal liner and waterproof membrane.",
    price: 349.99,
    rating: 4.8,
    image: "jacket-1",
    category: "jackets",
    features: ["CE level 2 armor", "Waterproof", "Removable thermal liner", "Ventilation zippers"],
    badge: "Best Seller"
  },
  {
    id: 7,
    name: "Vintage Racer",
    description: "Classic leather jacket with modern protection for the style-conscious rider.",
    price: 399.99,
    rating: 4.7,
    image: "jacket-2",
    category: "jackets",
    features: ["Premium cowhide leather", "CE shoulder & elbow armor", "Back protector pocket", "Quilted lining"]
  },
  {
    id: 8,
    name: "TechMesh Summer",
    description: "Lightweight mesh jacket designed for hot weather riding with maximum airflow.",
    price: 199.99,
    rating: 4.5,
    image: "jacket-3",
    category: "jackets",
    features: ["High-density mesh", "CE armor", "Reflective details", "Adjustable fit"]
  },
  {
    id: 9,
    name: "Urban Commuter",
    description: "Stylish water-resistant jacket that transitions from motorcycle to office seamlessly.",
    price: 279.99,
    rating: 4.4,
    image: "jacket-4",
    category: "jackets",
    features: ["Water resistant", "Removable armor", "Multiple pockets", "Casual styling"]
  },
  {
    id: 10,
    name: "Adventure Tour",
    description: "Rugged all-weather jacket built for long-distance adventure touring.",
    price: 449.99,
    rating: 4.9,
    image: "jacket-5",
    category: "jackets",
    features: ["GORE-TEX® membrane", "CE level 2 armor", "Cargo pockets", "Adventure fit"],
    badge: "Premium"
  },
  
  // Gloves
  {
    id: 11,
    name: "Track Pro",
    description: "Race-ready gloves with premium kangaroo leather and extensive protection.",
    price: 149.99,
    rating: 4.8,
    image: "gloves-1",
    category: "gloves",
    features: ["Kangaroo leather palm", "Carbon fiber knuckles", "Palm sliders", "Pre-curved fingers"],
    badge: "Race Spec"
  },
  {
    id: 12,
    name: "Touring Comfort",
    description: "All-season touring gloves with Gore-Tex and touch screen capability.",
    price: 119.99,
    rating: 4.6,
    image: "gloves-2",
    category: "gloves",
    features: ["Gore-Tex waterproof", "Thinsulate insulation", "Touch screen compatible", "Visor wiper"]
  },
  {
    id: 13,
    name: "Summer Mesh",
    description: "Lightweight, breathable gloves for hot weather riding.",
    price: 59.99,
    rating: 4.3,
    image: "gloves-3",
    category: "gloves",
    features: ["Mesh construction", "Leather reinforcements", "Knuckle protection", "Touch screen compatible"]
  },
  {
    id: 14,
    name: "Classic Cruiser",
    description: "Vintage-styled deerskin gloves with minimal bulk and classic styling.",
    price: 79.99,
    rating: 4.4,
    image: "gloves-4",
    category: "gloves",
    features: ["Deerskin leather", "Minimal design", "Snap closure", "Unlined for dexterity"]
  },
  {
    id: 15,
    name: "Winter Extreme",
    description: "Heavily insulated waterproof gloves for winter riding conditions.",
    price: 129.99,
    rating: 4.7,
    image: "gloves-5",
    category: "gloves",
    features: ["400g Thinsulate", "Waterproof membrane", "Extended gauntlet", "Heated option available"]
  },
  
  // Boots
  {
    id: 16,
    name: "Race Pro",
    description: "Professional racing boots with extensive protection and ankle stabilization.",
    price: 329.99,
    rating: 4.9,
    image: "boots-1",
    category: "boots",
    features: ["Magnesium toe slider", "Ankle brace system", "Impact protection", "Anti-twist sole"],
    badge: "Pro Level"
  },
  {
    id: 17,
    name: "Adventure Trek",
    description: "Waterproof dual-sport boots that excel both on and off the motorcycle.",
    price: 279.99,
    rating: 4.7,
    image: "boots-2",
    category: "boots",
    features: ["Waterproof membrane", "Ankle protection", "Rugged sole", "Flex zones for walking"]
  },
  {
    id: 18,
    name: "Urban Commuter",
    description: "Casual-looking motorcycle boots that provide protection without looking technical.",
    price: 189.99,
    rating: 4.5,
    image: "boots-3",
    category: "boots",
    features: ["Reinforced toe & heel", "Ankle protection", "Casual appearance", "Oil-resistant sole"]
  },
  {
    id: 19,
    name: "Cruiser Classic",
    description: "Classic pull-on style boots with subtle protective features.",
    price: 219.99,
    rating: 4.3,
    image: "boots-4",
    category: "boots",
    features: ["Full-grain leather", "Reinforced shifter pad", "Cushioned insole", "Slip-resistant sole"]
  },
  {
    id: 20,
    name: "Touring Tech",
    description: "All-day comfortable waterproof touring boots with extensive features.",
    price: 259.99,
    rating: 4.8,
    image: "boots-5",
    category: "boots",
    features: ["Gore-Tex lining", "Reflective details", "Shock absorbing heel", "Wide fit option"]
  },
  
  // Accessories
  {
    id: 21,
    name: "BackGuard Pro",
    description: "CE Level 2 back protector with ventilation channels and ergonomic design.",
    price: 119.99,
    rating: 4.8,
    image: "accessory-1",
    category: "accessories",
    features: ["CE Level 2 certified", "Ergonomic design", "Ventilated", "Adjustable straps"]
  },
  {
    id: 22,
    name: "RiderComm BT5",
    description: "Premium bluetooth communication system with noise cancellation.",
    price: 299.99,
    rating: 4.9,
    image: "accessory-2",
    category: "accessories",
    features: ["2km range", "Noise cancellation", "Voice commands", "40 hour battery"],
    badge: "Top Rated"
  },
  {
    id: 23,
    name: "All-Weather Cover",
    description: "Heavy-duty motorcycle cover with heat shields and security features.",
    price: 89.99,
    rating: 4.6,
    image: "accessory-3",
    category: "accessories",
    features: ["Waterproof", "UV resistant", "Heat shields", "Security loops"]
  },
  {
    id: 24,
    name: "MotoLock Ultra",
    description: "Hardened steel disc lock with alarm and reminder cable.",
    price: 79.99,
    rating: 4.7,
    image: "accessory-4",
    category: "accessories",
    features: ["110dB alarm", "Hardened steel", "Reminder cable", "Pick resistant"]
  },
  {
    id: 25,
    name: "TechGrip Phone Mount",
    description: "Secure vibration-dampening smartphone mount with wireless charging.",
    price: 59.99,
    rating: 4.5,
    image: "accessory-5",
    category: "accessories",
    features: ["Wireless charging", "Vibration dampening", "Weather resistant", "Universal fit"]
  }
];

// Helper function to generate star rating display
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1 text-amber-400">
      {'★'.repeat(Math.floor(rating))}
      {rating % 1 > 0 ? '½' : ''}
      {'☆'.repeat(5 - Math.ceil(rating))}
      <span className="ml-1 text-gray-600 text-sm">({rating.toFixed(1)})</span>
    </div>
  );
};

// Category icon mapping
const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'helmets':
      return <HardHat className="h-5 w-5" />;
    case 'jackets':
      return <ShieldCheck className="h-5 w-5" />;
    case 'gloves':
      return <Wind className="h-5 w-5" />;
    case 'boots':
      return <Shirt className="h-5 w-5" />;
    case 'accessories':
      return <Zap className="h-5 w-5" />;
    default:
      return null;
  }
};

// Generate placeholder images with category and ID
const getImagePlaceholder = (category: string, id: number) => {
  const colors = {
    helmets: "#F59E0B",
    jackets: "#3B82F6",
    gloves: "#10B981",
    boots: "#8B5CF6",
    accessories: "#EC4899"
  };
  
  const bgColor = colors[category as keyof typeof colors] || "#6B7280";
  
  return `https://via.placeholder.com/300x200/${bgColor.replace('#', '')}`;
};

const Shop = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("helmets");
  
  // Filter products by selected category
  const filteredProducts = products.filter(product => product.category === selectedCategory);
  
  // Handle add to cart
  const handleAddToCart = (product: Product) => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    
    // Check if product already exists in cart
    const existingIndex = existingCart.findIndex((item: any) => item.id === product.id);
    
    if (existingIndex >= 0) {
      // Increment quantity if product exists
      existingCart[existingIndex].quantity += 1;
    } else {
      // Add new product to cart
      existingCart.push({ ...product, quantity: 1 });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('shoppingCart', JSON.stringify(existingCart));
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Rider Essentials</h1>
          <p className="text-gray-600 mb-6">Quality gear for the modern motorcyclist</p>
        </div>
        
        
        
        <Tabs defaultValue="helmets" onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-100 rounded-full p-1 mb-8">
            <TabsTrigger value="helmets" className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <HardHat className="h-4 w-4" />
              <span className="hidden sm:inline">Helmets</span>
            </TabsTrigger>
            <TabsTrigger value="jackets" className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Jackets</span>
            </TabsTrigger>
            <TabsTrigger value="gloves" className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Wind className="h-4 w-4" />
              <span className="hidden sm:inline">Gloves</span>
            </TabsTrigger>
            <TabsTrigger value="boots" className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Shirt className="h-4 w-4" />
              <span className="hidden sm:inline">Boots</span>
            </TabsTrigger>
            <TabsTrigger value="accessories" className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Access.</span>
            </TabsTrigger>
          </TabsList>
          
          {['helmets', 'jackets', 'gloves', 'boots', 'accessories'].map((category) => (
            <TabsContent value={category} key={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg rounded-2xl border-0 shadow-sm bg-gradient-to-b from-white to-gray-50">
                    <div className="relative">
                      <div 
                        className="h-48 bg-cover bg-center rounded-t-2xl" 
                        style={{ 
                          backgroundImage: `url(${getImagePlaceholder(product.category, product.id)})`,
                          backgroundColor: product.category === 'helmets' ? '#F59E0B' : 
                                          product.category === 'jackets' ? '#3B82F6' : 
                                          product.category === 'gloves' ? '#10B981' : 
                                          product.category === 'boots' ? '#8B5CF6' : '#EC4899'
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end rounded-t-2xl">
                          <div className="p-4 text-white">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 inline-flex items-center gap-2">
                              <CategoryIcon category={product.category} />
                              <span className="capitalize text-sm">{product.category}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {product.badge && (
                        <Badge className="absolute top-3 right-3 bg-[#FF3B30] text-white rounded-full px-3 py-1">
                          {product.badge}
                        </Badge>
                      )}
                    </div>
                    
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-3">
                        <CardTitle className="text-xl">{product.name}</CardTitle>
                        <div className="bg-gray-100 rounded-full px-3 py-1">
                          <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <StarRating rating={product.rating} />
                      <CardDescription className="line-clamp-2">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Key Features:</div>
                        <div className="grid grid-cols-1 gap-2">
                          {product.features.slice(0, 3).map((feature, i) => (
                            <div key={i} className="flex items-center p-2 bg-gray-50 rounded-2xl text-xs">
                              <span className="mr-2 text-[#FF3B30]">•</span>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between pt-4">
                      <Button variant="outline" className="rounded-full">Details</Button>
                      <Button 
                        className="bg-[#FF3B30] hover:bg-opacity-90 rounded-full"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Shop;
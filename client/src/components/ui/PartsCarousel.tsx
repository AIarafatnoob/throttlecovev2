import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from "lucide-react";

interface Part {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  compatibility: string[];
}

interface PartsCarouselProps {
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
}

const PartsCarousel = ({ vehicleMake, vehicleModel, vehicleYear }: PartsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock parts data - in a real app, this would be fetched based on the vehicle
  const suggestedParts: Part[] = [
    {
      id: 1,
      name: "Performance Air Filter",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      rating: 4.8,
      category: "Engine",
      compatibility: [vehicleMake, vehicleModel]
    },
    {
      id: 2,
      name: "LED Headlight Upgrade",
      price: 159.99,
      image: "https://images.unsplash.com/photo-1558618047-dcd31405f66b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      rating: 4.9,
      category: "Lighting",
      compatibility: [vehicleMake, vehicleModel]
    },
    {
      id: 3,
      name: "Carbon Fiber Exhaust",
      price: 449.99,
      image: "https://images.unsplash.com/photo-1558618054-fcd31405f66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      rating: 4.7,
      category: "Exhaust",
      compatibility: [vehicleMake, vehicleModel]
    },
    {
      id: 4,
      name: "Brake Pad Set",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd65?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      rating: 4.6,
      category: "Brakes",
      compatibility: [vehicleMake, vehicleModel]
    },
    {
      id: 5,
      name: "Tank Pad Protection",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1558618047-dcd31405f66d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      rating: 4.5,
      category: "Protection",
      compatibility: [vehicleMake, vehicleModel]
    }
  ];

  const itemsPerView = 3;
  const maxIndex = Math.max(0, suggestedParts.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const handleAddToCart = (part: Part) => {
    // Add to cart functionality
    const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    const existingIndex = cart.findIndex((item: any) => item.id === part.id);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...part, quantity: 1 });
    }
    
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    alert(`${part.name} added to cart!`);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600">Compatible with {vehicleMake} {vehicleModel} ({vehicleYear})</p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="rounded-full p-2 h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={currentIndex === maxIndex}
            className="rounded-full p-2 h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {suggestedParts.map((part) => (
            <div key={part.id} className="flex-shrink-0 w-1/3 px-2">
              <Card className="h-full border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={part.image}
                      alt={part.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">
                      {part.category}
                    </Badge>
                    
                    <h5 className="font-medium text-sm line-clamp-2">{part.name}</h5>
                    
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(part.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">({part.rating})</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#FF3B30]">${part.price}</span>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(part)}
                        className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white rounded-full px-3 py-1 text-xs"
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartsCarousel;
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Calendar, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Motorcycle } from "@shared/schema";

interface VerticalCarouselProps {
  motorcycles: Motorcycle[];
  onMotorcycleSelect?: (motorcycle: Motorcycle) => void;
}

const VerticalCarousel = ({ motorcycles, onMotorcycleSelect }: VerticalCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);

  useEffect(() => {
    const updateVisibleItems = () => {
      const height = window.innerHeight;
      if (height < 600) setVisibleItems(2);
      else if (height < 800) setVisibleItems(3);
      else setVisibleItems(4);
    };

    updateVisibleItems();
    window.addEventListener('resize', updateVisibleItems);
    return () => window.removeEventListener('resize', updateVisibleItems);
  }, []);

  const canScrollUp = currentIndex > 0;
  const canScrollDown = currentIndex < motorcycles.length - visibleItems;

  const scrollUp = () => {
    if (canScrollUp) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const scrollDown = () => {
    if (canScrollDown) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const getVisibleMotorcycles = () => {
    return motorcycles.slice(currentIndex, currentIndex + visibleItems);
  };

  if (!motorcycles || motorcycles.length === 0) {
    return (
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40">
        <Card className="w-64 bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3">🏍️</div>
            <p className="text-gray-600 text-sm">Add motorcycles to see them here</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40">
      <div className="flex flex-col items-center space-y-4">
        {/* Scroll Up Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={scrollUp}
          disabled={!canScrollUp}
          className={`rounded-full p-2 bg-white/90 backdrop-blur-sm shadow-lg border-0 transition-all duration-300 ${
            canScrollUp 
              ? "hover:bg-[#FF3B30] hover:text-white" 
              : "opacity-50 cursor-not-allowed"
          }`}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>

        {/* Motorcycle Cards Container */}
        <div className="relative">
          <div className="w-64 space-y-3">
            <AnimatePresence mode="wait">
              {getVisibleMotorcycles().map((motorcycle, index) => {
                const actualIndex = currentIndex + index;
                const isCenter = index === Math.floor(visibleItems / 2);
                
                return (
                  <motion.div
                    key={`${motorcycle.id}-${actualIndex}`}
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ 
                      opacity: isCenter ? 1 : 0.7,
                      x: 0,
                      scale: isCenter ? 1 : 0.95,
                    }}
                    exit={{ opacity: 0, x: -50, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                    onClick={() => onMotorcycleSelect?.(motorcycle)}
                  >
                    <Card className={`bg-white/90 backdrop-blur-sm shadow-xl border-0 transition-all duration-300 ${
                      isCenter ? "ring-2 ring-[#FF3B30]/30" : ""
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9l-5 4.9 1.18 6.84L12 17.27 5.82 20.74 7 13.9 2 9l6.91-.74z"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-[#1A1A1A] truncate">
                              {motorcycle.name}
                            </h3>
                            <p className="text-xs text-gray-500 truncate">
                              {motorcycle.make || 'Unknown'} {motorcycle.model || ''}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-[#FF3B30]" />
                            <span className="text-gray-600 truncate">
                              {motorcycle.mileage?.toLocaleString() || '0'} Mi
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-[#FF3B30]" />
                            <span className="text-gray-600">
                              {motorcycle.year || 'N/A'}
                            </span>
                          </div>
                        </div>

                        {isCenter && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-gray-200"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Status:</span>
                              <span className="text-green-600 font-medium">Active</span>
                            </div>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Visual indicator for more items */}
          {motorcycles.length > visibleItems && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-1">
                {Array.from({ length: Math.ceil(motorcycles.length / visibleItems) }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      Math.floor(currentIndex / visibleItems) === i
                        ? "bg-[#FF3B30]"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Scroll Down Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={scrollDown}
          disabled={!canScrollDown}
          className={`rounded-full p-2 bg-white/90 backdrop-blur-sm shadow-lg border-0 transition-all duration-300 ${
            canScrollDown 
              ? "hover:bg-[#FF3B30] hover:text-white" 
              : "opacity-50 cursor-not-allowed"
          }`}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default VerticalCarousel;
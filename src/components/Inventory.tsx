import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useBackendCars, type Car } from "@/hooks/useBackendCars";
import { useState, useEffect } from "react";

interface InventoryProps {
  title?: string;
  searchQuery?: string;
  selectedMake?: string;
  selectedPrice?: string;
  selectedYear?: string;
  selectedBodyType?: string;
}

export default function Inventory({ 
  title = "Recently Added", 
  searchQuery = "",
  selectedMake = "all",
  selectedPrice = "all",
  selectedYear = "all",
  selectedBodyType = "all",
}: InventoryProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [inventory, setInventory] = useState<Car[]>([]);

  const { cars, loading } = useBackendCars();

  useEffect(() => {
    setInventory((cars || []).filter((car) => car.status === 'available'));
  }, [cars]);

  // Filter cars based on all criteria
  const filteredCars = inventory.filter((car) => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        car.name.toLowerCase().includes(query) ||
        String(car.year ?? "").includes(query) ||
        String(car.mileage ?? "").toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Make filter
    if (selectedMake !== "all" && (car.make ?? "") !== selectedMake) {
      return false;
    }

    // Body type filter
    if (selectedBodyType !== "all" && ((car.body_type as string) ?? "") !== selectedBodyType) {
      return false;
    }

    // Year filter
    if (selectedYear !== "all") {
      if (selectedYear === "older") {
        if (Number(car.year) > 2021) return false;
      } else {
        if (String(car.year) !== selectedYear) return false;
      }
    }

    // Price filter
    if (selectedPrice !== "all") {
      const price = Number(car.price ?? 0);
      switch (selectedPrice) {
        case "under10":
          if (price >= 10000000) return false;
          break;
        case "10to20":
          if (price < 10000000 || price >= 20000000) return false;
          break;
        case "20to50":
          if (price < 20000000 || price >= 50000000) return false;
          break;
        case "above50":
          if (price < 50000000) return false;
          break;
      }
    }

    return true;
  });

  const handleWishlistToggle = (e: React.MouseEvent, car: Car) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(car.id)) {
      removeFromWishlist(car.id);
    } else {
      addToWishlist({
        id: car.id,
        name: car.name,
        price: String(car.price ?? ''),
        primary_image: car.primary_image || car.images?.[0] || '/uploads/placeholder.png',
        year: String(car.year ?? ''),
        mileage: String(car.mileage ?? ''),
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  return (
    <section className="w-full py-8 sm:py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground font-heading">{title}</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 sm:flex-none w-8 h-8 rounded bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 sm:flex-none w-8 h-8 rounded bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {filteredCars.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="col-span-full text-center py-12 sm:py-16"
            >
              <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <svg className="w-8 sm:w-10 h-8 sm:h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-heading font-bold mb-2">No Vehicles Found</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Try adjusting your filters or search query</p>
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
            >
              {filteredCars.map((car) => (
                <motion.div
                  key={car.id}
                  variants={cardVariants}
                  layout
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <Link to={`/car/${car.id}`} className="block">
                    <div className="bg-card rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-border group h-full">
                      {/* Image */}
                      <div className="h-auto sm:h-32 md:h-40 relative overflow-hidden bg-secondary p-3 sm:p-0 flex items-center justify-center">
                        <img
                          src={car.primary_image || car.images?.[0] || "/uploads/placeholder.png"}
                          alt={car.name}
                          className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 bg-foreground text-background text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:py-1 rounded">
                          {String(car.year ?? "")}
                        </span>
                        {/* Wishlist Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleWishlistToggle(e, car)}
                          className={`absolute top-1 sm:top-2 right-1 sm:right-2 p-1.5 sm:p-2 rounded-full transition-all duration-300 ${
                            isInWishlist(car.id)
                              ? "bg-primary text-primary-foreground"
                              : "bg-background/80 text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                          }`}
                        >
                          <Heart
                            className="w-3 h-3 sm:w-4 sm:h-4"
                            fill={isInWishlist(car.id) ? "currentColor" : "none"}
                          />
                        </motion.button>
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Content */}
                      <div className="p-3 sm:p-4">
                        <h3 className="font-bold text-foreground text-xs sm:text-sm mb-1 group-hover:text-primary transition-colors line-clamp-2">{car.name}</h3>
                        <p className="text-[11px] sm:text-xs text-muted-foreground mb-3 sm:mb-4">{`${car.mileage ?? ""} • ${car.transmission ?? ""}`}</p>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-primary font-bold text-xs sm:text-sm">{car.price ? `PKR ${Number(car.price).toLocaleString()}` : 'Contact for price'}</span>
                          <span className="text-[10px] sm:text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            Details →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

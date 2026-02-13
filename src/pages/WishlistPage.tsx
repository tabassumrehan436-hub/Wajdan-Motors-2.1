import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Breadcrumbs />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <Heart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary flex-shrink-0" fill="currentColor" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black uppercase tracking-tight">
            My Wishlist
          </h1>
          <span className="ml-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-primary/10 text-primary rounded-full text-[10px] sm:text-xs md:text-sm font-bold whitespace-nowrap">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
          </span>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-12 sm:py-16 md:py-20">
            <Heart className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-muted-foreground/30 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6 text-xs sm:text-sm md:text-base">
              Browse our catalog and save your favorite cars!
            </p>
            <Link to="/inventory">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm h-10 sm:h-12">
                Browse Cars
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {wishlist.map((car) => (
              <div
                key={car.id}
                className="bg-card rounded-lg sm:rounded-2xl border border-border overflow-hidden group hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => removeFromWishlist(car.id)}
                    className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-destructive/90 text-destructive-foreground rounded-full hover:bg-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
                <div className="p-3 sm:p-5">
                  <h3 className="font-heading font-bold text-sm sm:text-base md:text-lg mb-1">{car.name}</h3>
                  <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs md:text-sm text-muted-foreground mb-3">
                    <span>{car.year}</span>
                    <span>•</span>
                    <span>{car.mileage}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-base sm:text-lg md:text-xl font-black text-primary">{car.price}</span>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-1.5 sm:gap-2 text-[11px] sm:text-xs md:text-sm h-9 sm:h-10">
                      <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Inquire</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, Phone, MessageCircle, ChevronLeft, ChevronRight, Fuel, Gauge, Calendar, Settings, Car, Shield, MapPin } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useBackendCars, type Car as BackendCar } from "@/hooks/useBackendCars";

export default function CarDetailPage() {
  const { id } = useParams();
  const { cars } = useBackendCars();
  const [car, setCar] = useState<BackendCar | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/get-car.php?id=${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error('Not found');
        const body = await res.json();
        if (body && body.id) {
          setCar(body);
          setLoading(false);
          return;
        }
      } catch (err) {
        // fallback to car list (shouldn't be necessary)
        const found = (cars || []).find((c) => c.id === Number(id));
        if (found) setCar(found);
      }
      setLoading(false);
    };
    load();
  }, [id, cars]);
  // Contact number (country code + number without +)
  const PHONE_NUMBER = "923134959787";

  const handleCallNow = () => {
    window.location.href = `tel:+${PHONE_NUMBER}`;
  };

  const handleWhatsAppNow = () => {
    const message = encodeURIComponent(`Hello, I'm interested in the ${safecar?.name} (ID: ${safecar?.id}). Please share details.`);
    const url = `https://wa.me/${PHONE_NUMBER}?text=${message}`;
    window.open(url, "_blank");
  };

  // Provide safe defaults for optional fields
  const safecar = car ? {
    ...car,
    seating: car.seating ?? 5,
    features: Array.isArray(car.features) ? car.features : (car.features ? String(car.features).split(',') : []),
    description: car.description || "Premium quality vehicle with excellent condition and maintenance history."
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-lg font-semibold">Loading car details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  if (!safecar) {
    return (
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-3 sm:mb-4">Car Not Found</h1>
          <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">The vehicle you're looking for doesn't exist.</p>
          <Link to="/inventory">
            <Button className="btn-shine text-xs sm:text-sm h-10 sm:h-12">Back to Inventory</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleWishlistToggle = () => {
    if (isInWishlist(safecar.id)) {
      removeFromWishlist(safecar.id);
    } else {
      addToWishlist({
        id: safecar.id,
        name: safecar.name,
        price: String(safecar.price ?? ''),
        primary_image: safecar.primary_image || safecar.images?.[0] || '/uploads/placeholder.png',
        year: String(safecar.year ?? ''),
        mileage: String(safecar.mileage ?? ''),
      });
    }
  };

  // Always filter images to remove null/empty, fallback to primary_image, then placeholder
  let images: string[] = Array.isArray(safecar.images) ? safecar.images.filter((img) => !!img && img !== 'null' && img !== 'undefined') : [];
  if (images.length === 0 && safecar.primary_image && safecar.primary_image !== 'null' && safecar.primary_image !== 'undefined') {
    images = [safecar.primary_image];
  }
  if (images.length === 0) {
    images = ['/uploads/placeholder.png'];
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Breadcrumbs />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-lg sm:rounded-2xl overflow-hidden bg-secondary aspect-[4/3] group">
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={images[currentImageIndex]}
                alt={safecar.name}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover"
              />
              
              {/* Year Badge */}
              <Badge className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-primary text-primary-foreground text-[11px] sm:text-sm font-bold px-2 sm:px-3 py-1">
                {safecar.year}
              </Badge>

              {/* Navigation Arrows */}
              <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Image Dots */}
              <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                      idx === currentImageIndex ? "w-4 sm:w-6 bg-primary" : "bg-background/60"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-3 sm:mt-4">
              {images.map((img, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`rounded-lg overflow-hidden aspect-video border-2 transition-colors ${
                    idx === currentImageIndex ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Car Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Title & Price */}
            <div>
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-black text-foreground mb-1 sm:mb-2">
                    {safecar.name}
                  </h1>
                  <p className="text-muted-foreground text-xs sm:text-sm md:text-base">{safecar.description}</p>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleWishlistToggle}
                    className={`p-2 sm:p-3 rounded-full transition-colors ${
                      isInWishlist(safecar.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                    }`}
                  >
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill={isInWishlist(safecar.id) ? "currentColor" : "none"} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 sm:p-3 rounded-full bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-3 sm:mt-4"
              >
                <span className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-primary">
                  {safecar.price}
                </span>
              </motion.div>
            </div>

            {/* Quick Specs Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3"
            >
              {[
                { icon: Calendar, label: "Year", value: safecar.year },
                { icon: Gauge, label: "Mileage", value: safecar.mileage },
                { icon: Fuel, label: "Fuel", value: safecar.fuel_type },
                { icon: Settings, label: "Trans.", value: safecar.transmission },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  className="bg-secondary/50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center hover:bg-secondary transition-colors"
                >
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-primary mb-1 sm:mb-2" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">{item.label}</p>
                  <p className="font-semibold text-xs sm:text-sm">{item.value}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Additional Specs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-2 sm:gap-4 p-3 sm:p-4 bg-card border border-border rounded-lg sm:rounded-xl"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Car className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Body Type</p>
                  <p className="font-semibold text-xs sm:text-sm">{safecar.body_type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Engine</p>
                  <p className="font-semibold text-xs sm:text-sm">{safecar.engine}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-primary flex-shrink-0" style={{ backgroundColor: safecar.color?.toLowerCase().includes('white') ? '#fff' : safecar.color?.toLowerCase().includes('red') ? '#dc2626' : '#000' }} />
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Color</p>
                  <p className="font-semibold text-xs sm:text-sm">{safecar.color}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Seating</p>
                  <p className="font-semibold text-xs sm:text-sm">{safecar.seating}</p>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <h3 className="font-heading font-bold text-sm sm:text-base md:text-lg mb-2">About This Vehicle</h3>
              <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm md:text-base">{safecar.description}</p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-heading font-bold text-sm sm:text-base md:text-lg mb-2 sm:mb-3">Key Features</h3>
              <div className="flex flex-wrap gap-2">
                {safecar.features.map((feature, idx) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + idx * 0.05 }}
                  >
                    <Badge variant="secondary" className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs md:text-sm font-medium">
                      {feature}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 pt-4"
            >
              <Button
                size="lg"
                onClick={handleCallNow}
                className="flex-1 w-full min-h-[48px] py-3 px-4 sm:h-12 md:h-14 text-sm sm:text-sm md:text-base font-bold btn-shine gap-2 text-center"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                Call Now
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleWhatsAppNow}
                className="flex-1 w-full min-h-[48px] py-3 px-4 sm:h-12 md:h-14 text-sm sm:text-sm md:text-base font-bold gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-center"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                WhatsApp
              </Button>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm"
            >
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>Bloodline Motors, Lahore, Pakistan</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

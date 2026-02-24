import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-wajdan-wide.jpg";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Gauge, Zap, Wind, Car } from "lucide-react";

const stats = [
  { icon: Car, value: "700–800 km", label: "Range (Est.)" },
  { icon: Zap, value: "6.0–8.0 s", label: "0-100 km/h" },
  { icon: Gauge, value: "220 km/h", label: "Top Speed" },
  { icon: Wind, value: "192–252 hp", label: "Power" },
];

export default function Hero() {
  return (
    <section className="relative w-full min-h-[500px] sm:min-h-[600px] md:min-h-[700px] h-screen sm:h-[100vh] max-h-[900px] overflow-hidden">
      {/* Background Image */}
      <motion.img
        src={heroImage}
        alt="Car Club FSD - Premium Car Dealership"
        loading="eager"
        decoding="async"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover object-center"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 h-full flex flex-col justify-center items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full max-w-2xl"
        >
          <p className="text-primary font-bold text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3">
            Faisalabad's Trusted Car Dealer
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] mb-1 sm:mb-2 tracking-tighter font-heading">
            CAR CLUB FSD
          </h1>
          <p className="text-white/70 text-base sm:text-lg md:text-xl font-light mb-6 sm:mb-8 tracking-wide">
            Buy · Sell · Exchange
          </p>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 sm:h-12 px-6 sm:px-8 rounded-lg font-bold text-sm sm:text-base btn-shine shadow-lg shadow-primary/40">
              <Link to="/inventory">Explore Collection</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 sm:h-12 px-6 sm:px-8 rounded-lg font-bold text-sm sm:text-base border-white/25 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-all">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Stats Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <div className="container mx-auto px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 bg-black/50 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-5 border border-white/10 w-full">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-3 h-3 sm:w-4 sm:h-4 text-primary mx-auto mb-1" />
                <p className="text-white font-bold text-sm sm:text-lg font-heading">{stat.value}</p>
                <p className="text-white/50 text-[10px] sm:text-[11px] uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

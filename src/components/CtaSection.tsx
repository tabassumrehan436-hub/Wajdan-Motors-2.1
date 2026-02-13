import { Button } from "@/components/ui/button";
import heroLc300 from "@/assets/hero-lc300.png";
import { Link } from "react-router-dom";

export default function CtaSection() {
  return (
    <section className="w-full py-10 sm:py-12 md:py-16 lg:py-24 bg-dark-surface mt-8 sm:mt-10 md:mt-12 mb-8 sm:mb-10 md:mb-12 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10">
        
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-surface-foreground mb-3 sm:mb-4 font-heading">
            Not Sure What You're<br/>Looking For?
          </h2>
          <p className="text-white/60 mb-6 sm:mb-8 max-w-md text-sm sm:text-base">
            We Can Help Answer All Your Questions! Our team of experts is ready to assist you in finding your dream vehicle.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 h-10 sm:h-12 rounded-md font-bold text-xs sm:text-sm shadow-lg shadow-primary/20 btn-shine">
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>

        {/* Car Image popping in from right */}
        <div className="w-full md:w-1/2 relative">
          <img 
            src={heroLc300} 
            alt="Car" 
            loading="lazy"
            decoding="async"
            className="w-full max-w-xs sm:max-w-sm md:max-w-lg mx-auto md:ml-auto object-contain drop-shadow-2xl opacity-80"
          />
        </div>
      </div>
    </section>
  );
}

import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import heroImage from "@/assets/hero-wajdan-wide.jpg";
import { MapPin, Clock, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { getSiteSettings } from "@/lib/siteSettings";
import { useState, useEffect } from "react";

export default function ContactPage() {
  const [settings, setSettings] = useState(typeof window !== 'undefined' ? getSiteSettings() : {});

  useEffect(() => {
    const h = () => setSettings(typeof window !== 'undefined' ? getSiteSettings() : {});
    window.addEventListener('siteSettingsUpdated', h);
    return () => window.removeEventListener('siteSettingsUpdated', h);
  }, []);

  const phoneDisplay = settings.phone || '+92-313-4959787 | +92-327-0202782';
  const workingHours = settings.workingHours || 'Mon - Sat: 10 AM - 8 PM\nSunday: 12 PM - 6 PM';

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Breadcrumbs />
      {/* Visual Header */}
      <div className="min-h-[300px] sm:min-h-[400px] md:min-h-[500px] bg-dark-surface relative flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Bloodline Motors" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50" />
        <div className="relative z-10 text-center px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-heading font-black uppercase text-dark-surface-foreground tracking-tight mb-2 sm:mb-4 text-glow">
            Visit Our Showroom
          </h1>
          <p className="text-white/80 text-xs sm:text-base md:text-lg font-light tracking-wide">
            Lahore's Premier Destination for Luxury Automobiles
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 mt-4 sm:mt-6 relative z-20 mb-12 sm:mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Location Card */}
          <div className="cursor-default">
            <motion.div 
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent rounded-lg sm:rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
              <div className="relative bg-card p-4 sm:p-8 rounded-lg sm:rounded-2xl border border-border shadow-lg hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="relative z-10">
                  <motion.div 
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold uppercase mb-2 text-foreground">Location</h3>
                  <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
                    Lahore Johar Town<br/>
                    Pakistan
                  </p>
                </div>
              </div>
            </motion.div>
          </a>

          {/* Contact Card */}
          <motion.div 
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent rounded-lg sm:rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
            <div className="relative bg-card p-4 sm:p-8 rounded-lg sm:rounded-2xl border border-border shadow-lg hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Content */}
              <div className="relative z-10">
                <motion.div 
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold uppercase mb-2 text-foreground">Contact</h3>
                <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
                  {phoneDisplay}<br/>
                  sales@bloodlinemotors.com
                </p>
              </div>
            </div>
          </motion.div>

          {/* Hours Card */}
          <motion.div 
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent rounded-lg sm:rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
            <div className="relative bg-card p-4 sm:p-8 rounded-lg sm:rounded-2xl border border-border shadow-lg hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Content */}
              <div className="relative z-10">
                <motion.div 
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold uppercase mb-2 text-foreground">Hours</h3>
                {workingHours.split(/\n|,/)?.map((line, idx) => (
                  <p key={idx} className="text-muted-foreground leading-relaxed text-xs sm:text-sm">{line.trim()}</p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Contact />
      <Footer />
    </div>
  );
}

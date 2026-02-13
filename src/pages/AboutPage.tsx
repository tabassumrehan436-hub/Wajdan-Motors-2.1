import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import heroImage from "@/assets/hero-wajdan-wide.jpg";
import { motion } from "framer-motion";
import { Shield, Users, Award, Car, MapPin, Phone, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getSiteSettings } from "@/lib/siteSettings";
import { useState, useEffect } from "react";

const stats = [
  { value: "15+", label: "Years Experience" },
  { value: "500+", label: "Happy Customers" },
  { value: "1000+", label: "Cars Sold" },
  { value: "100%", label: "Verified Cars" },
];

const values = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    description: "Every car comes with complete documentation and verified history. No hidden surprises."
  },
  {
    icon: Users,
    title: "Customer First",
    description: "Your satisfaction is our priority. We guide you through every step of the buying process."
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "All vehicles undergo thorough inspection before being listed. Only the best make it to our showroom."
  },
  {
    icon: Car,
    title: "Wide Selection",
    description: "From economy to luxury, SUVs to sedans - find the perfect car that fits your lifestyle and budget."
  },
];

const whyChooseUs = [
  "Verified & Inspected Vehicles",
  "Transparent Pricing - No Hidden Fees",
  "Easy Financing Options Available",
  "Trade-in & Exchange Facility",
  "After-Sales Support",
  "Free Test Drive",
];

export default function AboutPage() {
  const [settings, setSettings] = useState(typeof window !== 'undefined' ? getSiteSettings() : {});
  useEffect(() => {
    const h = () => setSettings(typeof window !== 'undefined' ? getSiteSettings() : {});
    window.addEventListener('siteSettingsUpdated', h);
    return () => window.removeEventListener('siteSettingsUpdated', h);
  }, []);

  const phoneDisplay = settings.phone || '+92-324-7718001';
  const workingHours = settings.workingHours || 'Mon - Sat: 10 AM - 8 PM\nSunday: 12 PM - 6 PM';

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Breadcrumbs />
      
      {/* Hero Section */}
      <section className="min-h-[400px] sm:min-h-[500px] md:min-h-[600px] bg-dark-surface relative flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Wajdan Motors" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50" />
        <motion.div 
          className="relative z-10 text-center px-4 sm:px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-heading font-black uppercase text-dark-surface-foreground tracking-tight mb-3 sm:mb-4 text-glow">
            About Wajdan Motors
          </h1>
          <p className="text-white/80 text-xs sm:text-base md:text-lg lg:text-xl font-light tracking-wide max-w-2xl mx-auto">
            Faisalabad's Most Trusted Name in Pre-Owned Automobiles Since 2009
          </p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 sm:px-6 -mt-12 sm:-mt-16 md:-mt-20 relative z-20">
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="bg-card p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-2xl border border-border shadow-lg text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-primary mb-1">{stat.value}</div>
              <div className="text-muted-foreground text-[10px] sm:text-xs md:text-sm uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="py-10 sm:py-14 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-bold uppercase tracking-widest text-[10px] sm:text-xs">Our Story</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-black uppercase mt-2 mb-4 sm:mb-6">
                Built on Trust,<br/>Driven by Passion
              </h2>
              <div className="space-y-3 sm:space-y-4 text-muted-foreground leading-relaxed text-xs sm:text-sm md:text-base">
                <p>
                  Wajdan Motors was founded in 2009 with a simple mission: to make buying a used car as 
                  trustworthy and transparent as buying a new one. What started as a small showroom on 
                  Canal Road has grown into Faisalabad's premier destination for pre-owned vehicles.
                </p>
                <p>
                  Over the years, we've helped thousands of families find their perfect car. Our success 
                  is built on three pillars: quality vehicles, honest dealings, and exceptional customer 
                  service. Every car in our inventory is thoroughly inspected and comes with complete 
                  documentation.
                </p>
                <p>
                  Today, we offer Buy, Sell, and Exchange services, making it easy for you to upgrade 
                  your vehicle or find your first car. Whether you're looking for an economy hatchback 
                  or a luxury SUV, we have the perfect ride waiting for you.
                </p>
              </div>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 sm:h-12 px-4 sm:px-6 rounded-lg font-bold btn-shine text-xs sm:text-sm">
                  <Link to="/inventory">Browse Inventory</Link>
                </Button>
                <Button asChild variant="outline" className="h-10 sm:h-12 px-4 sm:px-6 rounded-lg font-bold text-xs sm:text-sm">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="aspect-square rounded-lg sm:rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800&auto=format&fit=crop" 
                  alt="Wajdan Motors Showroom" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-card p-4 sm:p-6 rounded-lg sm:rounded-2xl border border-border shadow-xl max-w-[160px] sm:max-w-[200px]">
                <div className="text-3xl sm:text-4xl font-heading font-black text-primary">15+</div>
                <div className="text-[10px] sm:text-sm text-muted-foreground">Years of Excellence in Faisalabad</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-10 sm:py-14 md:py-20 lg:py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-8 sm:mb-10 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-bold uppercase tracking-widest text-[10px] sm:text-xs">Our Values</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-black uppercase mt-2">
              What We Stand For
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-background p-4 sm:p-6 rounded-lg sm:rounded-2xl border border-border hover:-translate-y-1 transition-transform"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center text-primary mb-3 sm:mb-4">
                  <value.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-10 sm:py-14 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <motion.div
              className="order-2 md:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="aspect-video rounded-lg sm:rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop" 
                  alt="Premium Cars" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <motion.div
              className="order-1 md:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-bold uppercase tracking-widest text-[10px] sm:text-xs">Why Wajdan Motors</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-black uppercase mt-2 mb-4 sm:mb-6">
                Your Trusted Partner
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {whyChooseUs.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground text-xs sm:text-sm md:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location Card */}
      <section className="py-10 sm:py-14 md:py-20 lg:py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-8 sm:mb-10 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-bold uppercase tracking-widest text-[10px] sm:text-xs">Visit Us</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-black uppercase mt-2">
              Our Showroom
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <a href="https://maps.app.goo.gl/PjB8d4zCLHqWYwhE6" target="_blank" rel="noopener noreferrer" className="no-underline cursor-pointer group hover:opacity-80 transition-opacity">
              <div className="bg-background p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-2xl border border-border group-hover:border-primary/50 transition-colors h-full">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-xs sm:text-sm md:text-lg font-bold uppercase mb-2 group-hover:text-primary transition-colors">Location</h3>
                <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm group-hover:text-primary transition-colors">
                  Canal Road, Near McDonald's<br/>
                  Faisalabad, Pakistan
                </p>
              </div>
            </a>
            <div className="bg-background p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-2xl border border-border">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3 sm:mb-4">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xs sm:text-sm md:text-lg font-bold uppercase mb-2">Contact</h3>
              <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
                {phoneDisplay}<br/>
                sales@wajdanmotors.com
              </p>
            </div>
            <div className="bg-background p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-2xl border border-border">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3 sm:mb-4">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xs sm:text-sm md:text-lg font-bold uppercase mb-2">Hours</h3>
              {workingHours.split(/\n|,/)?.map((line, idx) => (
                <p key={idx} className="text-muted-foreground leading-relaxed text-xs sm:text-sm">{line.trim()}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

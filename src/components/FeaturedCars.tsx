 import { useState, useEffect, useCallback } from "react";
 import { EmblaCarouselType } from "embla-carousel";
 import useEmblaCarousel from "embla-carousel-react";
 import { motion } from "framer-motion";
 import { ChevronLeft, ChevronRight, Fuel, Gauge, Settings2 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Link } from "react-router-dom";
 
 import invFortuner from "@/assets/inv-fortuner.png";
 import invCivic from "@/assets/inv-civic.png";
 import invHaval from "@/assets/inv-haval.png";
 
 const featuredCars = [
   {
     id: 1,
     name: "Toyota Land Cruiser",
     year: "2024",
     price: "PKR 85,000,000",
     image: invFortuner,
     specs: { fuel: "Petrol", transmission: "Automatic", power: "415 HP" },
     tag: "Premium SUV",
   },
   {
     id: 2,
     name: "Honda Civic RS",
     year: "2024",
     price: "PKR 12,500,000",
     image: invCivic,
     specs: { fuel: "Petrol", transmission: "CVT", power: "180 HP" },
     tag: "Best Seller",
   },
   {
     id: 3,
     name: "Haval H6 HEV",
     year: "2024",
     price: "PKR 14,900,000",
     image: invHaval,
     specs: { fuel: "Hybrid", transmission: "Automatic", power: "243 HP" },
     tag: "Eco Friendly",
   },
   {
     id: 4,
     name: "Toyota Fortuner",
     year: "2024",
     price: "PKR 18,500,000",
     image: invFortuner,
     specs: { fuel: "Diesel", transmission: "Automatic", power: "204 HP" },
     tag: "Family SUV",
   },
 ];
 
 export default function FeaturedCars() {
   const [emblaRef, emblaApi] = useEmblaCarousel({ 
     loop: true,
     skipSnaps: false,
     align: "start"
   });
   const [selectedIndex, setSelectedIndex] = useState(0);
   const [isAutoPlaying, setIsAutoPlaying] = useState(true);
 
   const scrollPrev = useCallback(() => {
     if (emblaApi) emblaApi.scrollPrev();
   }, [emblaApi]);
 
   const scrollNext = useCallback(() => {
     if (emblaApi) emblaApi.scrollNext();
   }, [emblaApi]);
 
   const scrollTo = useCallback(
     (index: number) => {
       if (emblaApi) emblaApi.scrollTo(index);
     },
     [emblaApi]
   );
 
   const onSelect = useCallback(() => {
     if (!emblaApi) return;
     setSelectedIndex(emblaApi.selectedScrollSnap());
   }, [emblaApi]);
 
   // Auto-play functionality
   useEffect(() => {
     if (!emblaApi || !isAutoPlaying) return;
 
     const autoplay = setInterval(() => {
       emblaApi.scrollNext();
     }, 4000);
 
     return () => clearInterval(autoplay);
   }, [emblaApi, isAutoPlaying]);
 
   useEffect(() => {
     if (!emblaApi) return;
     onSelect();
     emblaApi.on("select", onSelect);
     return () => {
       emblaApi.off("select", onSelect);
     };
   }, [emblaApi, onSelect]);
 
   return (
     <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-dark-surface relative overflow-hidden">
       {/* Background Effects */}
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[700px] md:w-[800px] h-[300px] sm:h-[350px] md:h-[400px] bg-primary/5 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] pointer-events-none" />
 
       <div className="container mx-auto px-4 sm:px-6 relative z-10">
         {/* Section Header */}
         <motion.div
           className="text-center mb-8 sm:mb-12 px-4 sm:px-0"
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
         >
           <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
             <span className="w-6 sm:w-10 h-[2px] bg-primary"></span>
             <span className="text-primary font-bold tracking-[0.1em] sm:tracking-[0.2em] text-xs sm:text-sm uppercase">
               Featured
             </span>
             <span className="w-6 sm:w-10 h-[2px] bg-primary"></span>
           </div>
           <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-black uppercase tracking-tight text-white">
             Handpicked <span className="text-primary">Excellence</span>
           </h2>
           <p className="text-white/60 mt-3 sm:mt-4 text-sm sm:text-base max-w-xl mx-auto">
             Discover our curated selection of premium vehicles, each chosen for exceptional quality and performance.
           </p>
         </motion.div>
 
         {/* Carousel */}
         <div
           className="relative"
           onMouseEnter={() => setIsAutoPlaying(false)}
           onMouseLeave={() => setIsAutoPlaying(true)}
         >
           {/* Navigation Arrows */}
           <button
             onClick={scrollPrev}
             className="absolute left-0 sm:left-1 md:-left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all duration-300 group"
           >
             <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
           </button>
           <button
             onClick={scrollNext}
             className="absolute right-0 sm:right-1 md:-right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all duration-300 group"
           >
             <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
           </button>
 
           {/* Embla Carousel */}
           <div className="overflow-hidden mx-4 sm:mx-6 lg:mx-8 md:mx-12" ref={emblaRef}>
             <div className="flex gap-4 sm:gap-5 md:gap-6">
               {featuredCars.map((car, index) => (
                 <motion.div
                   key={car.id}
                   className="flex-[0_0_100%] sm:flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0"
                 >
                   <div className="group relative bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm rounded-lg sm:rounded-2xl border border-white/10 overflow-hidden hover:border-primary/50 transition-all duration-500">
                     {/* Tag Badge */}
                     <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
                       <span className="px-2 sm:px-3 py-1 bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full">
                         {car.tag}
                       </span>
                     </div>
 
                     {/* Car Image */}
                     <div className="relative h-auto sm:h-32 md:h-48 lg:h-56 overflow-hidden bg-gradient-to-b from-transparent to-black/20 p-3 sm:p-4 flex items-center justify-center">
                       <img
                         src={car.image}
                         alt={car.name}
                         className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-700"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                     </div>
 
                     {/* Content */}
                     <div className="p-4 sm:p-6">
                       <div className="flex items-start justify-between mb-3">
                         <div>
                           <p className="text-white/50 text-xs sm:text-sm">{car.year}</p>
                           <h3 className="text-base sm:text-xl font-heading font-bold text-white group-hover:text-primary transition-colors">
                             {car.name}
                           </h3>
                         </div>
                       </div>
 
                       {/* Specs */}
                       <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4 text-white/60 text-xs sm:text-sm">
                         <span className="flex items-center gap-1">
                           <Fuel className="w-3 h-3 sm:w-4 sm:h-4" />
                           {car.specs.fuel}
                         </span>
                         <span className="flex items-center gap-1">
                           <Settings2 className="w-3 h-3 sm:w-4 sm:h-4" />
                           {car.specs.transmission}
                         </span>
                         <span className="flex items-center gap-1">
                           <Gauge className="w-3 h-3 sm:w-4 sm:h-4" />
                           {car.specs.power}
                         </span>
                       </div>
 
                       {/* Price & CTA */}
                       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-white/10">
                         <div>
                           <p className="text-[10px] sm:text-xs text-white/40 uppercase">Price</p>
                           <p className="text-base sm:text-lg font-heading font-bold text-primary">
                             {car.price}
                           </p>
                         </div>
                         <Button
                           asChild
                           size="sm"
                           className="w-full sm:w-auto bg-white/10 hover:bg-primary text-white border border-white/20 hover:border-primary transition-all text-xs sm:text-sm"
                         >
                           <Link to={`/car/${car.id}`}>View Details</Link>
                         </Button>
                       </div>
                     </div>
 
                     {/* Hover Glow */}
                     <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                       <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/20 to-transparent" />
                     </div>
                   </div>
                 </motion.div>
               ))}
             </div>
           </div>
 
           {/* Navigation Dots */}
           <div className="flex justify-center gap-2 mt-6 sm:mt-8">
             {featuredCars.map((_, index) => (
               <button
                 key={index}
                 onClick={() => scrollTo(index)}
                 className={`transition-all duration-300 rounded-full ${
                   index === selectedIndex
                     ? "w-6 sm:w-8 h-2 sm:h-3 bg-primary"
                     : "w-2 sm:w-3 h-2 sm:h-3 bg-white/30 hover:bg-white/50"
                 }`}
                 aria-label={`Go to slide ${index + 1}`}
               />
             ))}
           </div>
         </div>
 
         {/* View All CTA */}
         <motion.div
           className="text-center mt-8 sm:mt-12"
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.3 }}
         >
           <Button
             asChild
             size="lg"
             className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 h-11 sm:h-14 rounded-lg font-bold uppercase tracking-wider btn-shine text-sm sm:text-base"
           >
             <Link to="/inventory">View All Inventory</Link>
           </Button>
         </motion.div>
       </div>
     </section>
   );
 }
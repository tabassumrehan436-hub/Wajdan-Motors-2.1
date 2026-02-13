 import { motion } from "framer-motion";
 import { Star, Quote } from "lucide-react";
 
 const testimonials = [
   {
     id: 1,
     name: "Ahmed Khan",
     role: "Business Owner",
     image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
     rating: 5,
     text: "Wajdan Motors ne mujhe meri dream car dilwai. Bahut transparent dealing aur excellent after-sales service. Highly recommended!",
   },
   {
     id: 2,
     name: "Fatima Malik",
     role: "Doctor",
     image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
     rating: 5,
     text: "Best car dealership in Faisalabad! The team was very professional and helped me choose the perfect family car. Great experience overall.",
   },
   {
     id: 3,
     name: "Usman Ali",
     role: "Engineer",
     image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
     rating: 5,
     text: "Purchased my Toyota Fortuner from here. Genuine vehicles with proper documentation. Will definitely come back for my next purchase!",
   },
    {
     id: 4,
     name: "Sara Hassan",
     role: "Entrepreneur",
     image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
     rating: 5,
     text: "Amazing collection of cars! The staff is knowledgeable and patient. They made the entire buying process smooth and hassle-free.",
   },
 ];
 
 const containerVariants = {
   hidden: { opacity: 0 },
   visible: {
     opacity: 1,
     transition: {
       staggerChildren: 0.15,
     },
   },
 };
 
 const cardVariants = {
   hidden: { opacity: 0, y: 30 },
   visible: {
     opacity: 1,
     y: 0,
     transition: {
      type: "spring" as const,
       stiffness: 100,
       damping: 15,
     },
   },
 };
 
 export default function Testimonials() {
   return (
     <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-background relative overflow-hidden">
       {/* Background Decorations */}
       <div className="absolute top-0 right-0 w-[300px] sm:w-[350px] md:w-[400px] h-[300px] sm:h-[350px] md:h-[400px] bg-primary/5 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] pointer-events-none" />
       <div className="absolute bottom-0 left-0 w-[250px] sm:w-[300px] h-[250px] sm:h-[300px] bg-primary/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />
 
       <div className="container mx-auto px-4 sm:px-6 relative z-10">
         {/* Section Header */}
         <motion.div
           className="text-center mb-10 sm:mb-16"
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
         >
           <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
             <span className="w-6 sm:w-10 h-[2px] bg-primary"></span>
             <span className="text-primary font-bold tracking-[0.1em] sm:tracking-[0.2em] text-xs sm:text-sm uppercase">
               Testimonials
             </span>
             <span className="w-6 sm:w-10 h-[2px] bg-primary"></span>
           </div>
           <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-black uppercase tracking-tight">
             What Our <span className="text-primary">Customers</span> Say
           </h2>
           <p className="text-muted-foreground mt-3 sm:mt-4 text-sm sm:text-base max-w-2xl mx-auto">
             Don't just take our word for it - hear from our satisfied customers who found their perfect vehicles with us.
           </p>
         </motion.div>
 
         {/* Testimonials Grid */}
         <motion.div
           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
           variants={containerVariants}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
         >
           {testimonials.map((testimonial) => (
             <motion.div
               key={testimonial.id}
               variants={cardVariants}
               whileHover={{ y: -4, scale: 1.01 }}
               className="group relative bg-card p-4 sm:p-6 rounded-lg sm:rounded-2xl border border-border shadow-lg hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
             >
               {/* Quote Icon */}
               <div className="absolute top-3 sm:top-4 right-3 sm:right-4 text-primary/20 group-hover:text-primary/40 transition-colors">
                 <Quote className="w-6 h-6 sm:w-8 sm:h-8" />
               </div>
 
               {/* Rating Stars */}
               <div className="flex gap-1 mb-3 sm:mb-4">
                 {[...Array(testimonial.rating)].map((_, i) => (
                   <Star
                     key={i}
                     className="w-3 h-3 sm:w-4 sm:h-4 fill-primary text-primary"
                   />
                 ))}
               </div>
 
               {/* Review Text */}
               <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 line-clamp-4">
                 "{testimonial.text}"
               </p>
 
               {/* Author */}
               <div className="flex items-center gap-2 sm:gap-3 pt-4 border-t border-border">
                 <div className="relative">
                   <img
                     src={testimonial.image}
                     alt={testimonial.name}
                     className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
                   />
                   <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-primary rounded-full flex items-center justify-center">
                     <svg className="w-2 h-2 sm:w-3 sm:h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                     </svg>
                   </div>
                 </div>
                 <div>
                   <h4 className="font-bold text-foreground text-xs sm:text-sm">{testimonial.name}</h4>
                   <p className="text-[10px] sm:text-xs text-muted-foreground">{testimonial.role}</p>
                 </div>
               </div>
 
               {/* Hover Glow Effect */}
               <div className="absolute inset-0 rounded-lg sm:rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
             </motion.div>
           ))}
         </motion.div>
 
         {/* Stats Section */}
         <motion.div
           className="mt-10 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6"
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6, delay: 0.3 }}
         >
           {[
             { value: "500+", label: "Happy Customers" },
             { value: "10+", label: "Years Experience" },
             { value: "1000+", label: "Cars Sold" },
             { value: "4.9", label: "Average Rating" },
           ].map((stat, index) => (
             <div
               key={index}
               className="text-center p-4 sm:p-6 bg-muted/50 rounded-lg sm:rounded-xl border border-border"
             >
               <div className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-primary mb-1">
                 {stat.value}
               </div>
               <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
             </div>
           ))}
         </motion.div>
       </div>
     </section>
   );
 }
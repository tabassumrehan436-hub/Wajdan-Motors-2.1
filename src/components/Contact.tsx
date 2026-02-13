import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Validation schema
const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  phone: z.string().trim().min(1, "Phone is required").max(20, "Phone must be less than 20 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message must be less than 1000 characters"),
});

// Wajdan Motors contact number
const PHONE_NUMBER = "923247718001"; // Format: country code + number without + or spaces

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    try {
      contactSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleWhatsApp = () => {
    if (!validateForm()) {
      toast({
        title: "Form Incomplete",
        description: "Please fill all fields correctly before sending.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Create WhatsApp message with properly encoded content
    const message = `*New Inquiry from Website*%0A%0A*Name:* ${encodeURIComponent(formData.name)}%0A*Phone:* ${encodeURIComponent(formData.phone)}%0A*Email:* ${encodeURIComponent(formData.email)}%0A%0A*Message:*%0A${encodeURIComponent(formData.message)}`;
    
    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${message}`;
    
    window.open(whatsappUrl, "_blank");
    
    toast({
      title: "Opening WhatsApp",
      description: "Complete your message in WhatsApp to send.",
    });

    setIsSubmitting(false);
  };

  const handleCall = () => {
    window.location.href = `tel:+${PHONE_NUMBER}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleWhatsApp();
  };

  return (
    <section id="contact" className="w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-dark-surface text-dark-surface-foreground relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-primary/20 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none -translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <span className="w-6 sm:w-10 h-[2px] bg-primary"></span>
              <span className="text-primary font-bold tracking-[0.1em] sm:tracking-[0.2em] text-xs sm:text-sm uppercase">Contact Us</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-black mt-2 sm:mt-4 mb-4 sm:mb-6 leading-tight">
              GET IN TOUCH <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">WITH WAJDAN</span>
            </h2>
            <p className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed max-w-md border-l-4 border-white/10 pl-4 sm:pl-6 my-6 sm:my-8">
              Visit our showroom in Faisalabad or send us a message to schedule a private viewing of our exclusive inventory.
            </p>
            
            <div className="mt-8 sm:mt-12 space-y-4 sm:space-y-6">
              <a href="https://maps.app.goo.gl/PjB8d4zCLHqWYwhE6" target="_blank" rel="noopener noreferrer" className="block cursor-pointer group hover:opacity-80 transition-opacity">
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">Visit Us</p>
                <p className="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors">Faisalabad, Pakistan</p>
                <p className="text-base sm:text-xl text-white/60 group-hover:text-primary transition-colors">Canal Road, Near McDonald's</p>
              </a>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Call Us</p>
                <button 
                  onClick={handleCall}
                  className="text-xl sm:text-2xl font-heading font-bold text-primary block hover:text-primary/80 transition-colors"
                >
                  +92-324-7718001
                </button>
              </div>
              
              {/* Quick Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={handleCall}
                  className="flex-1 h-11 sm:h-14 bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 gap-2 font-bold backdrop-blur-sm text-sm sm:text-base"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Call Now</span>
                  <span className="sm:hidden">Call</span>
                </Button>
                <Button 
                  onClick={() => {
                    const message = encodeURIComponent("Hi! I'm interested in your cars. Please share more details.");
                    window.open(`https://wa.me/${PHONE_NUMBER}?text=${message}`, "_blank");
                  }}
                  className="flex-1 h-11 sm:h-14 bg-[#25D366] hover:bg-[#25D366]/90 text-white gap-2 font-bold text-sm sm:text-base"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>WhatsApp</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 bg-white/5 p-6 sm:p-8 md:p-12 rounded-xl sm:rounded-[2rem] border border-white/10 backdrop-blur-xl shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 font-heading uppercase">Send an Inquiry</h3>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/50">Name</label>
                  <Input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name" 
                    className={`bg-white/5 border-white/10 text-white placeholder:text-white/30 h-10 sm:h-12 rounded-lg focus:border-primary focus:ring-primary ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/50">Phone</label>
                  <Input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 3XX XXXXXXX" 
                    className={`bg-white/5 border-white/10 text-white placeholder:text-white/30 h-10 sm:h-12 rounded-lg focus:border-primary focus:ring-primary ${errors.phone ? 'border-red-500' : ''}`}
                  />
                  {errors.phone && <p className="text-red-400 text-xs">{errors.phone}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">Email</label>
                <Input 
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com" 
                  className={`bg-white/5 border-white/10 text-white placeholder:text-white/30 h-10 sm:h-12 rounded-lg focus:border-primary focus:ring-primary ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">Message</label>
                <Textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="I'm interested in..." 
                  className={`bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[100px] sm:min-h-[120px] rounded-lg resize-none focus:border-primary focus:ring-primary ${errors.message ? 'border-red-500' : ''}`}
                />
                {errors.message && <p className="text-red-400 text-xs">{errors.message}</p>}
              </div>
              
              {/* Submit Buttons */}
              <div className="flex flex-col gap-3 pt-2 sm:pt-4">
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 sm:h-14 bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold uppercase tracking-wider text-xs sm:text-sm rounded-lg gap-2"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Send via WhatsApp
                </Button>
                <Button 
                  type="button"
                  onClick={handleCall}
                  className="w-full h-11 sm:h-14 bg-primary/20 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold uppercase tracking-wider text-xs sm:text-sm rounded-lg gap-2"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  Call Instead
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

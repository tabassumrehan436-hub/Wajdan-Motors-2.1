import { ShieldCheck, Zap, Handshake, CheckCircle } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Prime Warranty",
    description: "Every vehicle includes a comprehensive 1-year mechanical warranty for your peace of mind.",
  },
  {
    icon: Handshake,
    title: "Easy Financing",
    description: "Partnered with Meezan & Bank Alfalah for exclusive low-rate auto financing plans.",
  },
  {
    icon: Zap,
    title: "Smart Trade-In",
    description: "Get the best market value for your current car with our instant trade-in evaluation.",
  },
  {
    icon: CheckCircle,
    title: "Verified Auction Sheets",
    description: "100% transparent Japanese auction reports provided with every imported unit.",
  }
];

export default function WhyUs() {
  return (
    <section id="why-us" className="w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-card relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} 
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-16 max-w-2xl mx-auto">
          <span className="text-primary font-bold tracking-[0.1em] sm:tracking-widest text-xs sm:text-sm uppercase">Why Choose Us?</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-black text-foreground mt-3 sm:mt-4 uppercase leading-tight">
            The Wajdan Standard of Excellence
          </h2>
          <p className="text-muted-foreground mt-3 sm:mt-4 text-xs sm:text-sm md:text-base">
            We don't just sell cars; we deliver a promise of quality, transparency, and trust that has built our reputation in Faisalabad.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-background p-6 sm:p-8 rounded-none border-l-2 border-transparent hover:border-primary shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-primary/5 rounded-bl-full -mr-8 sm:-mr-12 -mt-8 sm:-mt-12 transition-transform group-hover:scale-150 duration-700" />
              
              <div className="w-10 h-10 sm:w-12 sm:h-12 mb-4 sm:mb-6 text-foreground group-hover:text-primary transition-colors duration-500">
                <feature.icon className="w-full h-full stroke-[1.5]" />
              </div>
              
              <h3 className="text-base sm:text-lg font-heading font-bold text-foreground mb-2 sm:mb-3 uppercase tracking-wide group-hover:translate-x-2 transition-transform duration-300">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm font-light">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

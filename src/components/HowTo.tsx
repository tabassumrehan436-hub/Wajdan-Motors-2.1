import { useState } from "react";
import { ChevronDown, Car, CreditCard, ClipboardCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HowTo() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const guides = [
    {
      icon: Car,
      title: "How to Choose the Perfect Car",
      content: [
        "Apni daily driving needs samjho - city driving ya highway?",
        "Family size ke hisaab se seating capacity choose karo",
        "Fuel efficiency check karo - petrol, diesel ya hybrid?",
        "Budget set karo including insurance aur maintenance costs",
        "Test drive zaroor lo before final decision",
      ],
    },
    {
      icon: CreditCard,
      title: "Understanding Financing Options",
      content: [
        "Bank loan vs dealership financing compare karo",
        "Interest rates aur processing fees check karo",
        "Down payment 20-30% rakhna better hai",
        "EMI apni monthly income ka 20% se zyada nahi honi chahiye",
        "Hidden charges aur prepayment penalties zaroor poocho",
      ],
    },
    {
      icon: ClipboardCheck,
      title: "Essential Checklist Before Buying",
      content: [
        "Vehicle registration documents verify karo",
        "Complete service history maango",
        "Accident history check karo through CARFAX ya dealer",
        "Engine, transmission aur brakes thoroughly inspect karo",
        "Warranty coverage aur transfer details confirm karo",
      ],
    },
  ];

  const toggleGuide = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full container mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-16">
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-foreground">
          Buyer's <span className="text-primary">Guide</span>
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm mt-2">
          Helpful tips to make your car buying journey easier
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {guides.map((guide, idx) => {
          const Icon = guide.icon;
          const isOpen = openIndex === idx;

          return (
            <motion.div
              key={idx}
              className={`bg-card border rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 ${
                isOpen ? "border-primary shadow-lg shadow-primary/10" : "border-border hover:border-primary/50"
              }`}
              layout
            >
              <button
                onClick={() => toggleGuide(idx)}
                className="w-full p-4 sm:p-5 flex items-center gap-3 sm:gap-4 text-left"
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
                    isOpen ? "bg-primary text-primary-foreground" : "bg-dark-surface text-dark-surface-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-xs sm:text-sm leading-tight transition-colors break-words ${isOpen ? "text-primary" : "text-foreground"}`}>
                    {guide.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                    {isOpen ? "Click to close" : "Click to learn more"}
                  </p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground transition-transform duration-300 shrink-0 ${
                    isOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                      <ul className="space-y-2 sm:space-y-3 border-t border-border pt-4">
                        {guide.content.map((item, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground"
                          >
                            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary mt-1.5 sm:mt-2 shrink-0" />
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

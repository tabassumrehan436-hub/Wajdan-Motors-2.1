import { Car, DollarSign, Users, TrendingUp } from "lucide-react";
import { getCars, getInquiries } from "@/lib/carsData";
import { motion } from "framer-motion";

export default function DashboardStats() {
  const cars = getCars();
  const inquiries = getInquiries();
  
  const availableCars = cars.filter((c) => c.status === "available").length;
  const soldCars = cars.filter((c) => c.status === "sold").length;
  const newInquiries = inquiries.filter((i) => i.status === "new").length;
  const totalValue = cars.reduce((sum, c) => sum + c.priceNum, 0);

  const stats = [
    {
      label: "Total Cars",
      value: cars.length,
      subtext: `${availableCars} available, ${soldCars} sold`,
      icon: Car,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      label: "New Inquiries",
      value: newInquiries,
      subtext: `${inquiries.length} total inquiries`,
      icon: Users,
      color: "bg-green-500/10 text-green-500",
    },
    {
      label: "Inventory Value",
      value: `${(totalValue / 1000000).toFixed(1)}M`,
      subtext: "PKR Total",
      icon: DollarSign,
      color: "bg-yellow-500/10 text-yellow-500",
    },
    {
      label: "Conversion Rate",
      value: inquiries.length > 0 ? `${Math.round((soldCars / inquiries.length) * 100)}%` : "0%",
      subtext: "Inquiries to sales",
      icon: TrendingUp,
      color: "bg-purple-500/10 text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card p-6 rounded-2xl border border-border"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-heading font-bold mt-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

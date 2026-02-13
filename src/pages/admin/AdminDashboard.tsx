import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardStats from "@/components/admin/DashboardStats";
import { useBackendCars } from "@/hooks/useBackendCars";
import { useBackendInquiries } from "@/hooks/useBackendInquiries";
import { motion } from "framer-motion";
import { Car as CarIcon, MessageSquare, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { cars, loading: carsLoading } = useBackendCars();
  const { inquiries, loading: inquiriesLoading } = useBackendInquiries();

  const recentCars = cars.slice(0, 5);
  const recentInquiries = inquiries.slice(0, 5);

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back to Wajdan Motors Admin Panel</p>
          </motion.div>

          {/* Stats */}
          <div className="mb-8">
            <DashboardStats />
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Cars */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold flex items-center gap-2">
                  <CarIcon className="w-5 h-5 text-primary" />
                  Recent Cars
                </h2>
                <Link to="/admin/cars" className="text-sm text-primary hover:underline">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {recentCars.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No cars added yet</p>
                ) : (
                  recentCars.map((car) => (
                    <div key={car.id} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl">
                      <img
                        src={car.primary_image || car.images?.[0] || '/uploads/placeholder.png'}
                        alt={car.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{car.name}</p>
                        <p className="text-xs text-muted-foreground">{car.price}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          car.status === "available"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {car.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Recent Inquiries */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Recent Inquiries
                </h2>
                <Link to="/admin/inquiries" className="text-sm text-primary hover:underline">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {recentInquiries.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No inquiries yet</p>
                ) : (
                  recentInquiries.map((inquiry) => (
                    <div key={inquiry.id} className="p-3 bg-secondary/30 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{inquiry.name}</p>
                          <p className="text-xs text-muted-foreground">{inquiry.car_name}</p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            inquiry.status === "new"
                              ? "bg-blue-500/10 text-blue-500"
                              : inquiry.status === "contacted"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-green-500/10 text-green-500"
                          }`}
                        >
                          {inquiry.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-primary/5 rounded-2xl border border-primary/20 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-bold mb-1">Quick Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Add high-quality images to attract more buyers</li>
                  <li>• Respond to inquiries promptly via WhatsApp</li>
                  <li>• Keep vehicle details and pricing up-to-date</li>
                  <li>• Update car status when sold</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import CarForm from "@/components/admin/CarForm";
import { useBackendCars, type Car } from "@/hooks/useBackendCars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Pencil, Trash2, Check, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminCars() {
  const navigate = useNavigate();
  const { cars, loading, addCar, updateCar, deleteCar } = useBackendCars();
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | undefined>();
  const { toast } = useToast();

  const filteredCars = cars.filter((car) =>
    car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (car.make ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCar = async (data: Omit<Car, "id" | "created_at" | "updated_at">) => {
    const result = await addCar(data);
    if (result.success) {
      setShowForm(false);
      toast({ title: "Car Added", description: `${data.name} has been added to inventory.` });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const handleUpdateCar = async (data: Omit<Car, "id" | "created_at" | "updated_at">) => {
    if (!editingCar) return;
    const result = await updateCar(editingCar.id, data);
    if (result.success) {
      setEditingCar(undefined);
      setShowForm(false);
      toast({ title: "Car Updated", description: `${data.name} has been updated.` });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const handleDeleteCar = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const result = await deleteCar(id);
      if (result.success) {
        toast({ title: "Car Deleted", description: `${name} has been removed.` });
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    }
  };

  const handleMarkSold = async (car: Car) => {
    const newStatus = car.status === "sold" ? "available" : "sold";
    const result = await updateCar(car.id, { status: newStatus });
    if (result.success) {
      toast({
        title: newStatus === "sold" ? "Marked as Sold" : "Marked as Available",
        description: `${car.name} status updated.`,
      });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const handleViewCar = (carId: number) => {
    navigate(`/inventory/${carId}`);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-heading font-bold">Manage Cars</h1>
              <p className="text-muted-foreground">{cars.length} vehicles in inventory</p>
            </div>
            <Button
              onClick={() => { setEditingCar(undefined); setShowForm(true); }}
              className="bg-primary hover:bg-primary/90 gap-2"
              disabled={loading}
            >
              <Plus className="w-4 h-4" />
              Add New Car
            </Button>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cars..."
                className="pl-10"
              />
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && <p className="text-muted-foreground">Loading cars...</p>}

          {/* Cars Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl border border-border overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-sm">Car</th>
                    <th className="text-left p-4 font-medium text-sm hidden md:table-cell">Year</th>
                    <th className="text-left p-4 font-medium text-sm">Price</th>
                    <th className="text-left p-4 font-medium text-sm hidden lg:table-cell">Mileage</th>
                    <th className="text-left p-4 font-medium text-sm">Status</th>
                    <th className="text-right p-4 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredCars.map((car) => (
                      <motion.tr
                        key={car.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-t border-border hover:bg-secondary/20"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={car.primary_image || car.images?.[0] || '/uploads/placeholder.png'}
                              alt={car.name}
                              className="w-14 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-sm">{car.name}</p>
                              <p className="text-xs text-muted-foreground capitalize">{car.make} • {car.body_type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell text-sm">{car.year}</td>
                        <td className="p-4 text-sm font-medium">{car.price}</td>
                        <td className="p-4 hidden lg:table-cell text-sm text-muted-foreground">{car.mileage}</td>
                        <td className="p-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              car.status === "available"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            {car.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewCar(car.id)}
                              className="h-8 w-8 text-primary hover:text-primary/80"
                              title="View Car"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMarkSold(car)}
                              className="h-8 w-8"
                              title={car.status === "sold" ? "Mark Available" : "Mark Sold"}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => { setEditingCar(car); setShowForm(true); }}
                              className="h-8 w-8"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteCar(car.id, car.name)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {filteredCars.length === 0 && !loading && (
                <div className="text-center py-12 text-muted-foreground">
                  {searchQuery ? "No cars match your search" : "No cars in inventory. Add your first car!"}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Car Form Modal */}
      {showForm && (
        <CarForm
          car={editingCar}
          onSubmit={editingCar ? handleUpdateCar : handleAddCar}
          onCancel={() => { setShowForm(false); setEditingCar(undefined); }}
        />
      )}
    </div>
  );
}

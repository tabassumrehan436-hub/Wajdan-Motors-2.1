import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car } from "@/hooks/useBackendCars";
import { X, Upload, Trash2 } from "lucide-react";

interface CarFormProps {
  car?: Car;
  onSubmit: (data: Omit<Car, "id">) => void;
  onCancel: () => void;
}

// Top Pakistan car brands
const PAKISTAN_CAR_BRANDS = [
  "toyota", "honda", "suzuki", "haval", "kia", "hyundai", "datsun", "changan",
  "faw", "baic", "maserati", "porsche", "bmw", "mercedes", "audi", "volkswagen",
  "peugeot", "renault", "mitsubishi", "nissan", "jeep", "chevrolet", "ford",
  "tesla", "lamborghini", "ferrari", "rolls-royce", "bentley", "jaguar", "infiniti",
  "aston-martin", "mclaren", "bugatti", "pagani"
];

export default function CarForm({ car, onSubmit, onCancel }: CarFormProps) {
  const [formData, setFormData] = useState({
    name: car?.name || "",
    price: car?.price ? String(car.price) : "",
    year: car?.year ? String(car.year) : String(new Date().getFullYear()),
    mileage: car?.mileage ? String(car.mileage) : "",
    make: (car?.make as string) || "",
    body_type: (car?.body_type as string) || "",
    status: car?.status || "available",
    engine: car?.engine || "",
    transmission: car?.transmission || "Automatic",
    fuel_type: (car?.fuel_type as string) || "Petrol",
    color: car?.color || "",
    primary_image: car?.primary_image || "",
    images: car?.images || [],
    description: car?.description || "",
    seating: car?.seating ? String(car.seating) : "5",
    features: Array.isArray(car?.features) ? (car.features as string[]).join(", ") : (car?.features as string) || "",
  });

  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const priceValue = Number(formData.price) || 0;
    const featuresList = formData.features
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);
    
    // map to backend-friendly shape (use snake_case keys only)
    onSubmit({
      name: formData.name,
      price: priceValue,
      make: formData.make,
      body_type: formData.body_type,
      year: Number(formData.year) || null,
      mileage: Number(String(formData.mileage).replace(/\D/g, '')) || 0,
      status: formData.status === "sold" ? "sold" : "available",
      engine: formData.engine,
      transmission: formData.transmission,
      fuel_type: formData.fuel_type,
      color: formData.color,
      seating: Number(formData.seating) || null,
      description: formData.description,
      features: featuresList,
      primary_image: formData.primary_image || formData.images[0] || "",
      images: formData.images.length > 0 ? formData.images : undefined,
    });
  };

  // Handle file input change
  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, base64],
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-heading font-bold">
            {car ? "Edit Car" : "Add New Car"}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-secondary rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2">
              <Label>Car Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Toyota Corolla GLi"
                required
              />
            </div>

            {/* Make */}
            <div>
              <Label>Make *</Label>
              <Select
                value={formData.make}
                onValueChange={(v) => setFormData({ ...formData, make: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
                <SelectContent>
                  {PAKISTAN_CAR_BRANDS.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand.charAt(0).toUpperCase() + brand.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Body Type */}
            <div>
              <Label>Body Type *</Label>
              <Select
                value={formData.body_type}
                onValueChange={(v) => setFormData({ ...formData, body_type: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="hatchback">Hatchback</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Year */}
            <div>
              <Label>Year *</Label>
              <Input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2024"
                required
                min="1900"
                max="2100"
              />
            </div>

            {/* Price */}
            <div>
              <Label>Price (PKR) *</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                onFocus={(e) => e.target.select()}
                placeholder="10000000"
                required
                min="0"
              />
            </div>

            {/* Mileage */}
            <div>
              <Label>Mileage *</Label>
              <Input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                placeholder="25000"
                required
                min="0"
              />
            </div>

            {/* Status */}
            <div>
              <Label>Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v as "available" | "sold" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Engine */}
            <div>
              <Label>Engine</Label>
              <Input
                value={formData.engine}
                onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                placeholder="1.8L VTEC"
              />
            </div>

            {/* Transmission */}
            <div>
              <Label>Transmission</Label>
              <Select
                value={formData.transmission}
                onValueChange={(v) => setFormData({ ...formData, transmission: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Automatic">Automatic</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="CVT">CVT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fuel Type */}
            <div>
              <Label>Fuel Type</Label>
              <Select
                value={formData.fuel_type}
                onValueChange={(v) => setFormData({ ...formData, fuel_type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Petrol">Petrol</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                  <SelectItem value="CNG">CNG</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Color */}
            <div>
              <Label>Color</Label>
              <Input
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="White"
              />
            </div>

            {/* Seating */}
            <div>
              <Label>Seating</Label>
              <Select
                value={formData.seating}
                onValueChange={(v) => setFormData({ ...formData, seating: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Seater</SelectItem>
                  <SelectItem value="4">4 Seater</SelectItem>
                  <SelectItem value="5">5 Seater</SelectItem>
                  <SelectItem value="6">6 Seater</SelectItem>
                  <SelectItem value="7">7 Seater</SelectItem>
                  <SelectItem value="8">8 Seater</SelectItem>
                  <SelectItem value="9">9 Seater</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <Label>Primary Image URL</Label>
              <Input
                value={formData.primary_image}
                onChange={(e) => setFormData({ ...formData, primary_image: e.target.value })}
                placeholder="https://example.com/car-image.jpg"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty to use first uploaded image or default placeholder
              </p>
            </div>

            {/* Multiple Images Upload */}
            <div className="md:col-span-2">
              <Label>Additional Images (Drag & Drop or Click)</Label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Drag and drop images here</p>
                <p className="text-xs text-muted-foreground">or click to select from your computer</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* Image Preview Grid */}
              {formData.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-3">Uploaded Images ({formData.images.length})</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Additional details about the car..."
                rows={3}
              />
            </div>

            {/* Key Features */}
            <div className="md:col-span-2">
              <Label>Key Features</Label>
              <Textarea
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="Enter features separated by commas (e.g., Sunroof, Leather Seats, 360° Camera, Cruise Control)"
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separate features with commas
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
              {car ? "Update Car" : "Add Car"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

import Navbar from "@/components/Navbar";
import Inventory from "@/components/Inventory";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMake, setSelectedMake] = useState<string>("all");
  const [selectedPrice, setSelectedPrice] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedBodyType, setSelectedBodyType] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = selectedMake !== "all" || selectedPrice !== "all" || selectedYear !== "all" || selectedBodyType !== "all";

  const clearFilters = () => {
    setSelectedMake("all");
    setSelectedPrice("all");
    setSelectedYear("all");
    setSelectedBodyType("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden pt-0">
      <Navbar />
      <Breadcrumbs />
      
      {/* Inventory Header & Filters */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card border-b border-border py-6 sm:py-8 md:py-12"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-black uppercase tracking-tight"
            >
              Current Inventory
            </motion.h1>
            
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Button 
                  variant="ghost" 
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-primary gap-2 text-xs sm:text-sm"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  Clear All
                </Button>
              </motion.div>
            )}
          </div>
          
          {/* Search & Filter Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-3 sm:gap-4 bg-background p-3 sm:p-4 rounded-lg sm:rounded-2xl border border-border shadow-sm"
          >
            {/* Search Row */}
            <div className="flex gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search by make, model..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 sm:h-12 pl-10 sm:pl-12 pr-3 sm:pr-4 rounded-lg sm:rounded-xl bg-secondary/30 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-xs sm:text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Button 
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-10 sm:h-12 px-3 sm:px-4 rounded-lg sm:rounded-xl border-border md:hidden gap-2 text-xs sm:text-sm"
              >
                <SlidersHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Filters</span>
              </Button>
            </div>

            {/* Filters Row - Always visible on desktop, toggleable on mobile */}
            <AnimatePresence>
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className={`${showFilters ? 'flex' : 'hidden md:flex'} flex-col sm:grid sm:grid-cols-2 md:flex md:flex-row gap-2 sm:gap-3 md:gap-3`}
              >
                {/* Make Filter */}
                <div className="flex-1 min-w-0">
                  <Select value={selectedMake} onValueChange={setSelectedMake}>
                    <SelectTrigger className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-border bg-secondary/30 text-xs sm:text-sm">
                      <SelectValue placeholder="All Makes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Makes</SelectItem>
                      <SelectItem value="toyota">Toyota</SelectItem>
                      <SelectItem value="honda">Honda</SelectItem>
                      <SelectItem value="haval">Haval</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Filter */}
                <div className="flex-1 min-w-0">
                  <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                    <SelectTrigger className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-border bg-secondary/30 text-xs sm:text-sm">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Price</SelectItem>
                      <SelectItem value="under10">Under 10M</SelectItem>
                      <SelectItem value="10to20">10M - 20M</SelectItem>
                      <SelectItem value="20to50">20M - 50M</SelectItem>
                      <SelectItem value="above50">Above 50M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Year Filter */}
                <div className="flex-1 min-w-0">
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-border bg-secondary/30 text-xs sm:text-sm">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="older">2021 & Older</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Body Type Filter */}
                <div className="flex-1 min-w-0">
                  <Select value={selectedBodyType} onValueChange={setSelectedBodyType}>
                    <SelectTrigger className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-border bg-secondary/30 text-xs sm:text-sm">
                      <SelectValue placeholder="Body Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="hatchback">Hatchback</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="h-10 sm:h-12 px-4 sm:px-8 rounded-lg sm:rounded-xl bg-primary text-primary-foreground font-bold uppercase tracking-wider hover:bg-primary/90 btn-shine text-xs sm:text-sm col-span-2 sm:col-span-1 md:col-span-auto">
                  Apply
                </Button>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      <div className="bg-background relative">
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
        />
        <div className="relative z-10">
          <Inventory 
            searchQuery={searchQuery}
            selectedMake={selectedMake}
            selectedPrice={selectedPrice}
            selectedYear={selectedYear}
            selectedBodyType={selectedBodyType}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

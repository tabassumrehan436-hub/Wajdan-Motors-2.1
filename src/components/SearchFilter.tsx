import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SearchFilter() {
  return (
    <div className="container mx-auto px-4 sm:px-6 relative z-30 mt-4 sm:mt-6">
      <div className="bg-card rounded-lg sm:rounded-xl shadow-2xl shadow-foreground/5 p-3 sm:p-4 md:p-6 flex flex-col lg:flex-row items-stretch lg:items-center gap-3 sm:gap-4 border border-border">
        
        {/* Brand */}
        <div className="w-full lg:w-1/5 space-y-1">
          <label className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Brand</label>
          <Select>
            <SelectTrigger className="w-full border-none shadow-none text-base sm:text-lg font-bold p-0 h-auto focus:ring-0">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="toyota">Toyota</SelectItem>
              <SelectItem value="honda">Honda</SelectItem>
              <SelectItem value="audi">Audi</SelectItem>
              <SelectItem value="mercedes">Mercedes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="hidden lg:block w-[1px] h-10 bg-border" />

        {/* Model */}
        <div className="w-full lg:w-1/5 space-y-1">
          <label className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Model</label>
          <Select>
            <SelectTrigger className="w-full border-none shadow-none text-base sm:text-lg font-bold p-0 h-auto focus:ring-0">
              <SelectValue placeholder="All Models" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lc300">Land Cruiser</SelectItem>
              <SelectItem value="civic">Civic</SelectItem>
              <SelectItem value="fortuner">Fortuner</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="hidden lg:block w-[1px] h-10 bg-border" />

        {/* Year */}
        <div className="w-full lg:w-1/5 space-y-1">
          <label className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Year</label>
          <Select>
            <SelectTrigger className="w-full border-none shadow-none text-base sm:text-lg font-bold p-0 h-auto focus:ring-0">
              <SelectValue placeholder="2024" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="hidden lg:block w-[1px] h-10 bg-border" />

        {/* Price */}
        <div className="w-full lg:w-1/5 space-y-1">
          <label className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Price (PKR)</label>
          <Select>
            <SelectTrigger className="w-full border-none shadow-none text-base sm:text-lg font-bold p-0 h-auto focus:ring-0">
              <SelectValue placeholder="Any Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5m">Under 5 Million</SelectItem>
              <SelectItem value="10m">5 - 10 Million</SelectItem>
              <SelectItem value="20m">10 - 20 Million</SelectItem>
              <SelectItem value="50m">20 - 50 Million</SelectItem>
              <SelectItem value="above">Above 50 Million</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button className="w-full lg:w-auto h-10 sm:h-12 px-6 sm:px-8 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm gap-2 btn-shine">
          <Search className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Search</span>
          <span className="sm:hidden">Go</span>
        </Button>
      </div>
    </div>
  );
}

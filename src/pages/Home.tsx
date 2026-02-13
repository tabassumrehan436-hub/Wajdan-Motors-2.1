import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchFilter from "@/components/SearchFilter";
import FeaturedCars from "@/components/FeaturedCars";
import Inventory from "@/components/Inventory";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden pt-0">
      <Navbar />
      <Hero />
      <SearchFilter />
      <FeaturedCars />
      <Inventory title="Recently Added" />
      <Testimonials />
      <Footer />
    </div>
  );
}

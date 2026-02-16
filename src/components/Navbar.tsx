import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, Heart, Phone, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import logo from "@/assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === "/") {
        const isScrolled = window.scrollY > 20;
        setScrolled(isScrolled);
        document.body.classList.toggle("bg-dark-surface", isScrolled);
      } else {
        // Non-home pages: always use dark background from the top
        setScrolled(true);
        document.body.classList.add("bg-dark-surface");
      }
    };

    // Initialize state based on current location/scroll
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Clean up any class we added when component unmounts
      document.body.classList.remove("bg-dark-surface");
    };
  }, [location.pathname]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/inventory", label: "Car Catalog" },
    { href: "/financing", label: "Financing" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <nav
        className={`top-0 left-0 right-0 z-50 transition-all duration-300 ease-out w-full ${
          scrolled ? 'fixed bg-dark-surface shadow-md' : 'absolute bg-transparent'
        }`}
        role="navigation"
        style={
          scrolled
            ? { margin: 0, padding: 0 }
            : { margin: 0, padding: 0 }
        }
      >
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          
          {/* Left: Logo & Nav */}
          <div className="flex items-center gap-6 sm:gap-8 lg:gap-12">
            {/* Logo */}
            <Link to="/" className="relative z-50 group block shrink-0">
              <img
                src={logo}
                alt="Bloodline Motors FSD"
                className={`h-10 sm:h-12 md:h-14 w-auto max-w-[140px] sm:max-w-[160px] md:max-w-[200px] object-contain transition-all duration-300 ease-out ${
                  scrolled ? 'brightness-0 invert' : 'brightness-100 invert-0'
                }`}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-xs sm:text-sm font-medium transition-colors duration-300 ease-out ${
                    location.pathname === link.href
                      ? 'text-primary'
                      : scrolled
                      ? 'text-white hover:text-primary'
                      : 'text-white hover:text-white/80'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <Link to="/inventory" className={`hidden sm:flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-300 ease-out ${scrolled ? 'bg-white/5 text-white hover:bg-white/15' : 'bg-white/10 text-white hover:bg-white/20'}`}>
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            
            {/* Wishlist Button */}
            <Link to="/wishlist" className={`hidden sm:flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-300 ease-out relative ${scrolled ? 'bg-white/5 text-white hover:bg-white/15' : 'bg-white/10 text-white hover:bg-white/20'}`}>
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Phone */}
            <a href="tel:+923134959787" className={`hidden sm:flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-300 ${scrolled ? 'bg-white/5 text-white hover:bg-white/15' : 'bg-white/10 text-white hover:bg-white/20'}`} aria-label="Call">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>

            {/* WhatsApp */}
            <a href="https://wa.me/923134959787" target="_blank" rel="noopener noreferrer" className={`hidden sm:flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-300 ${scrolled ? 'bg-[#25D366] text-white hover:bg-[#25D366]/90' : 'bg-[#25D366] text-white hover:bg-[#25D366]/90'}`} aria-label="WhatsApp">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden relative z-50 p-2 transition-colors duration-300 ease-out text-white`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Placeholder to avoid layout shift when navbar becomes fixed */}
      {scrolled && <div aria-hidden className="w-full h-14 sm:h-16 md:h-20" />}

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div 
          className={`absolute inset-0 bg-dark-surface transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
        />
        <div className={`absolute inset-y-0 right-0 w-full max-w-sm bg-dark-surface border-l border-white/10 px-4 py-6 sm:px-8 sm:py-8 pt-20 sm:pt-24 transition-transform duration-500 overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                to={link.href} 
                onClick={() => setIsOpen(false)}
                className={`text-xl sm:text-2xl font-heading font-bold transition-colors ${
                  location.pathname === link.href 
                    ? "text-primary" 
                    : "text-white hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-4 mt-6">
              <Link to="/inventory" className="w-full flex items-center gap-3 min-h-[48px] py-3 px-4 rounded-lg bg-secondary text-foreground font-bold text-base transition-transform duration-150 active:scale-95" onClick={() => setIsOpen(false)}>
                <Search className="w-5 h-5" />
                <span>Search</span>
              </Link>

              <Link to="/wishlist" onClick={() => setIsOpen(false)} className="w-full flex items-center gap-3 min-h-[48px] py-3 px-4 rounded-lg bg-secondary/20 text-white font-bold border border-white/20 text-base transition-transform duration-150 active:scale-95">
                <Heart className="w-5 h-5" />
                <span>Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</span>
              </Link>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <a href="tel:+923134959787" onClick={() => setIsOpen(false)} className="w-full flex items-center gap-3 min-h-[52px] py-3 px-4 rounded-lg bg-white text-dark-surface font-bold border border-white/10 text-base transition-transform duration-150 active:scale-95">
                <Phone className="w-5 h-5" />
                <span>Call</span>
              </a>
              <a href="https://wa.me/923134959787" target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-3 min-h-[52px] py-3 px-4 rounded-lg bg-[#25D366] text-white font-bold text-base transition-transform duration-150 active:scale-95">
                <MessageSquare className="w-5 h-5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

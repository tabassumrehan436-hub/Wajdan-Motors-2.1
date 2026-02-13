import { Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { getSiteSettings } from "@/lib/siteSettings";
import { useState, useEffect } from "react";

export default function Footer() {
  const [settings, setSettings] = useState(typeof window !== 'undefined' ? getSiteSettings() : {});

  useEffect(() => {
    const handler = (e: Event) => setSettings(typeof window !== 'undefined' ? getSiteSettings() : {});
    window.addEventListener('siteSettingsUpdated', handler);
    return () => window.removeEventListener('siteSettingsUpdated', handler);
  }, []);

  const phoneDisplay = settings.phone || '+92-324-7718001';
  const phoneHref = `tel:${(settings.phone || '+92-324-7718001').replace(/\D/g, '')}`;
  const waHref = settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber}` : 'https://wa.me/923247718001';

  return (
    <footer className="w-full bg-dark-surface border-t border-white/10 pt-12 sm:pt-16 md:pt-20 pb-6 sm:pb-8 md:pb-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 sm:mb-16 gap-6 sm:gap-0">
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-dark-surface-foreground tracking-tighter">
              WAJDAN <span className="text-primary">MOTORS</span>
            </h2>
          </div>

          <div className="flex justify-center items-center gap-6 sm:gap-7 md:gap-8">
            <a href="https://www.facebook.com/Wajdanmotorsfsd/?utm_source=ig&utm_medium=social&utm_content=link_in_bio" aria-label="Visit our Facebook page" target="_blank" rel="noopener noreferrer" className="social-icon-enhanced text-white hover:text-white transition-all duration-300 transform hover:scale-110">
              <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a href="https://www.instagram.com/wajdanexecutive?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" aria-label="Visit our Instagram profile" target="_blank" rel="noopener noreferrer" className="social-icon-enhanced text-white hover:text-white transition-all duration-300 transform hover:scale-110">
              <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a href="https://www.tiktok.com/@wajdanmotorsfsd?_t=8no3yY3oIFt&_r=1&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnF65FLOc44lCsbcPzf0-ARKBwC6RedsAlYKI0nyxvLuE3FqwqKmwAMKaoVp4_aem_nQ3hERBqRfRIzUDbsGJyfQ" aria-label="Visit our TikTok account" target="_blank" rel="noopener noreferrer" className="social-icon-enhanced text-white hover:text-white transition-all duration-300 transform hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" aria-hidden>
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.08 1.61 2.88 2.88 0 0 1 4.07-4.09v-3.45a6.47 6.47 0 0 0-5.79 10.4 6.47 6.47 0 0 0 10.86-5.06v-5.01a8.62 8.62 0 0 0 5.06 1.67V9.73a4.85 4.85 0 0 1-1.43-.21z" />
              </svg>
            </a>
            <a href="https://www.youtube.com/janbazjb" aria-label="Visit our YouTube channel" target="_blank" rel="noopener noreferrer" className="social-icon-enhanced text-white hover:text-white transition-all duration-300 transform hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" aria-hidden>
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div>
            <h4 className="text-white font-bold mb-3 sm:mb-4 uppercase text-xs sm:text-sm tracking-wide">Quick Links</h4>
            <div className="space-y-1.5 sm:space-y-2">
              <Link to="/" className="block text-white/50 hover:text-primary text-xs sm:text-sm transition-colors">Home</Link>
              <Link to="/inventory" className="block text-white/50 hover:text-primary text-xs sm:text-sm transition-colors">Inventory</Link>
              <Link to="/financing" className="block text-white/50 hover:text-primary text-xs sm:text-sm transition-colors">Financing</Link>
              <Link to="/contact" className="block text-white/50 hover:text-primary text-xs sm:text-sm transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 sm:mb-4 uppercase text-xs sm:text-sm tracking-wide">Services</h4>
            <div className="space-y-1.5 sm:space-y-2">
              <a href="#" className="block text-white/50 hover:text-primary text-xs sm:text-sm transition-colors">Car Sales</a>
              <a href="#" className="block text-white/50 hover:text-primary text-xs sm:text-sm transition-colors">Trade-In</a>
              <a href="#" className="block text-white/50 hover:text-primary text-xs sm:text-sm transition-colors">Financing</a>
              <a href="#" className="block text-white/50 hover:text-primary text-xs sm:text-sm transition-colors">Warranty</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 sm:mb-4 uppercase text-xs sm:text-sm tracking-wide">Contact</h4>
            <div className="space-y-1.5 sm:space-y-2 text-white/50 text-xs sm:text-sm">
              <a href="https://maps.app.goo.gl/PjB8d4zCLHqWYwhE6" target="_blank" rel="noopener noreferrer" className="block cursor-pointer hover:text-primary transition-colors">
                <p>Canal Road, Near McDonald's</p>
                <p>Faisalabad, Pakistan</p>
              </a>
              <p>
                <a href="tel:+923247718001" className="text-primary hover:underline">+92-324-7718001</a>
              </p>
              <p>
                <a href="https://wa.me/923247718001" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-white/60 hover:text-primary transition-colors gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" aria-hidden>
                    <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.37 0 .03 5.34.03 12c0 2  .52 3.94 1.5 5.64L0 24l6.6-1.73A11.94 11.94 0 0012 24c6.63 0 11.97-5.34 11.97-12 0-1.97-.45-3.85-1.45-5.52zM12 21.5c-1.9 0-3.72-.5-5.3-1.43l-.38-.22-3.92 1.03 1.05-3.82-.25-.39A9.48 9.48 0 012.5 12c0-5.25 4.25-9.5 9.5-9.5S21.5 6.75 21.5 12 17.25 21.5 12 21.5z" />
                    <path d="M17.2 14.1c-.3-.2-1.8-.9-2-.9-.2 0-.3-.2-.6.2s-.7.9-.9 1.1c-.2.2-.4.3-.7.1-.9-.5-2.3-1.5-3.2-2.6-.2-.3 0-.5.2-.7.2-.2.3-.4.5-.6.2-.2.2-.4.3-.6 0-.2 0-.4-.1-.6-.1-.2-.9-2.2-1.2-3-.3-.8-.6-.6-.8-.6-.2 0-.4 0-.6 0-.2 0-.6.1-.9.5-.3.4-1 1-1 2.4s1 2.8 1.1 3c.1.2 1.9 3 4.6 4.4 3 .6 3.3.5 3.8.5.5 0 1.6-.6 1.8-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.6-.4z" />
                  </svg>
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 sm:mb-4 uppercase text-xs sm:text-sm tracking-wide">Hours</h4>
            <div className="space-y-1.5 sm:space-y-2 text-white/50 text-xs sm:text-sm">
              {settings.workingHours ? (
                settings.workingHours.split(/,|\n/).map((line, idx) => (
                  <p key={idx}>{line.trim()}</p>
                ))
              ) : (
                <>
                  <p>Mon - Sat: 10:00 AM - 8:00 PM</p>
                  <p>Sunday: 12:00 PM - 6:00 PM</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] sm:text-xs text-white/30 gap-4 sm:gap-0">
          <p>© {new Date().getFullYear()} Wajdan Motors Faisalabad. All rights reserved.</p>
          <div className="flex space-x-4 sm:space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

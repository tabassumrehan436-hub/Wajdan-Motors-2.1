export default function Brands() {
  const brands = [
    { name: "Ford", logo: "Ford" },
    { name: "BMW", logo: "BMW" },
    { name: "VW", logo: "VW" },
    { name: "Audi", logo: "Audi" },
  ];

  const otherBrands = [
    ["Audi", "Alfa Romeo", "BMW", "Can-Am", "Chevrolet", "Citroen", "Dacia", "Dodge", "Ford", "Honda", "Toyota", "Volvo"],
    ["Hyundai", "KIA", "Mazda", "Mini", "Mitsubishi", "Nissan", "Opel", "Peugeot", "Renault", "Seat", "Volkswagen"]
  ];

  return (
    <section className="w-full py-10 sm:py-12 md:py-16 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12">
          
          {/* Left: Popular Brands */}
          <div className="w-full lg:w-1/3">
            <h3 className="text-xs sm:text-sm font-bold text-foreground mb-1 sm:mb-2 uppercase tracking-wide">Explore the Most Popular</h3>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-6 sm:mb-8 font-heading">Car Brands</h2>
            
            <div className="space-y-2 sm:space-y-3">
              {brands.map((brand, i) => (
                <div 
                  key={i} 
                  className={`flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl border cursor-pointer transition-all ${
                    i === 2 
                      ? 'bg-dark-surface text-dark-surface-foreground border-dark-surface' 
                      : 'bg-card text-foreground border-border hover:border-primary/30'
                  }`}
                >
                  <span className="font-bold text-sm sm:text-base">{brand.name}</span>
                  <span className="opacity-50 text-xl sm:text-2xl font-heading">{brand.logo}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: List */}
          <div className="w-full lg:w-2/3">
            <div className="mb-6 sm:mb-8">
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                Browse Our Wide Range of Cars and Find Your Perfect Vehicle to Match Your Style and Needs. We Offer Various Car Brands.
              </p>
              <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase mt-3 sm:mt-4">Other Brands</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-1 sm:gap-y-2">
              {otherBrands[0].map((brand, i) => (
                <div key={`col1-${i}`} className="flex justify-between text-[11px] sm:text-xs font-medium text-foreground/80 py-0.5 sm:py-1 hover:text-primary cursor-pointer border-b border-dashed border-border">
                  <span>{brand}</span>
                  <span className="text-muted-foreground/40 hidden sm:inline">{Math.floor(Math.random() * 20)}</span>
                </div>
              ))}
              {otherBrands[1].map((brand, i) => (
                <div key={`col2-${i}`} className="flex justify-between text-[11px] sm:text-xs font-medium text-foreground/80 py-0.5 sm:py-1 hover:text-primary cursor-pointer border-b border-dashed border-border">
                  <span>{brand}</span>
                  <span className="text-muted-foreground/40 hidden sm:inline">{Math.floor(Math.random() * 20)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

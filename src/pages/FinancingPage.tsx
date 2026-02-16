import Navbar from "@/components/Navbar";
import WhyUs from "@/components/WhyUs";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import heroImage from "@/assets/hero-wajdan-wide.jpg";
import { Button } from "@/components/ui/button";
import { Calculator, Percent, Calendar, AlertCircle } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";

// ============================================================================
// EMI CALCULATION ENGINE - 100% Accurate
// ============================================================================
const calculateEMI = (principal: number, annualRate: number, months: number) => {
  // Input validation
  if (principal <= 0 || months <= 0 || annualRate < 0) {
    return {
      monthlyPayment: 0,
      totalInterest: 0,
      totalPayable: 0,
    };
  }

  // Convert annual rate to monthly rate
  const monthlyRate = annualRate / 100 / 12;

  // Handle zero interest case
  if (monthlyRate === 0) {
    const monthlyPayment = principal / months;
    return {
      monthlyPayment,
      totalInterest: 0,
      totalPayable: principal,
    };
  }

  // EMI Formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
  // Where:
  // P = Principal amount
  // r = Monthly interest rate (as decimal)
  // n = Number of months
  
  try {
    const base = 1 + monthlyRate;
    const powerTerm = Math.pow(base, months);
    
    // Check for numerical stability
    if (!isFinite(powerTerm)) {
      return {
        monthlyPayment: 0,
        totalInterest: 0,
        totalPayable: 0,
      };
    }

    const numerator = principal * monthlyRate * powerTerm;
    const denominator = powerTerm - 1;
    const monthlyPayment = numerator / denominator;
    
    // Calculate total amounts
    const totalPayable = monthlyPayment * months;
    const totalInterest = totalPayable - principal;

    // Validate results
    if (!isFinite(monthlyPayment) || monthlyPayment < 0) {
      return {
        monthlyPayment: 0,
        totalInterest: 0,
        totalPayable: 0,
      };
    }

    return {
      monthlyPayment: Math.abs(monthlyPayment),
      totalInterest: Math.abs(totalInterest),
      totalPayable: Math.abs(totalPayable),
    };
  } catch {
    return {
      monthlyPayment: 0,
      totalInterest: 0,
      totalPayable: 0,
    };
  }
};

// Safe number parsing for integers
const safeParseInt = (value: string): number => {
  const cleaned = value.replace(/[^0-9]/g, "");
  return cleaned === "" ? 0 : parseInt(cleaned, 10);
};

// Safe number parsing for decimals
const safeParseFloat = (value: string): number => {
  const cleaned = value.replace(/[^0-9.]/g, "");
  // Ensure only one decimal point
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    return parseFloat(parts[0] + "." + parts[1]);
  }
  return cleaned === "" ? 0 : parseFloat(cleaned);
};

export default function FinancingPage() {
  // Core state - these drive all calculations
  const [vehiclePrice, setVehiclePrice] = useState(15000000);
  const [downPaymentAmount, setDownPaymentAmount] = useState(4500000);
  const [durationYears, setDurationYears] = useState(5);

  // Display state - what user sees in input fields
  const [priceInput, setPriceInput] = useState("15000000");
  const [downPaymentInput, setDownPaymentInput] = useState("4500000");
  const [durationInput, setDurationInput] = useState("5");

  // Interest Rate (18% per annum)
  const INTEREST_RATE = 18;

  // ============================================================================
  // DERIVED VALUES - All calculated from core state
  // ============================================================================

  // Down payment percentage
  const downPaymentPercent = useMemo(() => {
    if (vehiclePrice <= 0) return 0;
    return (downPaymentAmount / vehiclePrice) * 100;
  }, [vehiclePrice, downPaymentAmount]);

  // Loan amount (principal)
  const loanAmount = useMemo(() => {
    return Math.max(0, vehiclePrice - downPaymentAmount);
  }, [vehiclePrice, downPaymentAmount]);

  // Total months (supports decimals like 3.5 years = 42 months)
  const totalMonths = useMemo(() => {
    const months = durationYears * 12;
    return Math.max(1, months);
  }, [durationYears]);

  // EMI calculation
  const emiData = useMemo(() => {
    return calculateEMI(loanAmount, INTEREST_RATE, totalMonths);
  }, [loanAmount, INTEREST_RATE, totalMonths]);

  // Grand total (down payment + all monthly payments)
  const grandTotal = useMemo(() => {
    return downPaymentAmount + emiData.totalPayable;
  }, [downPaymentAmount, emiData.totalPayable]);

  // ============================================================================
  // FORMAT UTILITIES
  // ============================================================================

  const formatCurrency = useCallback((val: number): string => {
    if (!isFinite(val)) return "0";
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    })
      .format(Math.abs(val))
      .replace("PKR", "")
      .trim();
  }, []);

  const formatNumber = useCallback((val: number, decimals = 2): string => {
    if (!isFinite(val)) return "0";
    return val.toFixed(decimals);
  }, []);

  // ============================================================================
  // EVENT HANDLERS - Vehicle Price
  // ============================================================================

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      setPriceInput(rawValue);
      
      const numValue = safeParseInt(rawValue);
      if (numValue > 0) {
        setVehiclePrice(numValue);
        // Don't maintain percentage here — let the user explicitly set down payment
        // This avoids stale closure issues
      }
    },
    []
  );

  const handlePriceBlur = useCallback(() => {
    const numValue = safeParseInt(priceInput) || 15000000;
    setVehiclePrice(numValue);
    setPriceInput(numValue.toString());
  }, [priceInput]);

  // ============================================================================
  // EVENT HANDLERS - Down Payment
  // ============================================================================

  const handleDownPaymentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      setDownPaymentInput(rawValue);
      
      const numValue = safeParseInt(rawValue);
      // Only update if within valid range: 0 <= down payment <= vehicle price
      if (numValue >= 0 && numValue <= vehiclePrice) {
        setDownPaymentAmount(numValue);
      }
      // If out of range, input updates but amount doesn't — validation on blur
    },
    [vehiclePrice]
  );

  const handleDownPaymentBlur = useCallback(() => {
    let numValue = safeParseInt(downPaymentInput);
    
    // Hard constraints: clamp to [0, vehiclePrice]
    numValue = Math.max(0, numValue);
    numValue = Math.min(numValue, vehiclePrice);
    
    setDownPaymentAmount(numValue);
    setDownPaymentInput(numValue.toString());
  }, [downPaymentInput, vehiclePrice]);

  // ============================================================================
  // EVENT HANDLERS - Duration (now supports decimals like 3.5)
  // ============================================================================

  const handleDurationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setDurationInput(rawValue);
    
    const numValue = safeParseFloat(rawValue);
    if (numValue > 0) {
      setDurationYears(numValue);
    }
  }, []);

  const handleDurationBlur = useCallback(() => {
    let numValue = safeParseFloat(durationInput) || 5;
    numValue = Math.max(0.25, numValue); // Minimum 3 months (0.25 years)
    numValue = Math.min(30, numValue); // Maximum 30 years
    setDurationYears(numValue);
    setDurationInput(formatNumber(numValue, 2));
  }, [durationInput, formatNumber]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Breadcrumbs />
      {/* Hero Header */}
      <div className="bg-dark-surface text-dark-surface-foreground py-12 sm:py-16 md:py-24 relative overflow-hidden">
        <img src={heroImage} alt="Bloodline Motors" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center max-w-4xl">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-black uppercase tracking-tight mb-4 sm:mb-6">
            Premium Auto Financing
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/70 font-light leading-relaxed">
            Partner with Pakistan's leading banks. Drive your dream car home today with our exclusive low-rate financing options.
          </p>
        </div>
      </div>

      {/* Calculator Section */}
      <section className="py-10 sm:py-14 md:py-20 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto bg-card rounded-lg sm:rounded-3xl shadow-2xl border border-border overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calculator className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-heading font-bold uppercase">EMI Calculator</h2>
                  <p className="text-muted-foreground text-xs sm:text-sm">100% Accurate Monthly Payment Calculations</p>
                </div>
              </div>

              {/* Info Box */}
              <div className="mb-6 sm:mb-8 p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/20 flex gap-2 sm:gap-3">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-muted-foreground">
                  All calculations use the standard EMI formula at <strong>{INTEREST_RATE}% annual interest rate</strong>. Enter decimals for duration (e.g., 3.5 years).
                </p>
              </div>

              <div className="space-y-5 sm:space-y-6 md:space-y-8">
                {/* Vehicle Price */}
                <div>
                  <label className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3 block">
                    Vehicle Price (PKR)
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter price (e.g., 2000000)"
                    value={priceInput}
                    onChange={handlePriceChange}
                    onBlur={handlePriceBlur}
                    className="h-10 sm:h-12 md:h-14 text-base sm:text-lg md:text-2xl font-bold border-border bg-background"
                  />
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
                    Formatted: PKR {formatCurrency(vehiclePrice)}
                  </p>
                  <p className="text-[10px] sm:text-xs text-blue-600/70 bg-blue-500/10 p-2 rounded border border-blue-500/20 mt-2">
                    ℹ️ Must be greater than 0. Determines down payment max limit.
                  </p>
                </div>

                {/* Down Payment */}
                <div>
                  <label className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3 block flex items-center gap-2">
                    <Percent className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Down Payment (PKR)
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter down payment amount (e.g., 5000000)"
                    value={downPaymentInput}
                    onChange={handleDownPaymentChange}
                    onBlur={handleDownPaymentBlur}
                    className="h-10 sm:h-12 md:h-14 text-base sm:text-lg md:text-2xl font-bold border-border bg-background mb-2"
                  />
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2">
                    <span>Amount: PKR {formatCurrency(downPaymentAmount)}</span>
                    <span className="text-primary font-bold">({formatNumber(downPaymentPercent, 1)}%)</span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">
                    Loan Amount: PKR {formatCurrency(loanAmount)}
                  </p>
                  <p className="text-[10px] sm:text-xs text-yellow-600/70 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                    ⚠️ Valid range: PKR 0 to {formatCurrency(vehiclePrice)}. Values outside this range will be auto-corrected on blur.
                  </p>
                </div>

                {/* Loan Duration */}
                <div>
                  <label className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3 block flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Loan Duration (Years)
                  </label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="Enter duration (e.g., 5 or 3.5)"
                    value={durationInput}
                    onChange={handleDurationChange}
                    onBlur={handleDurationBlur}
                    className="h-10 sm:h-12 md:h-14 text-base sm:text-lg md:text-2xl font-bold border-border bg-background"
                  />
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
                    Total Months: {formatNumber(totalMonths, 1)} | {formatNumber(totalMonths / 12, 2)} years
                  </p>
                  <p className="text-[10px] sm:text-xs text-blue-600/70 bg-blue-500/10 p-2 rounded border border-blue-500/20 mt-2">
                    ℹ️ Valid range: 0.25 years (3 months) to 30 years. Decimals supported (e.g., 3.5).
                  </p>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-dark-surface p-4 sm:p-6 md:p-8 lg:p-12 text-center">
              <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-widest mb-2">
                Your Estimated Monthly Payment
              </p>
              <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black text-dark-surface-foreground mb-4 sm:mb-6">
                PKR {formatCurrency(emiData.monthlyPayment)}
              </p>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-white/5 rounded-lg p-2 sm:p-4 border border-white/10">
                  <p className="text-white/40 text-[9px] sm:text-xs uppercase mb-1 sm:mb-2">Loan Amount</p>
                  <p className="font-bold text-white text-xs sm:text-base md:text-lg">PKR {formatCurrency(loanAmount)}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 sm:p-4 border border-white/10">
                  <p className="text-white/40 text-[9px] sm:text-xs uppercase mb-1 sm:mb-2">Total Interest</p>
                  <p className="font-bold text-white text-xs sm:text-base md:text-lg">PKR {formatCurrency(emiData.totalInterest)}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 sm:p-4 border border-white/10">
                  <p className="text-white/40 text-[9px] sm:text-xs uppercase mb-1 sm:mb-2">Loan Period</p>
                  <p className="font-bold text-white text-xs sm:text-base md:text-lg">{formatNumber(totalMonths, 0)} months</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 sm:p-4 border border-white/10">
                  <p className="text-white/40 text-[9px] sm:text-xs uppercase mb-1 sm:mb-2">Total EMI Paid</p>
                  <p className="font-bold text-white text-xs sm:text-base md:text-lg">PKR {formatCurrency(emiData.totalPayable)}</p>
                </div>
              </div>

              {/* Grand Total Section */}
              <div className="border-t border-white/10 pt-4 sm:pt-6 mb-6 sm:mb-8">
                <p className="text-white/40 text-[10px] sm:text-xs uppercase mb-2 sm:mb-3">Grand Total (Down Payment + All EMI)</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-primary mb-3 sm:mb-4">
                  PKR {formatCurrency(grandTotal)}
                </p>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-[10px] sm:text-xs text-white/60">
                  <div>
                    <p className="mb-1">Down Payment:</p>
                    <p className="font-bold text-white">PKR {formatCurrency(downPaymentAmount)}</p>
                  </div>
                  <div>
                    <p className="mb-1">Monthly Payment:</p>
                    <p className="font-bold text-white">PKR {formatCurrency(emiData.monthlyPayment)}</p>
                  </div>
                </div>
              </div>

              <p className="text-white/40 text-[9px] sm:text-xs mb-6 sm:mb-8">
                *Calculated using standard EMI formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1)<br/>
                At {INTEREST_RATE}% annual interest rate. Actual rates may vary by lender.
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 sm:h-12 md:h-14 px-6 sm:px-12 rounded-lg font-bold uppercase tracking-wider btn-shine text-xs sm:text-sm md:text-base">
                Apply for Financing
              </Button>
            </div>
          </div>
        </div>
      </section>

      <WhyUs />
      <Footer />
    </div>
  );
}

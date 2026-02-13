import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    /* ========================================
       COMPREHENSIVE BREAKPOINT STRATEGY
       Mobile-first with fluid interpolation
       ======================================== */
    screens: {
      /* Small mobile devices (320px - 480px) */
      xs: "320px",
      
      /* Standard & large smartphones (480px - 768px) */
      sm: "480px",
      
      /* Tablets portrait mode (768px - 1024px) */
      md: "768px",
      
      /* Tablets landscape / iPad (1024px - 1280px) */
      lg: "1024px",
      
      /* Desktop (1280px - 1536px) */
      xl: "1280px",
      
      /* Large desktop (1536px - 1920px) */
      "2xl": "1536px",
      
      /* Extra large desktop (1920px - 2560px) */
      "3xl": "1920px",
      
      /* Ultra-wide displays (2560px+) */
      "4xl": "2560px",
      
      /* Landscape mobile optimizations */
      "landscape": { raw: "(orientation: landscape)" },
      
      /* Portrait mobile optimizations */
      "portrait": { raw: "(orientation: portrait)" },
      
      /* Foldable device support */
      "fold": { raw: "(screen-spanning: single-fold-vertical)" },
      
      /* Touch device detection */
      "touch": { raw: "(hover: none) and (pointer: coarse)" },
      
      /* High DPI / Retina displays */
      "retina": { raw: "(min-resolution: 2dppx)" },
    },

    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        xs: "1rem",
        sm: "1.5rem",
        md: "2rem",
        lg: "2rem",
        xl: "2.5rem",
        "2xl": "3rem",
        "3xl": "4rem",
        "4xl": "5rem",
      },
      screens: {
        xs: "320px",
        sm: "480px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
        "3xl": "1800px",
        "4xl": "2400px",
      },
    },

    extend: {
      fontFamily: {
        sans: ["Lexend Deca", "sans-serif"],
        heading: ["Orbitron", "sans-serif"],
      },

      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "dark-surface": {
          DEFAULT: "hsl(var(--dark-surface))",
          foreground: "hsl(var(--dark-surface-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      /* ========================================
         FLUID SPACING SCALE
         Responsive spacing that scales with viewport
         ======================================== */
      spacing: {
        "safe": "max(1rem, env(safe-area-inset-bottom))",
        
        /* Fluid spacing based on viewport width */
        "fluid-xs": "clamp(0.5rem, 1vw, 1rem)",
        "fluid-sm": "clamp(1rem, 2vw, 1.5rem)",
        "fluid-md": "clamp(1.5rem, 3vw, 2.5rem)",
        "fluid-lg": "clamp(2rem, 4vw, 3rem)",
        "fluid-xl": "clamp(2.5rem, 5vw, 4rem)",
        "fluid-2xl": "clamp(3rem, 6vw, 5rem)",
      },

      /* ========================================
         RESPONSIVE SIZING
         Width, height, and aspect ratio utilities
         ======================================== */
      width: {
        "fluid": "clamp(90vw, 100%, 1280px)",
        "fluid-max": "clamp(90vw, 100%, 1440px)",
        "fluid-ultra": "clamp(90vw, 100%, 2560px)",
      },

      height: {
        "screen-safe": "100dvh",
        "screen-large": "100lvh",
        "screen-small": "100svh",
      },

      maxWidth: {
        "safe": "calc(100% - 2rem)",
        "content": "clamp(90vw, 100%, 1280px)",
        "content-wide": "clamp(90vw, 100%, 1600px)",
        "content-ultra": "clamp(90vw, 100%, 2560px)",
      },

      aspectRatio: {
        "video": "16 / 9",
        "square": "1 / 1",
        "portrait": "3 / 4",
        "wide": "21 / 9",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(50px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "slide-in-right": "slide-in-right 0.6s ease-out forwards",
        "pulse-slow": "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
      },

      /* ========================================
         TRANSITIONS & TRANSFORMS
         Smooth animations across devices
         ======================================== */
      transitionDuration: {
        "250": "250ms",
        "350": "350ms",
        "400": "400ms",
      },

      transitionTimingFunction: {
        "in-out-smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
        "ease-out-smooth": "cubic-bezier(0.4, 0, 0.6, 1)",
      },

      /* ========================================
         SHADOW SYSTEM
         Depth shadows for layered UI
         ======================================== */
      boxShadow: {
        "sm-soft": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "md-soft": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        "lg-soft": "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        "xl-soft": "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

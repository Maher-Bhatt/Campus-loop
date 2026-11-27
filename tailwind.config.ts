import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["IBM Plex Sans", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        display: ["IBM Plex Sans", "system-ui", "-apple-system", "sans-serif"],
        heading: ["IBM Plex Sans", "system-ui", "-apple-system", "sans-serif"],
        body: ["IBM Plex Sans", "system-ui", "-apple-system", "sans-serif"],
        reading: ["Source Serif 4", "Source Serif Pro", "Georgia", "serif"],
        serif: ["Source Serif 4", "Georgia", "serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SF Mono", "Consolas", "monospace"],
      },
      colors: {
        // Neutral scale. "stone" is remapped to a cool neutral so legacy classes match the new system.
        stone: {
          50: "#FAFAFA", 100: "#F4F4F5", 200: "#E4E4E7", 300: "#D4D4D8", 400: "#A1A1AA",
          500: "#71717A", 600: "#52525B", 700: "#3F3F46", 800: "#27272A", 900: "#18181B", 950: "#0B0B0D",
        },
        campus: {
          canvas: "hsl(var(--background))",
          card: "hsl(var(--card))",
          dark: "#18181B",
          blue: "hsl(var(--primary))",
          "blue-hover": "hsl(var(--primary))",
          lime: "hsl(var(--accent))",
          "lime-hover": "hsl(var(--accent))",
          text: "hsl(var(--foreground))",
          muted: "hsl(var(--muted-foreground))",
          border: "hsl(var(--border))",
          "border-light": "hsl(var(--border))",
          "tint-blue": "hsl(var(--accent))",
          "tint-lime": "hsl(var(--secondary))",
          "tint-pink": "hsl(var(--secondary))",
          "tint-purple": "hsl(var(--secondary))",
          "tint-slate": "hsl(var(--secondary))",
          "tint-yellow": "hsl(var(--secondary))",
        },
        brand: {
          canvas: "hsl(var(--background))",
          card: "hsl(var(--card))",
          hover: "hsl(var(--secondary))",
          amber: "hsl(var(--primary))",
          gold: "hsl(var(--primary))",
          crimson: "hsl(var(--destructive))",
          muted: "hsl(var(--muted-foreground))",
          border: "hsl(var(--border))",
        },
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
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
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
        // Deliberately small radii: calm, tool-like surfaces instead of bubbly cards.
        sm: "4px",
        DEFAULT: "6px",
        md: "6px",
        lg: "8px",
        xl: "10px",
        "2xl": "12px",
        "3xl": "14px",
      },
      boxShadow: {
        xs: "0 1px 1px rgb(0 0 0 / 0.04)",
        sm: "0 1px 2px rgb(0 0 0 / 0.05)",
        DEFAULT: "0 1px 2px rgb(0 0 0 / 0.06)",
        md: "0 2px 6px -1px rgb(0 0 0 / 0.08)",
        lg: "0 4px 12px -2px rgb(0 0 0 / 0.10)",
        xl: "0 8px 24px -6px rgb(0 0 0 / 0.14)",
        "2xl": "0 12px 32px -8px rgb(0 0 0 / 0.18)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

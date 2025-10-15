import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx,css,html}", "./components/**/*.{ts,tsx,css,html}", "./app/**/*.{ts,tsx,css,html}", "./src/**/*.{ts,tsx,css,html}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    safelist: [
      // Verification status utilities
      'bg-verified', 'bg-in-progress', 'bg-waiting', 'bg-suspended',
      'text-verified', 'text-in-progress', 'text-waiting', 'text-suspended',
      'border-verified', 'border-in-progress', 'border-waiting', 'border-suspended',

      // Status badges
      'status-verified', 'status-in-progress', 'status-waiting', 'status-suspended',
      'status-badge-verified', 'status-badge-in-progress', 'status-badge-waiting', 'status-badge-suspended',

      // Common utilities that might be purged
      'bg-background', 'text-foreground', 'border-border',
    ],
    extend: {
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
        // Semantic Colors
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          press: "hsl(var(--success-press))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
          press: "hsl(var(--info-press))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          press: "hsl(var(--warning-press))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--danger-foreground))",
          press: "hsl(var(--danger-press))",
        },
        // Table Header
        "table-header": {
          DEFAULT: "hsl(var(--table-header))",
          foreground: "hsl(var(--table-header-foreground))",
        },
        // Verification Status
        verified: {
          DEFAULT: "hsl(var(--verified))",
          foreground: "hsl(var(--verified-foreground))",
        },
        "in-progress": {
          DEFAULT: "hsl(var(--in-progress))",
          foreground: "hsl(var(--in-progress-foreground))",
        },
        waiting: {
          DEFAULT: "hsl(var(--waiting))",
          foreground: "hsl(var(--waiting-foreground))",
        },
        suspend: {
          DEFAULT: "hsl(var(--suspended))",
          foreground: "hsl(var(--suspended-foreground))",
        },
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-accent': 'var(--gradient-accent)',
      },
      boxShadow: {
        'elegant': 'var(--shadow-elegant)',
        'card': 'var(--shadow-card)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities }) {
      addUtilities({
        '.bg-verified': {
          'background-color': 'hsl(var(--verified))',
        },
        '.bg-in-progress': {
          'background-color': 'hsl(var(--in-progress))',
        },
        '.bg-waiting': {
          'background-color': 'hsl(var(--waiting))',
        },
        '.bg-suspended': {
          'background-color': 'hsl(var(--suspended))',
        },
        '.text-verified': {
          'color': 'hsl(var(--verified-foreground))',
        },
        '.text-in-progress': {
          'color': 'hsl(var(--in-progress-foreground))',
        },
        '.text-waiting': {
          'color': 'hsl(var(--waiting-foreground))',
        },
        '.text-suspended': {
          'color': 'hsl(var(--suspended-foreground))',
        },
        '.border-verified': {
          'border-color': 'hsl(var(--verified-foreground))',
        },
        '.border-in-progress': {
          'border-color': 'hsl(var(--in-progress-foreground))',
        },
        '.border-waiting': {
          'border-color': 'hsl(var(--waiting-foreground))',
        },
        '.border-suspended': {
          'border-color': 'hsl(var(--suspended-foreground))',
        },
      });
    }
  ],
} satisfies Config;

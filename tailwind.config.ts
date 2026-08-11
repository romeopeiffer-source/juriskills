import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        night: {
          950: "#05070d",
          900: "#0b0f1a",
          800: "#111726",
          700: "#1a2236",
          600: "#232e47",
        },
        electric: {
          400: "#8f8ad0",
          500: "#6a63b8",
          600: "#4d4696",
        },
        discount: {
          DEFAULT: "#FFD500",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "electric-gradient": "linear-gradient(135deg, #3d3775 0%, #4d4696 50%, #6a63b8 100%)",
      },
      boxShadow: {
        glow: "0 10px 30px -14px rgba(0,0,0,0.55)",
        "glow-lg": "0 20px 45px -18px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Encre Marine / Nuit Longue — fond dominant
        night: {
          950: "#070b14",
          900: "#0B1220",
          800: "#131B2E",
          700: "#1c2740",
          600: "#2a3654",
        },
        // Violet Argumenté — accent d'action principal
        electric: {
          400: "#A78BFA",
          500: "#7C3AED",
          600: "#5B21B6",
        },
        // Laiton Vieilli — signal de confiance uniquement (jamais bouton/fond plein)
        trust: {
          DEFAULT: "#B8935A",
        },
        // Ivoire Papier — texte principal (remplace le blanc pur)
        white: "#F0EBDD",
        // Gris Codifié — texte atténué (très proche de la valeur précédente)
        slate: {
          100: "#F0EBDD",
          400: "#93A0B8",
        },
        // Jaune promo — réservé aux badges de réduction/urgence
        discount: {
          DEFAULT: "#FACC15",
        },
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        sans: ["Segoe UI", "Calibri", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Courier New", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "electric-gradient": "linear-gradient(135deg, #5B21B6 0%, #7C3AED 50%, #A78BFA 100%)",
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

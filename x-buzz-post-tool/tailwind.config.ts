import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          900: "#06070f",
          800: "#0a0b1a",
          700: "#0f1029",
          600: "#161838",
          500: "#1e2048",
        },
        neon: {
          blue: "#3b82f6",
          purple: "#8b5cf6",
          indigo: "#6366f1",
        },
      },
      boxShadow: {
        "neon-blue": "0 0 15px rgba(59, 130, 246, 0.3)",
        "neon-purple": "0 0 15px rgba(139, 92, 246, 0.3)",
        "neon-glow": "0 0 20px rgba(99, 102, 241, 0.2), 0 0 40px rgba(99, 102, 241, 0.1)",
      },
      backgroundImage: {
        "gradient-neon": "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))",
        "gradient-border": "linear-gradient(135deg, #3b82f6, #8b5cf6)",
      },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pomelo-inspired: medium blue accent
        sage: {
          50: "#f0f6fa",
          100: "#d9e8f2",
          200: "#b3d1e6",
          300: "#7eb3d4",
          400: "#4d94bc",
          500: "#3d7ea6",
          600: "#356d92",
          700: "#2d5c7a",
          800: "#254b64",
          900: "#1d3a4e",
        },
        cream: {
          50: "#fefdfb",
          100: "#faf8f3",
          200: "#f5f0e6",
        },
        sand: {
          100: "#f3efe8",
          200: "#e5ddd2",
          300: "#cfc4b5",
        },
        peach: {
          500: "#c96b4d",
          600: "#b85a3d",
          700: "#a04a32",
        },
        ink: {
          300: "#8a8a8a",
          400: "#6b6b6b",
          500: "#4a4a4a",
          600: "#3d3d3d",
          700: "#2d2d2d",
          800: "#222222",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "DM Sans", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Fraunces", "Georgia", "serif"],
      },
      keyframes: {
        typing: {
          "0%, 60%, 100%": { transform: "translateY(0)" },
          "30%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        typing: "typing 0.9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

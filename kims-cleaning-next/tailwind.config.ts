import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brighter botanical palette — spring/lime greens grounded by deep forest.
        cream: "#FAF4E6",
        // Mint field. Alternates with white in big bands below the dark hero.
        wash: "#E7F4C8",
        paper: "#FFFDF8",
        ink: "#16301A",
        muted: "#5A5647",
        line: "#E7E0CC",
        forest: {
          deep: "#153F1A",
          DEFAULT: "#2F6B32",
        },
        grass: "#4E9A36",
        leaf: "#7CC142",
        lime: {
          DEFAULT: "#8FD14F",
          bright: "#C6EE7E",
        },
        gold: {
          DEFAULT: "#E6C200",
          soft: "#F2D63A",
        },
        warn: "#9A4B1F",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-source)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 2px 4px rgba(21,63,26,.05), 0 10px 26px rgba(21,63,26,.09)",
        lift: "0 6px 14px rgba(21,63,26,.08), 0 20px 46px rgba(21,63,26,.14)",
        glow: "0 20px 60px rgba(64,120,40,.30)",
      },
      maxWidth: {
        site: "1180px",
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        rise: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        floaty: "floaty 7s ease-in-out infinite",
        rise: "rise .5s ease both",
      },
    },
  },
  plugins: [],
};

export default config;

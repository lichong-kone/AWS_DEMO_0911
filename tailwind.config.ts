import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // PRD §25 palette + design-v3 tokens
        paper: "#F4EBD8",
        "paper-light": "#FFF9ED",
        "paper-soft": "#F3E8D5",
        moss: "#5B7F3B",
        leaf: "#A7C66B",
        clay: "#C96F4A",
        rain: "#6A8EA0",
        ink: "#2D3A2E",
        line: "#D9CDBA",
        muted: "#8B8170",
        wood: "#684B36",
        gold: "#C5A85A",
      },
      borderRadius: {
        page: "28px",
        card: "20px",
        small: "16px",
      },
      boxShadow: {
        soft: "0 8px 24px rgb(45 58 46 / 0.12)",
      },
      fontFamily: {
        hand: ['"Comic Sans MS"', "ui-rounded", "system-ui", "sans-serif"],
      },
      keyframes: {
        sway: {
          "0%,100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        drift: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(20px)" },
        },
        blink: {
          "0%,92%,100%": { transform: "scaleY(1)" },
          "96%": { transform: "scaleY(0.1)" },
        },
      },
      animation: {
        sway: "sway 5s ease-in-out infinite",
        drift: "drift 12s ease-in-out infinite alternate",
        blink: "blink 4s infinite",
      },
    },
  },
  plugins: [],
};

export default config;

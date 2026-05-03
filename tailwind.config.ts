import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "var(--tnv-void)",
        carbon: "var(--tnv-carbon)",
        steel: "var(--tnv-steel)",
        fog: "var(--tnv-fog)",
        bone: "var(--tnv-bone)",
        paper: "var(--tnv-paper)",
        signal: {
          DEFAULT: "var(--tnv-signal)",
          soft: "var(--tnv-signal-soft)",
        },
        amber: "var(--tnv-amber)",
        crimson: "var(--tnv-crimson)",
        flag: {
          blue: "var(--tnv-flag-blue)",
          red: "var(--tnv-flag-red)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter-tight)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        serif: ["var(--font-instrument-serif)", "ui-serif", "Georgia", "serif"],
      },
      letterSpacing: {
        eyebrow: "0.18em",
        marquee: "0.32em",
      },
      fontSize: {
        eyebrow: ["11px", { lineHeight: "1", letterSpacing: "0.18em" }],
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "pulse-signal": "pulse-signal 2.4s ease-in-out infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-signal": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

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
        // Trainovate brand
        ink: {
          DEFAULT: "var(--tnv-ink)",
          soft: "var(--tnv-ink-soft)",
        },
        bone: {
          DEFAULT: "var(--tnv-bone)",
          soft: "var(--tnv-bone-soft)",
        },
        cobalt: {
          DEFAULT: "var(--tnv-cobalt)",
          soft: "var(--tnv-cobalt-soft)",
          500: "var(--tnv-cobalt)",
        },
        flare: {
          DEFAULT: "var(--tnv-flare)",
          soft: "var(--tnv-flare-soft)",
        },
        steel: "var(--tnv-steel)",
        fog: "var(--tnv-fog)",
        paper: "var(--tnv-paper)",
        crimson: "var(--tnv-crimson)",
        // Aliases — kept so prior component code paths keep compiling
        void: "var(--tnv-ink)",
        carbon: "var(--tnv-ink-soft)",
        signal: {
          DEFAULT: "var(--tnv-cobalt)",
          soft: "var(--tnv-cobalt-soft)",
        },
        amber: "var(--tnv-flare)",
        flag: {
          blue: "var(--tnv-flag-blue)",
          red: "var(--tnv-flag-red)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter-tight)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        // serif token now points at Manrope — used for sub-headings and the
        // italic emphasis word in h1/h2 (no more editorial serif on the site)
        serif: ["var(--font-emphasis)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter-tight)", "ui-sans-serif", "system-ui", "sans-serif"],
        emphasis: ["var(--font-emphasis)", "ui-sans-serif", "system-ui", "sans-serif"],
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
        "marquee-fast": "marquee 28s linear infinite",
        "pulse-signal": "pulse-signal 2.4s ease-in-out infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        blink: "blink 1.2s steps(2, start) infinite",
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
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.25" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

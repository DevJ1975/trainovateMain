import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#FFFFFF",
      black: "#000000",
      ink: "#0A0A0A",
      bone: "#F4F1EA",
      flare: "#FF6B1A",
      cobalt: {
        DEFAULT: "#0046E6",
        500: "#0046E6",
      },
    },
    fontFamily: {
      sans: ['"Inter Tight"', "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      mono: ['"JetBrains Mono"', "SFMono-Regular", "Consolas", "Menlo", "monospace"],
    },
    extend: {},
  },
  plugins: [],
};

export default config;

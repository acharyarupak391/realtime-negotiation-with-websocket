import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        "work-sans": ["Work Sans", "sans-serif"],
      },
      keyframes: {
        fadeFromRight: {
          "0%": {
            opacity: '0',
            transform: "translateX(25%)",
          },
          "100%": {
            opacity: '1',
            transform: "translateX(0)",
          },
        },
        fadeFromLeft: {
          "0%": {
            opacity: '0',
            transform: "translateX(-25%)",
          },
          "100%": {
            opacity: '1',
            transform: "translateX(0)",
          },
        }
      },
      animation: {
        "fade-from-right": "fadeFromRight 0.25s ease-in",
        "fade-from-left": "fadeFromLeft 0.25s ease-in",
      }
    },
  },
  plugins: [],
};
export default config;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#22c55e",
          600: "#16a34a", // brand
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          DEFAULT: "#16a34a",
          foreground: "#ffffff",
          dark: "#22c55e",
        },
        secondary: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0ea5a6", // brand secondary
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          DEFAULT: "#0ea5a6",
          foreground: "#ffffff",
          dark: "#14b8a6",
        },
        background: {
          DEFAULT: "#ffffff",
          dark: "#0b0f14",
        },
        card: {
          DEFAULT: "#f5f7f9",
          dark: "#12171d",
        },
        text: {
          DEFAULT: "#0b0b0b",
          secondary: "#4b5563",
          dark: "#fafafa", // brighter text in dark mode
          "dark-secondary": "#cbd5e1",
        },
        border: {
          DEFAULT: "#e5e7eb",
          dark: "#374151",
        },
        error: "#ef4444",
        success: "#16a34a",
        warning: "#f59e0b",
        info: "#3b82f6",
      },
      fontFamily: {
        sans: ["IRANSans"],
        bold: ["IRANSans-Bold"],
        medium: ["IRANSans-Medium"],
        light: ["IRANSans-Light"],
      },
      borderRadius: {
        xl: 16,
      },
    },
  },
  plugins: [],
};
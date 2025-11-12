/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Theme-aware colors using CSS variables
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        "foreground-secondary": "rgb(var(--color-foreground-secondary) / <alpha-value>)",
        "foreground-tertiary": "rgb(var(--color-foreground-tertiary) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        divider: "rgb(var(--color-divider) / <alpha-value>)",

        // Static primary/secondary colors
        primary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          DEFAULT: "#16a34a",
        },
        secondary: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0ea5a6",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          DEFAULT: "#0ea5a6",
        },
        error: "#dc2626",
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
  plugins: [
    ({ addBase }) =>
      addBase({
        ":root": {
          // Light theme defaults
          "--color-background": "255 255 255",
          "--color-surface": "248 250 248",
          "--color-card": "255 255 255",
          "--color-foreground": "26 26 26",
          "--color-foreground-secondary": "75 85 99",
          "--color-foreground-tertiary": "107 114 128",
          "--color-border": "209 213 219",
          "--color-divider": "229 231 235",
        },
      }),
  ],
};
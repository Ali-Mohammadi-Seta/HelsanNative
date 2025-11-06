/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class", // class-based dark mode (works with <View className="dark">)
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#16a34a",
          dark: "#22c55e",
        },
        background: {
          DEFAULT: "#ffffff",
          dark: "#121212",
        },
        card: {
          DEFAULT: "#f5f5f5",
          dark: "#1e1e1e",
        },
        text: {
          DEFAULT: "#000000",
          secondary: "#666666",
          dark: "#ffffff",
          "dark-secondary": "#aaaaaa",
        },
        border: {
          DEFAULT: "#e0e0e0",
          dark: "#333333",
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
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Adjust this path based on your project structure
    "./index.html",
  ],
  theme: {
    extend: {
      colors: { colorPrimary: "#16a34a" }, screens: {
        xs: '360px',
        '1xs': '468px',
        '2xs': { min: '500px', max: '575px' },
        // sm: '576px',
        // md: '768px',
        // lg: '992px',
        // xl: '1200px',
        // '2xl': '1600px',
        // '1sm': { min: '300px', max: '768px' },
      },
    },
  },
  plugins: [],
};

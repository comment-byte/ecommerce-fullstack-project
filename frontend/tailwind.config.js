// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // --- ADD THIS BLOCK ---
      colors: {
        amazon_blue: {
          light: '#232F3E',
          DEFAULT: '#131921',
        },
        amazon_orange: {
          light: '#FFD814',
          DEFAULT: '#F79B34',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'), // We'll use this for product titles
  ],
}
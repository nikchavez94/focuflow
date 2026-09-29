/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme'); // Import the default theme

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Add our custom font here
      fontFamily: {
        cursive: ['Satisfy', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
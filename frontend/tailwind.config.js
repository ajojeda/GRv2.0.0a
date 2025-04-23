/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/**/*.{js,ts,jsx,tsx}", // optional depth if you nest deeply
  ],
  theme: {
    extend: {
      colors: {
        sidebar: "#2C2C2C",
        sidebarText: "#E0E0E0",
      },
    },
  },
  plugins: [],
};

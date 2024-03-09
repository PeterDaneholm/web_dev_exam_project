/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#9BB0C1",
        primarydark: "#51829B",
        contrast: "#EADFB4",
        contrastdark: "#F6995C",
      }
    },
  },
  plugins: [],
}


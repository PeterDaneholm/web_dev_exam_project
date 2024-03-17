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
    keyframes: {
      'fade-in-out': {
        '0%': { opacity: '0' },
        '10%': { opacity: '1' },
        '90%': { opacity: '1' },
        '100%': { opacity: '0' },
      }
    },
    animation: {
      'fade-in-out': 'fade-in-out 5s ease-in-out',
    }
  },
  plugins: [],
}


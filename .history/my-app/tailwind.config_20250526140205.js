/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bebas: ['"Bebas Neue"', 'cursive'],
        raleway: ['Raleway', 'sans-serif'],
        jaro: ['Jaro', 'cursive'],
        lubrifont: ['Lubrifont', 'sans-serif'],
        barrio: ['Barrio', 'normal'],
        rubic: ['Rubic', 'nsans-serif'],
      },
    },
  },
  plugins: [],
}

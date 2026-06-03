/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1a3a2a',
          light: '#24503a',
          dark: '#102318',
        },
        sage: {
          DEFAULT: '#7da87b',
          light: '#9ec49c',
          dark: '#5e8a5c',
        },
        cream: {
          DEFAULT: '#faf7f2',
          dark: '#f0ebe2',
        },
        amber: {
          plant: '#f59e0b',
          light: '#fcd34d',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

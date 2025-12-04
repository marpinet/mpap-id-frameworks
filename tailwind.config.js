/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./*.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f9fce8',
          100: '#f3f8d1',
          200: '#e7f0a3',
          300: '#dce875',
          400: '#d0e047',
          500: '#c4d819', // Bright yellow-green
          600: '#9dad14',
          700: '#76820f',
          800: '#4e560a',
          900: '#272b05',
        },
        navy: {
          50: '#f0f1f5',
          100: '#e1e3eb',
          200: '#c3c7d7',
          300: '#a5abc3',
          400: '#878faf',
          500: '#4a5568', // Medium navy
          600: '#3d465a',
          700: '#30374c',
          800: '#23283e',
          900: '#161930', // Deep navy
        },
        cream: {
          50: '#fefdfb',
          100: '#fdfbf7',
          200: '#fbf7ef',
          300: '#f9f3e7',
          400: '#f7efdf',
          500: '#f5ebd7', // Cream
          600: '#c4bcac',
          700: '#938d81',
          800: '#625e56',
          900: '#312f2b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

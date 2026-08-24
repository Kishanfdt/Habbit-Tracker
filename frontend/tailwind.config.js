/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        notion: {
          bg: '#fbfbfa',
          text: '#37352f',
          muted: '#787774',
          subtle: '#9b9a97',
          border: '#e9e9e7',
          hover: '#f7f6f3',
          accent: '#2383e2',
          accentHover: '#1d6bf3',
          streak: '#d97706',
          streakBg: '#fef3c7',
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        surface: '#111827',
        muted: '#1f2937',
        accent: '#22d3ee'
      }
    }
  },
  plugins: []
};

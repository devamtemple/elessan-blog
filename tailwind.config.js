/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.md',
  ],
  theme: {
    extend: {
      colors: {
        parchment: '#FAF8F5',
        charcoal: '#2C2C2C',
        forest: '#4A6B5A',
        mist: '#8FA4A2',
        amber: '#C4956A',
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        prose: '680px',
      },
      lineHeight: {
        relaxed: '1.75',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

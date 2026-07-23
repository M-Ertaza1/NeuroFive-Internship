/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F5F6F8',
        ink: '#1B1F3B',
        amber: {
          DEFAULT: '#FFB800',
          dark: '#E6A400',
        },
        teal: {
          DEFAULT: '#0EA5A4',
          light: '#E5F7F6',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}

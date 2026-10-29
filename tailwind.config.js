/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        machine: {
          light: '#eae5d6',
          base: '#ded8c6',
          dark: '#cdc6b2',
          border: '#bcaf96',
          display: '#121413',
          screen: '#0f1110',
        },
        pass: {
          bg: '#fcfbf9',
          border: '#e2decb',
          blue: '#1b3b8a',
          label: '#60728c',
          text: '#1a1f2c',
        }
      },
      fontFamily: {
        mono: ['"SF Mono"', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'scanner': '0 25px 50px -12px rgba(50, 45, 35, 0.25), 0 10px 20px -5px rgba(50, 45, 35, 0.15)',
        'pass': '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)',
        'slot': 'inset 0 4px 8px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.4)',
      }
    },
  },
  plugins: [],
};

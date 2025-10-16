/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(10, 12, 20)',
        text: 'rgb(220, 255, 220)',
        accent: 'rgb(0, 255, 150)',
        'accent-dark': 'rgb(0, 200, 100)',
      },
      fontFamily: {
        sans: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        custom: '0 2px 8px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};
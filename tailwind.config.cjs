// tailwind.config.cjs
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false, // 🔥 DÉSACTIVE le reset de Tailwind (Preflight)
  },
  theme: {
    extend: {
      colors: {
        bg: 'rgb(10, 12, 20)',
        text: 'rgb(220, 255, 220)',
        accent: 'rgb(0, 255, 150)',
        'accent-dark': 'rgb(0, 200, 100)',
        gray: {
          light: 'rgb(40, 50, 50)',
          DEFAULT: 'rgb(80, 100, 100)',
          dark: 'rgb(200, 230, 200)',
        }
      },
      fontFamily: {
        sans: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      }
    },
  },
  plugins: [],
};
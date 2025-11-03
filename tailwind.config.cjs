module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false,
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
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(15px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      }
    },
  },
  plugins: [],
};
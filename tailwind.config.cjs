// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        text: "rgb(var(--text) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "IBM Plex Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 2px 8px rgba(0,0,0,0.5)",
      },
    },
  },
};

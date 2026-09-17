// astro.config.mjs
import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import mermaid from 'astro-mermaid';

export default defineConfig({
  site: "https://epitexam.github.io",
  base: "/",

  build: {
    format: "directory",
    assets: "_assets",
    inlineStylesheets: "auto",
  },

  fonts: [
    {
      name: "Geist",
      cssVariable: "--font-body",
      provider: fontProviders.bunny(),
      weights: ["400", "500"],
      styles: ["normal"],
      subsets: ["latin"]
    },
    {
      name: "Geist",
      cssVariable: "--font-title",
      provider: fontProviders.bunny(),
      weights: ["500", "600", "700"],
      styles: ["normal"],
      subsets: ["latin"]
    },
    {
      name: "Geist Mono",
      cssVariable: "--font-code",
      provider: fontProviders.bunny(),
      weights: ["400"],
      styles: ["normal"],
      subsets: ["latin"]
    }
  ],
  integrations: [
    mermaid({
      theme: 'dark',
      autoTheme: false,
      enableLog: false,
      mermaidConfig: {
        themeVariables: {
          fontFamily: 'sans-serif',
          background: 'transparent',
          primaryColor: 'transparent',
          primaryTextColor: 'rgb(232, 232, 234)',
          primaryBorderColor: 'rgba(232, 232, 234, 0.11)',
          lineColor: 'rgba(232, 232, 234, 0.30)',
        },
        flowchart: {
          htmlLabels: false,
          useMaxWidth: true,
          nodeSpacing: 60,
          rankSpacing: 80,
          padding: 20,
        },
      },
    }),
    mdx({
      optimize: true,
    }),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      filter: (page) => !page.includes("/muffin"),
    }),
  ],

  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.steamstatic.com",
      },
    ],
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: "lightningcss",
      minify: "esbuild",
      // Mermaid (~654K, lazy via dynamic import() uniquement sur pages avec diagrammes)
      // Seuil juste au-dessus pour garder un garde-fou sans bruit à chaque build.
      chunkSizeWarningLimit: 700,
    }
  },

  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },

  compressHTML: true,

  markdown: {
    shikiConfig: {
      theme: "css-variables",
      wrap: false,
    },
  },

  // NOTE: pas de `server.headers` ici — ils ne s'appliquent qu'au serveur de dev
  // et GitHub Pages (hébergeur statique) ne supporte aucun header custom.
  // Les vrais headers de sécurité (nosniff, frame-ancestors, ...) doivent être
  // définis au niveau du CDN/front (ex. Cloudflare) devant GitHub Pages.
});

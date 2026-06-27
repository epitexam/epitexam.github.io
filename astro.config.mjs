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
    inlineStylesheets: "always",
  },

  fonts: [
    {
      name: "Geist",
      cssVariable: "--font-body",
      provider: fontProviders.google(),
      weights: ["400", "500", "600"],
    },
    {
      name: "Hanken Grotesk",
      cssVariable: "--font-title",
      provider: fontProviders.fontsource(),
      weights: ["600", "700", "800"],
    },
    {
      name: "JetBrains Mono",
      cssVariable: "--font-code",
      provider: fontProviders.fontsource(),
      weights: ["400"],
    },
  ],

  integrations: [
    mdx({
      optimize: true,
    }),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
    }),
    mermaid({
      theme: 'dark',
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
      }
    })
  ],

  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
    domains: ["shared.fastly.steamstatic.com"],
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
      chunkSizeWarningLimit: 1000,
      rolldownOptions: {
        output: {
          codeSplitting: true,
        }
      }
    }
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },

  compressHTML: true,

  markdown: {
    shikiConfig: {
      theme: "css-variables",
      wrap: false,
    },
  },

  server: {
    headers: {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
    },
  },
});
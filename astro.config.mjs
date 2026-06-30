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
      name: "Inter",
      cssVariable: "--font-body",
      provider: fontProviders.google(),
      weights: ["400", "500"]
    },
    {
      name: "Geist",
      cssVariable: "--font-title",
      provider: fontProviders.google(),
      weights: ["500", "700"]
    },
    {
      name: "Intel One Mono",
      cssVariable: "--font-code",
      provider: fontProviders.google(),
      weights: ["400", "500"]
    }
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
      chunkSizeWarningLimit: 2500,
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
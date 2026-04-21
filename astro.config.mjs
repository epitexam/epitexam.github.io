// astro.config.mjs
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import d2 from "astro-d2";

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
      provider: fontProviders.fontsource(),
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
  integrations: [mdx({
    optimize: true,
  }), sitemap({
    changefreq: "weekly",
    priority: 0.7,
    lastmod: new Date(),
  }), d2({ sketch: true })],
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
      cssCodeSplit: true,
      minify: "esbuild",
      target: "esnext",
      chunkSizeWarningLimit: 500,
      modulePreload: {
        polyfill: true,
      },
      rollupOptions: {
        output: {
          entryFileNames: "entry.[hash].js",
          chunkFileNames: "chunks/[name].[hash].js",
          assetFileNames: "assets/[name].[hash][extname]",
        },
      },
    },
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
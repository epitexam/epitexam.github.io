// astro.config.mjs
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	site: 'https://epitexam.github.io',
	base: '/',
	build: {
		format: 'directory',
		assets: '_assets',
		inlineStylesheets: 'always',
	},
	integrations: [
		mdx({
			optimize: true,
		}),
		sitemap({
			changefreq: 'weekly',
			priority: 0.7,
			lastmod: new Date(),
		}),
	],
	image: {
		service: {
			entrypoint: 'astro/assets/services/sharp',
		},
		domains: [
			'shared.fastly.steamstatic.com',
		],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**.steamstatic.com',
			},
		],
	},
	vite: {
		plugins: [tailwindcss()],
		build: {
			cssMinify: 'lightningcss',
			cssCodeSplit: true,
			minify: 'esbuild',
			target: 'esnext',
			chunkSizeWarningLimit: 500,
			modulePreload: {
				polyfill: true,
			},
			rollupOptions: {
				output: {
					entryFileNames: 'entry.[hash].js',
					chunkFileNames: 'chunks/[name].[hash].js',
					assetFileNames: 'assets/[name].[hash][extname]',
				},
			},
		},
	},
	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'hover',
	},
	compressHTML: true,
	markdown: {
		shikiConfig: {
			theme: 'github-dark',
			wrap: false,
		},
	},
	server: {
		headers: {
			'X-Content-Type-Options': 'nosniff',
			'X-Frame-Options': 'DENY',
			'X-XSS-Protection': '1; mode=block',
		},
	},
});
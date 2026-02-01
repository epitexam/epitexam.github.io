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
		inlineStylesheets: 'auto',
	},

	integrations: [
		mdx({
			optimize: true,
			remarkPlugins: [],
			rehypePlugins: [],
		}),
		sitemap({
			changefreq: 'weekly',
			priority: 0.7,
			lastmod: new Date(),
		})
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
			cssMinify: "lightningcss",
			cssCodeSplit: true,
			minify: 'esbuild',
			target: 'esnext',
			chunkSizeWarningLimit: 500,
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (id.includes("node_modules")) {
							return "vendor";
						}

						if (id.includes("assets/")) {
							return "assets";
						}
					},
					entryFileNames: 'entry.[hash].js',
					chunkFileNames: 'chunks/[name].[hash].js',
					assetFileNames: 'assets/[name].[hash][extname]',
				}
			}
		},
	},

	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'viewport',
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
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
		}),
		sitemap({

			changefreq: 'weekly',
			priority: 0.7,
			lastmod: new Date(),
		})
	],

	image: {
		service: { entrypoint: 'astro/assets/services/sharp' },
		domains: [],
	},

	vite: {
		plugins: [tailwindcss()],
		build: {
			cssMinify: "lightningcss",
			cssCodeSplit: true,
			chunkSizeWarningLimit: 600,
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (id.includes("node_modules")) return "vendor";
					}
				}
			}
		}
	},

	prefetch: {
		defaultStrategy: "hover"
	},

	compressHTML: true,
});
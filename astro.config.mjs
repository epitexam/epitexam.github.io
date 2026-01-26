import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import compress from "astro-compress";
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	site: 'https://epitexam.github.io',
	base: '/',

	integrations: [
		mdx(),
		sitemap(),
		compress()
	],

	vite: {
		plugins: [tailwindcss()],

		build: {
			minify: "esbuild",
			cssMinify: true,
			chunkSizeWarningLimit: 500,

			rollupOptions: {
				output: {
					manualChunks(id) {
						if (id.includes("node_modules")) {
							return "vendor";
						}
					}
				}
			}
		}
	},

	build: {
		inlineStylesheets: "always",
		assets: '_assets',
	},

	prefetch: {
		defaultStrategy: "viewport"
	},

	compressHTML: true,
});

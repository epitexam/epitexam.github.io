// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	site: 'https://epitexam.github.io',
	base: '/',
	integrations: [mdx(), sitemap(),],
	vite: {
		plugins: [tailwindcss()],
		build:{
			chunkSizeWarningLimit:500
		}
	},
	build: {
		inlineStylesheets: "always",
		assets: '_assets',
	},
	prefetch: {
		prefetchAll: true,
		defaultStrategy: "hover"
	},
	compressHTML: true,

});

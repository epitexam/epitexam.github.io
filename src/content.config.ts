import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			heroImageDescription: z.string().optional(),
		}),
});

const projects = defineCollection({
	loader: glob({ base: './src/content/project', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		categoryTag: z.string().default("Full-Stack"),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: image().optional(),
		heroImageDescription: z.string().optional(),
		technologies: z.array(z.string()).default([]),
		liveUrl: z.string().url().optional(),
		sourceUrl: z.string().url().optional(),
		featured: z.boolean().default(false),
	}),
});

export const collections = { blog, projects };
